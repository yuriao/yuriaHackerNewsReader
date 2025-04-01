/**
 * Not found page for the web application
 */

import React from 'react';
import { Link } from 'wouter';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
      <h1 className="text-6xl font-bold text-orange-500 mb-6">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      
      <p className="text-gray-600 max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      
      <Link href="/">
        <a className="bg-orange-500 hover:bg-orange-600 text-white py-2 px-6 rounded-md transition-colors">
          Back to Home
        </a>
      </Link>
    </div>
  );
}