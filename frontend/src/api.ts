import axios from 'axios';
import { Product, Cart, ChatSession, ChatMessage, ChatMessageAction } from './types';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

export const getCatalog = async (search = '') => {
    const response = await api.get('/catalog', { params: { q: search } });
    return response.data as Product[];
}

export const getCart = async () => {
    const response = await api.get('/cart');
    return response.data as Cart;
}

export const addToCart = async (productId: number, quantity: number) => {
    const response = await api.post('/cart', {
        productId, quantity
    });
    return response.data as { id: number};
}

export const updateCartItemQuantity = async (cartId: number, productId: number, quantity: number) => {
    const response = await api.put(`/cart/${cartId}/items/${productId}`, {
        quantity
    });
    return response.data as Cart;
}

export const removeCartItem = async (cartId: number, productId: number) => {
    await api.delete(`/cart/${cartId}/items/${productId}`);
}

export const createChatSession = async () => {
    const response = await api.post('/chat-sessions');
    return response.data as ChatSession;
}

export const getChatMessages = async (sessionId: number) => {
    const response = await api.get(`/chat-sessions/${sessionId}/messages`);
    return response.data as ChatMessage[];
}

export const sendChatMessage = async (sessionId: number, message: string) => {
    const response = await api.post(`/chat-sessions/${sessionId}/messages`, {
        content: message
    });
    return response.data as ChatMessage;
}

export const executeChatAction = async (actionId: number) => {
    const response = await api.post(`/chat-actions/${actionId}`);
    return response.data as ChatMessageAction;
}
