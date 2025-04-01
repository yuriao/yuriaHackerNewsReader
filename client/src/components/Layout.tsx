/**
 * Layout component for the web application
 */

import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileMenu from './MobileMenu';

interface LayoutProps {
  children: ReactNode;
  toggleMobileMenu: () => void;
  mobileMenuOpen: boolean;
}

export default function Layout({ children, toggleMobileMenu, mobileMenuOpen }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header toggleMobileMenu={toggleMobileMenu} />
      
      <MobileMenu isOpen={mobileMenuOpen} />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}