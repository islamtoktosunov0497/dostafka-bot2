'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Link from 'next/link';

export const Header = ({ title }: { title: string }) => {
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="header">
      <div className="header-bg-text">MENU</div>
      <div className="header-overlay-text">Биздин меню</div>
      
      <Link href="/cart" style={{ 
        color: 'white', 
        position: 'absolute', 
        top: '20px', 
        right: '20px',
        background: 'rgba(255,255,255,0.1)',
        padding: '10px',
        borderRadius: '50%',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}>
        <ShoppingCart size={24} />
        {itemCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'white',
            color: 'black',
            fontSize: '10px',
            fontWeight: '900',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {itemCount}
          </span>
        )}
      </Link>
    </header>
  );
};
