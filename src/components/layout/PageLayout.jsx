import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PageLayout({ children }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <main className="flex-1 pt-14">
        {children}
      </main>
      <Footer />
    </div>
  );
}
