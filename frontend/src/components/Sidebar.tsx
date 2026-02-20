
'use client';
import Link from 'next/link';
import { MessageCircle, Search, ShoppingCart, ChefHat } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: "Chat", href: "/", icon: MessageCircle },
  { name: "Search", href: "/products", icon: Search },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "My recipes", href: "/recipes", icon: ChefHat }
];

export const Sidebar = () => {
  const pathname = usePathname(); 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="flex h-16 items-center justify-center border-b border-gray-800">
        <h1 className="text-xl font-bold">Supermarket</h1>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-2 px-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
                  pathname === item.href ? "bg-gray-800 text-white" : ""
                }`}
              >
                <item.icon
                  className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-white"
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};