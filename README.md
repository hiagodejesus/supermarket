# Supermarket AI

Este projeto é uma aplicação de supermercado que utiliza Inteligência Artificial para melhorar a experiência de compra do usuário, auxiliando na escolha de produtos e montagem de carrinhos baseados em receitas ou necessidades específicas.

## Funcionalidades Principais

- **Catálogo de Produtos:** Navegação e busca de produtos disponíveis nas lojas.
- **Carrinho de Compras:**
  - Adicionar e remover itens.
  - Ajuste de quantidade.
  - Visualização do total e resumo do pedido.
- **Assistente de Compras (IA):**
  - Chat interativo para auxiliar o usuário.
  - **Sugestão Inteligente:** O usuário pode solicitar receitas (ex: "Ingredientes para bolo de chocolate") e o sistema, utilizando a OpenAI, sugere os produtos ideais disponíveis no catálogo, agrupando-os por loja.

## Tecnologias Utilizadas

- **Frontend:** Next.js, React, Tailwind CSS.
- **Backend:** NestJS (Node.js).
- **Inteligência Artificial:** Integração com OpenAI (GPT-4 e Embeddings) para processamento de linguagem natural e busca semântica de produtos.

## Estrutura do Projeto

- `frontend/`: Contém a interface do usuário (Páginas de produtos, carrinho, chat).
- `backend/`: Contém a lógica de negócios, API e serviços de integração com LLM.