import type { Metadata } from "next";
import "../styles/globals.css";
import { TelegramProvider } from "../providers/TelegramProvider";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Pizza Delivery",
  description: "Order your favorite pizza through Telegram",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <head>
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body suppressHydrationWarning={true}>
        <TelegramProvider>
          {children}
        </TelegramProvider>
      </body>

    </html>
  );
}
