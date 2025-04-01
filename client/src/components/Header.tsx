/**
 * Header component for the web application
 */

import React from 'react';
import { Link } from 'wouter';

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export default function Header({ toggleMobileMenu }: HeaderProps) {
  return (
    <header className="bg-orange-500 text-black">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-xl font-bold">Hacker News Reader</a>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <Link href="/">
              <a className="hover:underline font-medium">Home</a>
            </Link>
            <Link href="/stories/top">
              <a className="hover:underline font-medium">Top</a>
            </Link>
            <Link href="/stories/new">
              <a className="hover:underline font-medium">New</a>
            </Link>
            <Link href="/stories/best">
              <a className="hover:underline font-medium">Best</a>
            </Link>
            <Link href="/stories/ask">
              <a className="hover:underline font-medium">Ask</a>
            </Link>
            <Link href="/stories/show">
              <a className="hover:underline font-medium">Show</a>
            </Link>
            <Link href="/stories/job">
              <a className="hover:underline font-medium">Jobs</a>
            </Link>
          </nav>
          
          <button 
            className="md:hidden p-2 rounded-md hover:bg-orange-600 focus:outline-none"
            onClick={toggleMobileMenu}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}