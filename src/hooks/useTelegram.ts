import { useState, useEffect } from 'react';

export const useTelegram = () => {
  const [tg, setTg] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      webApp.expand();
      setTg(webApp);
      
      const tgUser = webApp.initDataUnsafe?.user;
      if (tgUser) {
        setUser(tgUser);
      } else if (webApp.initData) {
        // Fallback: Try to parse initData manually if needed
        try {
          const params = new URLSearchParams(webApp.initData);
          const userStr = params.get('user');
          if (userStr) {
            setUser(JSON.parse(userStr));
          }
        } catch (e) {
          console.error('Error parsing initData:', e);
        }
      }
      
      // FOR DEVELOPMENT: If still no user, use a placeholder
      if (!tgUser && process.env.NODE_ENV === 'development') {
        setUser({ id: 8690873584, first_name: 'Dev User' });
      }
    }
  }, []);

  return {
    tg,
    user,
    onClose: () => tg?.close(),
// ...

    onToggleButton: () => {
      if (tg?.MainButton.isVisible) {
        tg.MainButton.hide();
      } else {
        tg.MainButton.show();
      }
    },
  };
};
