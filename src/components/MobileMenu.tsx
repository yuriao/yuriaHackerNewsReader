/**
 * Mobile menu component for the web application
 */

import React from 'react';
import { Link } from 'wouter';

interface MobileMenuProps {
  isOpen: boolean;
}

export default function MobileMenu({ isOpen }: MobileMenuProps) {
  // Don't render if menu is closed
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 md:hidden bg-white">
      <div className="h-full flex flex-col">
        <div className="bg-orange-500 py-3 px-4 flex justify-between items-center">
          <Link href="/">
            <a className="text-xl font-bold">Hacker News Reader</a>
          </Link>
          
          <button className="p-2 rounded-md hover:bg-orange-600 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 py-4 px-6 overflow-y-auto">
          <ul className="space-y-4">
            <li>
              <Link href="/">
                <a className="block py-2 px-3 text-lg font-medium hover:bg-gray-100 rounded-md">Home</a>
              </Link>
            </li>
            <li>
              <Link href="/stories/top">
                <a className="block py-2 px-3 text-lg font-medium hover:bg-gray-100 rounded-md">Top Stories</a>
              </Link>
            </li>
            <li>
              <Link href="/stories/new">
                <a className="block py-2 px-3 text-lg font-medium hover:bg-gray-100 rounded-md">New Stories</a>
              </Link>
            </li>
            <li>
              <Link href="/stories/best">
                <a className="block py-2 px-3 text-lg font-medium hover:bg-gray-100 rounded-md">Best Stories</a>
              </Link>
            </li>
            <li>
              <Link href="/stories/ask">
                <a className="block py-2 px-3 text-lg font-medium hover:bg-gray-100 rounded-md">Ask HN</a>
              </Link>
            </li>
            <li>
              <Link href="/stories/show">
                <a className="block py-2 px-3 text-lg font-medium hover:bg-gray-100 rounded-md">Show HN</a>
              </Link>
            </li>
            <li>
              <Link href="/stories/job">
                <a className="block py-2 px-3 text-lg font-medium hover:bg-gray-100 rounded-md">Jobs</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}