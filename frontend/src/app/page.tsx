'use client';
import { getCatalog } from "@/api";
import useSWR from "swr";

export default function Home() {
  const products = useSWR("/api/catalog", async () => getCatalog());
  return (
    <div
      className="grid grid-rows-[200px_1fr] gap-4 items-center justify-items-center h-full w-full"
    >
      <p>Em breve</p>
    </div>
  );
}
