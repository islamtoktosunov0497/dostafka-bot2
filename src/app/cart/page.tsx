'use client';

import { useCart } from '@/hooks/useCart';
import { useTelegram } from '@/hooks/useTelegram';
import { Header } from '@/components/layout/Header';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useCallback, useState } from 'react';

export default function CartPage() {
  const { items, removeItem, getTotalPrice } = useCart();
  const { tg, user } = useTelegram();
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) {
      setName(`${user.first_name} ${user.last_name || ''}`.trim());
    }
  }, [user]);

  const onSendData = useCallback(() => {
    const data = {
      items,
      totalPrice: getTotalPrice(),
      user: {
        id: user?.id,
        firstName: name || user?.first_name,
        lastName: user?.last_name,
        username: user?.username,
      },
      address,
      phone,
    };

    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(() => {
      tg?.sendData(JSON.stringify(data));
      tg?.close();
    });
  }, [items, getTotalPrice, user, tg, name, address, phone]);

  useEffect(() => {
    if (tg) {
      if (items.length > 0) {
        tg.MainButton.setParams({
          text: `Буйрутма берүү (${getTotalPrice().toLocaleString()} сом) / Заказать`,
          color: '#ffffff',
          text_color: '#000000',
          is_visible: true,
        });
        tg.MainButton.onClick(onSendData);
      } else {
        tg.MainButton.hide();
      }
    }
    return () => {
      tg?.MainButton.offClick(onSendData);
    };
  }, [tg, items, getTotalPrice, onSendData]);

  return (
    <main style={{ paddingBottom: '40px' }}>
      <Header title="Сават / Корзина" />
      
      <div className="container">
        <button onClick={() => router.back()} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'none',
          border: 'none',
          color: 'var(--text-dim)',
          cursor: 'pointer',
          marginBottom: '20px'
        }}>
          <ArrowLeft size={20} /> Кайтуу / Назад
        </button>

        {items.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.map((item) => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                borderRadius: '16px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '16px' }}>{item.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-dim)', marginTop: '4px' }}>
                    {item.quantity} x {item.price.toLocaleString()} сом
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ fontWeight: '900', color: 'white' }}>
                    {(item.price * item.quantity).toLocaleString()} сом
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)}
                    style={{ color: '#ff4d4d', background: 'rgba(255,77,77,0.1)', border: 'none', padding: '8px', borderRadius: '50%', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            <div style={{
              marginTop: '12px',
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: 'black'
            }}>
              <span style={{ fontSize: '16px', fontWeight: '700' }}>Жалпы / Итого:</span>
              <span style={{ fontSize: '20px', fontWeight: '900' }}>
                {getTotalPrice().toLocaleString()} сом
              </span>
            </div>

            {/* Delivery Form */}
            <div style={{
              marginTop: '20px',
              padding: '24px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              marginBottom: '100px'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', borderLeft: '4px solid white', paddingLeft: '12px' }}>
                Данные доставки
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Имя</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Введите ваше имя"
                  style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontSize: '16px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Телефон</label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+996 ..."
                  style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontSize: '16px' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-dim)' }}>Адрес</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Улица, дом, квартира"
                  style={{ padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'white', fontSize: '16px', minHeight: '100px', fontFamily: 'inherit' }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <ShoppingBag size={80} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '24px' }} />
            <p style={{ color: 'var(--text-dim)', fontSize: '18px', marginBottom: '32px' }}>Ваша корзина пуста</p>
            <button 
              onClick={() => router.push('/')}
              style={{ 
                padding: '16px 40px', 
                borderRadius: '40px', 
                background: 'white', 
                color: 'black', 
                border: 'none', 
                fontWeight: '800',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ВЕРНУТЬСЯ В МЕНЮ
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
