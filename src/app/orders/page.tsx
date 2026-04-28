'use client';

import { useEffect, useState } from 'react';
import { useTelegram } from '@/hooks/useTelegram';
import { Header } from '@/components/layout/Header';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { useCartStore } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { RefreshCcw } from 'lucide-react';

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: number | string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
}

export default function OrdersPage() {
  const { user } = useTelegram();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem, clearCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/orders?telegramId=${user.id}`)
        .then((res) => res.json())
        .then((data: Order[]) => {
          setOrders(data);
          setTimeout(() => setLoading(false), 0);
        })
        .catch(() => setTimeout(() => setLoading(false), 0));
    } else if (user === undefined) {
      setTimeout(() => setLoading(false), 0);
    }
  }, [user]);

  const handleReorder = (items: OrderItem[]) => {
    clearCart();
    items.forEach((item) => {
      addItem({
        id: item.productId,
        name: item.name,
        price: item.price,
      });
    });
    router.push('/cart');
  };

  return (
    <main>
      <Header title="Заказдарым / Заказы" />
      
      <div className="container">
        {loading ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>Жүктөлүүдө / Загрузка...</p>
        ) : orders.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orders.map((order) => (
              <div key={order.id} style={{
                padding: '16px',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 'bold', color: '#555' }}>№{order.id}</span>
                  <span style={{ color: '#888', fontSize: '14px' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div style={{ marginBottom: '12px', borderTop: '1px dashed #eee', paddingTop: '8px' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ fontSize: '14px', color: '#555', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.name} x {item.quantity}</span>
                      <span>{(item.price * item.quantity).toLocaleString()} сом</span>
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                  <span style={{ fontWeight: '800', fontSize: '16px', color: 'var(--primary)' }}>
                    {order.totalPrice.toLocaleString()} сом
                  </span>
                  <button 
                    onClick={() => handleReorder(order.items)}
                    className="btn-secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', padding: '6px 12px', borderRadius: '15px' }}
                  >
                    <RefreshCcw size={14} />
                    Кайра заказ / Повторить
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>
            <p>Заказдар жок / Заказов нет</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}
