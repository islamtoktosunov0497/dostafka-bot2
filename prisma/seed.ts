import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();

  const foods = [
    // PIZZAS
    {
      name: 'Маргарита (Пицца)',
      description: 'Классикалык пицца: помидор жана моцарелла. / Классическая пицца: томаты и моцарелла.',
      price: 500,
      image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Пеперони (Пицца)',
      description: 'Ачуу пеперони жана моцарелла сыры. / Острые пепперони и сыр моцарелла.',
      price: 500,
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Төрт сыр (Пицца)',
      description: 'Пармезан, моцарелла, чеддер жана дорблю. / Пармезан, моцарелла, чеддер и дорблю.',
      price: 500,
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Мексикалык (Мексиканская)',
      description: 'Ачуу калемпир, эт жана жүгөрү менен. / С острым перцем, мясом и кукурузой.',
      price: 500,
      image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=800&q=80',
    },
    
    // SUSHI
    {
      name: 'Филадельфия (Суши)',
      description: 'Лосось, каймак сыры жана бадыраң. / Лосось, сливочный сыр и огурец.',
      price: 500,
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Калифорния (Суши)',
      description: 'Краб эти, авокадо жана тобико икрасы. / Крабовое мясо, авокадо и икра тобико.',
      price: 500,
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
    },


    {
      name: 'Ажыдаар ролл (Дракон ролл)',
      description: 'Угөр, авокадо жана унаги соусу. / Угорь, авокадо и соус унаги.',
      price: 500,
      image: 'https://images.unsplash.com/photo-1617196034183-421b4917c92d?auto=format&fit=crop&w=800&q=80',
    },
    {
      name: 'Темпура ролл (Запеченный)',
      description: 'Кытырак куурулган ролл, креветка менен. / Хрустящий жареный ролл с креветкой.',
      price: 500,
      image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=800&q=80',
    }
  ];

  for (const food of foods) {
    await prisma.product.create({
      data: food,
    });
  }

  console.log('Seeding finished with Pizza and Sushi.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
