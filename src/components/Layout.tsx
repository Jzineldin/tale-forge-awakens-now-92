
import React, { useEffect } from 'react';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import { useHeaderVisibility } from '@/context/HeaderVisibilityContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isHeaderVisible, showHeader, hideHeader } = useHeaderVisibility();

  useEffect(() => {
    // Show header for all routes except the landing page
    if (location.pathname === '/') {
      hideHeader();
    } else {
      showHeader();
    }
  }, [location.pathname, showHeader, hideHeader]);

  return (
    <div className="min-h-screen relative" style={{ background: 'transparent' }}>
      {/* Header with smooth transition */}
      <div 
        className={`transition-all duration-500 ease-in-out ${
          isHeaderVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <Header />
      </div>
      <main className="relative z-10" style={{ background: 'transparent' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
