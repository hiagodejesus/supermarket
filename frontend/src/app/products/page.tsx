"use client";

import { addToCart, getCatalog } from "@/api";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import useSWR from "swr";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";

  const { data } = useSWR(`/api/catalog?q=${search}`, async () => getCatalog(search));

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    window.history.pushState({}, "", `?search=${event.target.value}`);
  }

  const handleCart = async (productId: number) => {
    await addToCart(productId, 1);
    toast.success("Product added to cart");
  }

  return (
    <div className="p-6 pt-20 lg:pt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Search products</h1>
        <p className="text-gray-600 mt-2">Find best products and price</p>

        <Input placeholder="Search products..." className="max-w-xs" onChange={handleSearch} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {data?.map((product) => (
            <div key={product.id} className="p-4 border rounded-lg shadow">
              <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>              
              <div className="flex justify-between items-center mt-4">
                <p className="text-lg font-semibold">$ {product.price}</p>
              </div>
              <button 
                onClick={() => handleCart(product.id)}
                className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 cursor-pointer"
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
