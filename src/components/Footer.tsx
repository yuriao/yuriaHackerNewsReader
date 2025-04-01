/**
 * Footer component for the web application
 */

import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Hacker News Reader - Not affiliated with Hacker News / Y Combinator
            </p>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://news.ycombinator.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-orange-500 text-sm"
            >
              Official Hacker News
            </a>
            <a 
              href="https://github.com/HackerNews/API" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-orange-500 text-sm"
            >
              HN API
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-orange-500 text-sm"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}