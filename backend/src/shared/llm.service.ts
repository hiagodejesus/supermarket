import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { OpenAI } from 'openai';
import { z } from 'zod';
import { zodTextFormat } from 'openai/helpers/zod';
import { CreateEmbeddingResponse } from "openai/resources/embeddings.js";


const answerMessageSchema = z.object({
    action: z.discriminatedUnion('type', [
        z.object({
            type: z.literal('send_message'),
        }),
        z.object({
            type: z.literal('suggest_carts'),
            payload: z.object({
                input: z.string(),
            }),
        }),
    ]),
    message: z.string().optional(),
    input: z.string().optional(),
});

const suggestCartSchema = z.object({
    carts: z.array(
        z.object({
            store_id: z.number(),
            score: z.number(),
            products: z.array(
                z.object({
                    id: z.number(),
                    name: z.string(),
                    quantity: z.number(),
                })
            ),
        })
    ),
    response: z.string(),
});

type AnswerMessage = z.infer<typeof answerMessageSchema>;

@Injectable()
export class LlmService {
    static readonly ANSWER_MESSAGE_PROMPT = `Você é um assistente de um marketplace com conhecimentos gastronômicos. 
    Sua missão é ajudar os clientes a encontrar produtos culinários de qualidade, fornecer recomendações de receitas e ofertas especiais. 
    Responda de forma amigável, informativa e sempre considerando as preferências e restrições dietéticas dos usuários.
    Identifique qual ação o usuário está solicitando:
    - 'send_message': Use essa ação para responder o usuário antes de enviar alguma ação. Caso o usuário tenha solicitado uma ação,
    mas você ainda precise de mais informações, use essa ação para perguntar ao usuário. Informe em "message" a resposta do assistente.
    - 'suggest_carts': Use essa ação apenas quando já tiver todas as informações necessárias para sugerir um carrinho de compras.
    Informe em "input" uma descrição do que o usuário está solicitando, junto a uma lista de produtos que você sugeriria para o carrinho.
    A mensagem que acompanha essa ação deve ser uma confirmação para o usuário, perguntando se ele confirma a ação de montar o carrinho de compras.
    
    Exemplo:
    - Mensagem do usuário: "Montar um carrinho para receita de bolo de chocolate"
    - Resposta do assistente: "Você solicitou um bolo de chocolate. Confirma a ação para que possamos montar o carrinho de compras?"
    - Input: "Bolo de chocolate. Ingredientes: farinha, açucar, ovos, chocolate meio amargo, fermento em pó."

    Não use a ação 'suggest_carts' para responder o usuário, apenas para sugerir um carrinho de compras.
    Use a ação 'send_message' para responder o usuário.
    Não precisa ir muito afundo em detalhes, se o usuário solicitar um bolo de chocolate, você pode sugerir um carrinho com ingredientes básicos,
    ao invés de perguntar se ele prefere chocolate meio amargo ou ao leite ou pedir detalhes sobre a receita, pois o usuário pode inserir esses detalhes depois.
    `;

    static readonly SUGGEST_CARTS_PROMPT = `
    Você é um assistente de compras útil. Baseado na solicitação do usuário e na lista de produtos disponíveis, sugira os melhores carrinhos de compras.
    Agrupe os produtos por loja e calcule um score para cada carrinho baseado na relevância dos produtos.

    Exemplo:
    - Input: "Bolo de chocolate. Ingredientes: farinha, açucar, ovos, chocolate meio amargo, fermento em pó."
    - Products: A lista de produtos disponiveis por loja
    - Answer: {"carts": [{"store_id": 1, "products": [{"id": 1, "name": "farinha", "quantity": 1}], "score": 100}]}
    `;


    private client: OpenAI;

    constructor(private readonly configService: ConfigService) {
        this.client = new OpenAI({
            apiKey: this.configService.getOrThrow('OPEN_AI_API_KEY'),
            webhookSecret: this.configService.get<string>('OPEN_AI_WEBHOOK_SECRET')
        });
    }

    async suggestCarts(similarProductsByStore: {
        store_id: number, products: {id: number, name: string, price: number, similarity: number}[];
    }[], input: string) {   
        try {
            const response = await this.client.responses.parse({
                model: 'gpt-4.1-nano',
                messages: [
                    { role: 'system', content: LlmService.SUGGEST_CARTS_PROMPT },
                    { role: 'user', content: `Input do usuário: ${input}\n\nProducts: ${JSON.stringify(similarProductsByStore)}` }
                ],
                text: {
                    format: zodTextFormat(suggestCartSchema, 'suggestCartSchema')
                }
            });

            if (!response || !response.output_parsed) {
                return null;
            }

            return {
                ...response.output_parsed,
                responseId: response.id
            };

        } catch {
            return null;
        }
    }

    async batchEmbedProducts(products: {id: number, name: string}[]) {
        const jsonFile = products.map((product) => ({
            custom_id: product.id.toString(),
            method: 'POST',
            url: 'v1/embeddings',
            body: {
                model: 'text-embedding-3-small',
                input: product.name,
            },
        })).join("\n");

        const uploadedFile = await this.client.files.create({
            file: new File([jsonFile], 'products.json', {
                type: 'application/json'
            }),
            purpose: 'batch',
        });

        if(!uploadedFile) {
            return null;
        }

        await this.client.batches.create({
            input_file_id: uploadedFile.id,
            completion_window: '24h',
            endpoint: '/v1/embeddings',
        })
    }

    async handleWebhookEvent(rawBody: string, headers: Record<string, string>) {
        const event = await this.client.webhooks.unwrap(rawBody, headers);

        if (event.type !== 'batch.completed') {
            return;
        }

        const batch = await this.client.batches.retrieve(event.data.id);

        if (!batch || !batch.output_file_id) {
            return;
        }

        const outputFile = await this.client.files.content(batch.output_file_id);

        if (!outputFile) {
            return;
        }

        const results = (await outputFile.text()).split('\n').filter((line) => line.trim() !== '').map((line) => {
            const data = JSON.parse(line) as {
                custom_id: string;
                response: {
                    body: CreateEmbeddingResponse;
                }
            };
            return {
                customId: data.custom_id,
                embedding: data.response.body.data[0].embedding,
            };
        }).filter((result) => result.customId && result.embedding);
        return results;
    }

    async embedInput(input: string): Promise<{ embedding: number[] } | null> {
        try {
            const response = await this.client.embeddings.create({
                input,
                model: 'text-embedding-3-small'
            });
            return {embedding: response.data[0].embedding};

        } catch (error) {
            console.error('Error embedding input:', error);
            return null;
        }
    }

    async answerMessage(message: string, previousMessageId: string | null = null): Promise<AnswerMessage & {responseId: string} | null> {
        try {
            const response = await this.client.responses.parse({
                previous_response_id: previousMessageId,
                model: 'gpt-4.1-nano',
                instructions: LlmService.ANSWER_MESSAGE_PROMPT,
                input: message,
                text: {
                    format: zodTextFormat(answerMessageSchema, "answerSchema")
                }
            });

            if (!response.output_parsed) {
                return null;
            }

            return {
                ...response.output_parsed,
                responseId: response.id,
            };
        } catch (error) {
            console.error('Error parsing message with LLM:', error);
            return null;
        }
    }
}