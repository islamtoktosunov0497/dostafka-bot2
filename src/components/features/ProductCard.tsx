'use client';

import { useCart } from '@/hooks/useCart';
import { Plus, Minus } from 'lucide-react';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description?: string | null;
  price: number;
  image?: string | null;
}

export const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const { addItem, removeItem, items } = useCart();
  const cartItem = items.find((item) => item.id === product.id);
  const quantity = cartItem?.quantity || 0;

  const isTop = index < 3;

  return (
    <div className="product-card">
      {isTop && <div className="top-badge">TOP {index + 1}</div>}
      
      <div className="plate-container">
        <Image 
          src={product.image || 'https://via.placeholder.com/150'} 
          alt={product.name} 
          fill
          loading="eager"
        />
      </div>
      
      <h3 className="product-name">{product.name}</h3>
      <p className="product-description">{product.description}</p>
      <div className="product-price">{product.price.toLocaleString()} сом</div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
        {quantity > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button className="add-btn" onClick={() => removeItem(product.id)}>
              <Minus size={14} />
            </button>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{quantity}</span>
            <button className="add-btn" onClick={() => addItem(product)} style={{ background: 'white', color: 'black' }}>
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button className="add-btn" onClick={() => addItem(product)}>
            <Plus size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
