import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = process.env.NEXT_PUBLIC_WEBAPP_URL;
const adminId = process.env.ADMIN_ID;

if (!token) {
  throw new Error('TELEGRAM_BOT_TOKEN must be provided!');
}

const bot = new Telegraf(token);

// Professional Welcome Message
bot.start((ctx) => {
  const welcomeMessage = `🌟 *Кош келиңиз / Добро пожаловать!*\n\n` +
    `Менюну ачып, сүйүктүү тамактарыңызды тандаңыз ↓\n` +
    `Откройте меню и выберите блюда ↓`;


  ctx.reply(welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{ text: '🍽️ Менюну ачуу / Открыть меню', web_app: { url: webAppUrl || '' } }]
      ]
    }
  });
});

// Notifications are handled by the API directly


bot.launch();

console.log('Professional Bot is running...');

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
