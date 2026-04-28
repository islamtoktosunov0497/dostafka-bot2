import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const telegramId = searchParams.get('telegramId');

  if (!telegramId) {
    return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        user: {
          telegramId: BigInt(telegramId),
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Convert BigInt to string for JSON serialization
    const serializedOrders = orders.map(order => ({
      ...order,
      id: order.id.toString(),
    }));

    return NextResponse.json(serializedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, totalPrice, user } = body;

    let userId = user?.id;
    
    // Fallback for development/testing
    if (!userId && process.env.NODE_ENV === 'development') {
      userId = 8690873584; // Using Admin ID as fallback
    }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const userData = user || { id: userId, firstName: 'Guest', lastName: '', username: 'guest' };


    // Upsert user
    const dbUser = await prisma.user.upsert({
      where: { telegramId: BigInt(userData.id) },
      update: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
      },
      create: {
        telegramId: BigInt(userData.id),
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: userData.username,
      },
    });


    // Create order
    const order = await prisma.order.create({
      data: {
        userId: dbUser.id,
        items: items,
        totalPrice: totalPrice,
        address: body.address,
        phone: body.phone,
        status: 'PENDING',
      },
    });


    // Notify Admin via Telegram API
    const adminId = process.env.ADMIN_ID;
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    
    if (adminId && botToken) {
      let adminMessage = `🚀 *ЖАҢЫ ЗАКАЗ #ORD-${order.id}*\n\n`;
      adminMessage += `👤 *Кардар:* ${userData.firstName} ${userData.lastName || ''}\n`;
      adminMessage += `📱 *Телефон:* \`${body.phone || 'жазылган эмес'}\`\n`;
      adminMessage += `🏠 *Дарек:* \`${body.address || 'жазылган эмес'}\`\n`;
      adminMessage += `🆔 *ID:* \`${userData.id}\`\n\n`;
      adminMessage += `🍕 *Тандалган пиццалар:*\n`;
      
      items.forEach((item: any) => {
        adminMessage += `▪️ ${item.name} x ${item.quantity} — *${(item.price * item.quantity).toLocaleString()} сом*\n`;
      });

      adminMessage += `\n💰 *Жалпы сумма:* \`${totalPrice.toLocaleString()} сом\``;
      adminMessage += `\n\n🕒 *Убактысы:* ${new Date().toLocaleString('kg-KG')}`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: adminId,
            text: adminMessage,
            parse_mode: 'Markdown',
          }),
        });
      } catch (err) {
        console.error('Failed to notify admin via API:', err);
      }
    }

    // Notify Customer via Telegram API
    if (userData.id && botToken) {
      const customerMessage = `✅ *Рахмат! Заказыңыз кабыл алынды.*\n` +
        `🕒 Болжолдуу жеткирүү убактысы: *30–40 мүнөт*\n\n` +
        `✅ *Спасибо! Ваш заказ принят.*\n` +
        `🕒 Ориентировочное время доставки: *30–40 минут*`;

      try {
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: userData.id,
            text: customerMessage,
            parse_mode: 'Markdown',
          }),
        });
      } catch (err) {
        console.error('Failed to notify customer via API:', err);
      }
    }

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

