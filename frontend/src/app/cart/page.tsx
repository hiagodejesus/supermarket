'use client';
import { getCart, removeCartItem, updateCartItemQuantity } from '@/api';
import { Button } from '@/components/ui/button';
import useSWR from 'swr';


const CartPage = () => {
    const cart = useSWR('/cart', async () => getCart());

    const handleUpdateQuantity = async (itemId: number, quantity: number) => {
        if (!cart.data) return;
        console.log(cart.data);
        await cart.mutate(async (currentCart) => {
            if (quantity < 1) {
                await removeCartItem(currentCart!.id, itemId)
            } else {
                await updateCartItemQuantity(currentCart!.id, itemId, quantity);
            }
            return {
                ...currentCart!,
                items: currentCart!.items.map((item) =>
                    item.id === itemId ? { ...item, quantity } : item
                ).filter(item => item.quantity > 0),
            };
        }, {
            optimisticData: (currentCart) => ({
                ...currentCart!,
                items: currentCart!.items.map((item) =>
                    item.id === itemId ? { ...item, quantity } : item
                ),
            }),
        });
    };

    const total = cart.data?.items.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cart.data?.items.map((item) => (
                            <div key={item.id} className='flex flex-col justify-between p-4 border rounded-lg shadow-sm'>
                                <div>
                                    <h3 className='text-lg font-semibold'>{item.name}</h3>
                                    <p className='text-sm text-gray-500 mb-2'>{cart.data?.store.name}</p>
                                    <p className='text-lg font-bold mb-4'>$ {item.price}</p>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-2'>
                                        <Button size="sm" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</Button>
                                        <span className="w-4 text-center">{item.quantity}</span>
                                        <Button size="sm" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</Button>
                                    </div>
                                    <Button size="sm" variant="destructive" onClick={() => handleUpdateQuantity(item.id, 0)}>Remove</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {cart.data?.items.length === 0 && (
                        <div className='text-center p-4'>Cart empty</div>
                    )}
                </div>
                <div className="w-full lg:w-80">
                    <div className="p-6 border rounded-lg shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Summary</h2>
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-600">Total</span>
                            <span className="text-2xl font-bold">R$ {(total / 100).toFixed(2)}</span>
                        </div>
                        <Button className="w-full">Checkout</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CartPage;