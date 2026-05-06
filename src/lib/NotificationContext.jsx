import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const NotificationContext = createContext();

const BAR_HEIGHT = 40; // px

export function NotificationProvider({ children }) {
  const [showNotifBar, setShowNotifBar] = useState(() => !sessionStorage.getItem('nb_dismissed'));
  const [showEmailBar, setShowEmailBar] = useState(false);
  const timerRef = useRef(null);

  const barHeight = (showNotifBar || showEmailBar) ? BAR_HEIGHT : 0;

  const dismissNotifBar = () => {
    sessionStorage.setItem('nb_dismissed', '1');
    setShowNotifBar(false);
    if (!sessionStorage.getItem('email_sub_dismissed')) {
      timerRef.current = setTimeout(() => {
        if (!sessionStorage.getItem('email_sub_dismissed')) {
          setShowEmailBar(true);
        }
      }, 5 * 60 * 1000);
    }
  };

  const dismissEmailBar = () => {
    sessionStorage.setItem('email_sub_dismissed', '1');
    setShowEmailBar(false);
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <NotificationContext.Provider value={{ showNotifBar, showEmailBar, barHeight, dismissNotifBar, dismissEmailBar }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => useContext(NotificationContext);
