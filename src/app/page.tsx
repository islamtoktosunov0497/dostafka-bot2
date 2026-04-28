import prisma from '@/lib/prisma';
import { ProductCard } from '@/components/features/ProductCard';
import { BottomNavigation } from '@/components/layout/BottomNavigation';
import { Header } from '@/components/layout/Header';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products = [];
  try {
    products = await prisma.product.findMany({
      orderBy: {
        name: 'asc'
      }
    });
  } catch (error) {
    console.error('Database fetch error:', error);
  }

  return (
    <main>
      <Header title="Our Menu" />

      <div className="container">
        {products.length > 0 ? (
          <div className="product-grid" style={{ paddingBottom: '100px' }}>
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>

        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
            <p>Маалымат жүктөөдө ката кетти же меню бош.</p>
            <p style={{ fontSize: '12px' }}>Ошибка загрузки данных или меню пусто.</p>
          </div>
        )}
      </div>

      <BottomNavigation />
    </main>
  );
}

