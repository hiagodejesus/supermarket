"use client";

import { getCatalog } from "@/api";
import { Input } from "@/components/ui/input";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

const ProductsPage = () => {
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || "";

  const { data } = useSWR(`/api/catalog?q=${search}`, async () => getCatalog(search));

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    window.history.pushState({}, "", `?search=${event.target.value}`);
  }

  return (
    <div>
      <Input placeholder="Search products..." className="max-w-xs" onChange={handleSearch} />
      {data?.map((product) => (
        <div key={product.id} className="p-4 border-b">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <p className="text-sm text-gray-500">
            R$ {(product.price / 100).toFixed(2)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProductsPage;
