import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { PostgresService } from '../shared/postgres.service';
import { LlmService } from '../shared/llm.service';
import { ConfigService } from '@nestjs/config';

type Product = {
    id: number;
    name: string;
    price: number;
    embedding: number[] | null;
    store: {
        id: number;
        name: string;
    };
}

@Injectable()
export class CatalogService implements OnApplicationBootstrap {
    constructor(
        private readonly postgresService: PostgresService,
        private llmService: LlmService,
        private configService: ConfigService
    ) {}

    async onApplicationBootstrap() {
        if (this.configService.get<string>('NODE_ENV') === 'test') {
            return;
        }

        const products = await this.postgresService.client.query<Product>(
            `SELECT id, name FROM products WHERE embedding IS NULL`
        );
        await this.llmService.batchEmbedProducts(products.rows);
    }

    async handleEmbeddingWebhook(rawBody: string, headers: Record<string, string>) {
        const results = await this.llmService.handleWebhookEvent(rawBody, headers);
        if (!results || results.length === 0) {
            return;
        }
        for (const result of results) {
            const { customId, embedding } = result;
            await this.postgresService.client.query(
                `UPDATE products SET embedding = $1::vector WHERE id = $2`,
                [JSON.stringify(embedding), customId]
            );  
        }
    }

    async getCatalog(search = '') {
        let query = `SELECT products.id, products.name, products.price, products.embedding, 
        json_build_object('id', stores.id, 'name', stores.name) AS store FROM products
        JOIN stores ON products.store_id = stores.id`;

        const params: string[] = [];
    
        if (search) {
            query += ` WHERE products.name ILIKE $1`;
            params.push(`%${search}%`);
        }
    
        const result = await this.postgresService.client.query<Product>(
            query, params.length > 0 ? params : undefined
        );
        return result.rows;
    }
}