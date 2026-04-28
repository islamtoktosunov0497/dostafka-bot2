'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const TelegramContext = createContext<any>({
  tg: null,
  user: null,
});

export const TelegramProvider = ({ children }: { children: React.ReactNode }) => {
  const [tg, setTg] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand();
      setTg(webApp);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ tg, user: tg?.initDataUnsafe?.user }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
