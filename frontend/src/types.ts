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