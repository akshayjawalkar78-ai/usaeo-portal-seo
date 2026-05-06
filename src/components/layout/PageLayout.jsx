import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { AnnouncementNotifBar, EmailSubBar } from './NotificationBar';
import { useNotification } from '@/lib/NotificationContext';

export default function PageLayout({ children }) {
  const { barHeight } = useNotification();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnnouncementNotifBar />
      <EmailSubBar />
      <Navbar />
      <main className="flex-1" style={{ paddingTop: `calc(3.5rem + ${barHeight}px)` }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
