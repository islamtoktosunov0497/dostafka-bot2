'use client';

import { Home, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomNavigation = () => {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <Link 
        href="/" 
        className={`nav-item ${pathname === '/' ? 'active' : ''}`}
      >
        <Home size={20} />
        <span>Башкы / Главная</span>
      </Link>
      <Link 
        href="/orders" 
        className={`nav-item ${pathname === '/orders' ? 'active' : ''}`}
      >
        <ClipboardList size={20} />
        <span>Заказдар / Заказы</span>
      </Link>
    </nav>
  );
};
