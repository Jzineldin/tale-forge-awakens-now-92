
import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import { useHeaderVisibility } from '@/context/HeaderVisibilityContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isHeaderVisible } = useHeaderVisibility();
  const location = useLocation();
  
  // Always show header except when explicitly hidden
  const showHeader = isHeaderVisible;

  return (
    <div className="min-h-screen scene-bg">
      {showHeader && <Header />}
      <main className="min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
