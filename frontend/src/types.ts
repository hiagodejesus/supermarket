export type Product = {
    id: number;
    name: string;
    price: number;
    store_id: number;
    embedding: number[] | null;
}


export type Cart = {
    id: number;
    user_id: number;
    created_at: Date;
    store_id: number;
    active: boolean;
    store: {
        name: string;
    };
    total: number;
    items: {
        id: number,
        name: string,
        price: number,
        quantity: number
    }[];
}


export type ChatSession = {
    id:number;
    created_at: Date;
    user_id: number;
}

export type ChatMessage = {
    id: number;
    content: string;
    sender: 'user' | 'assistant';
    openai_message_id: string | null;
    created_at: Date;
    message_type: 'text' | 'suggest_carts_result';
}

export type ChatMessageAction = {
    id: number;
    chat_message_id: number;
    action_type: string;
    payload: { input: string};
    created_at: Date;
    confirmed_at: Date | null;
    executed_at: Date | null;
}

type SimilarProducts = {
    store_id: number;
    products: {
        id: number;
        name: string;
        price: number;
        similarity: number;
    }[];
}