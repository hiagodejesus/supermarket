CREATE EXTENSION IF NOT EXISTS vector;

DROP TABLE IF EXISTS carts CASCADE;
DROP TABLE IF EXISTS cart_items CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS chat_sessions CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS chat_messages_actions CASCADE;

CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    store_id INTEGER REFERENCES stores(id),
    embedding VECTOR(1536)
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    chat_session_id INTEGER REFERENCES chat_sessions(id),
    content TEXT NOT NULL,
    sender VARCHAR(255) NOT NULL CHECK (sender IN ('user', 'assistant')),
    openai_message_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    message_type VARCHAR(255) NOT NULL CHECK (message_type IN ('text', 'suggest_carts_result')) DEFAULT 'text'
);

CREATE TABLE chat_messages_actions (
    id SERIAL PRIMARY KEY,
    chat_message_id INTEGER REFERENCES chat_messages(id),
    action_type VARCHAR(255) NOT NULL CHECK (message_type IN ('text', 'suggest_carts_result')) DEFAULT 'text',
    payload JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP DEFAULT NULL,
    executed_at TIMESTAMP DEFAULT NULL,
    CONSTRAINT unique_chat_message_action UNIQUE (chat_message_id, action_type)

);

CREATE TABLE carts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    store_id INTEGER REFERENCES stores(id),
    active BOOLEAN DEFAULT TRUE,
    score INTEGER DEFAULT NULL,
    suggested_by_message_id INTEGER REFERENCES chat_messages(id)
);

CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES carts(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
);

INSERT INTO users (name, email, password) VALUES
('João Silva', 'joao.silva@example.com', 'password123'),
('Maria Oliveira', 'maria.oliveira@example.com', 'password456'),
('Carlos Santos', 'carlos.santos@example.com', 'password789');

INSERT INTO stores (name) VALUES
('Supermercado Nova Era'),
('Baratão da Carne'),
('Supermercado DB');

INSERT INTO products (name, price, store_id) VALUES
('Arroz', 10, 1),
('Feijão', 8, 1),
('Macarrão', 5, 1),
('Óleo', 12, 1),
('Sal', 3, 1),
('Açúcar', 6, 1),
('Café', 15, 1),
('Leite', 4, 1),
('Pão', 2, 1),
('Leite em Pó', 18, 1),
('Molho de Tomate', 7, 1),
('Farinha de Trigo', 9, 1),
('Carne Bovina', 25, 2),
('Frango', 15, 2),
('Peixe', 20, 2),
('Linguiça', 18, 2),
('Bacon', 22, 2),
('Salsicha', 10, 2),
('Hambúrguer', 12, 2),
('Alcatra', 30, 2),
('Picanha', 35, 2),
('Costela', 28, 2),
('Coxinha da Asa', 16, 2),
('Frango a Passarinho', 14, 2),
('Coca-Cola', 5, 3),
('Guaraná', 4, 3),
('Suco de Laranja', 6, 3),
('Água Mineral', 2, 3),
('Cerveja', 8, 3),
('Vinho', 20, 3),
('Whisky', 50, 3),
('Vodka', 30, 3),
('Rum', 25, 3),
('Tequila', 40, 3),
('Cachaça', 15, 3);

INSERT INTO carts (user_id, store_id) VALUES
(1, 1),
(2, 2),
(3, 3);

INSERT INTO cart_items (cart_id, product_id, quantity) VALUES
(1, 1, 2),
(1, 3, 1),
(2, 5, 4),
(2, 7, 2),
(3, 10, 1),
(3, 12, 3);