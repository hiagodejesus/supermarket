import type React from "react";
import { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Sidebar } from "../components/Sidebar";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Supermarket",
  description: "Your AI-powered shopping assistant",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 overflow-auto lg:ml-0">
              <div className="lg:pl-0 pl-0">{children}</div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
