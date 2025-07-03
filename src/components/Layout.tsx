
import React from 'react';
import Header from './Header';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen relative" style={{ background: 'transparent' }}>
      <Header />
      <main className="relative z-10" style={{ background: 'transparent' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
