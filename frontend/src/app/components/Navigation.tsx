'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, Search, Target } from 'lucide-react';
import SearchModal from './SearchModal';
import type { HikeSummary } from '../../types';

interface NavigationProps {
  hikes?: HikeSummary[];
}

// Custom hook to get pathname that works with both App and Pages router
const useCurrentPath = () => {
  const [pathname, setPathname] = useState('');

  useEffect(() => {
    // Try App Router first
    try {
      const { usePathname } = require('next/navigation');
      setPathname(usePathname());
      return;
    } catch (e) {
      // Fallback to Pages Router
      try {
        const { useRouter } = require('next/router');
        const router = useRouter();
        setPathname(router.pathname || router.asPath);
        return;
      } catch (e) {
        // Fallback to window.location
        setPathname(window.location.pathname);
      }
    }
  }, []);

  return pathname;
};

const Navigation = ({ hikes = [] }: NavigationProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const pathname = useCurrentPath();

  // Detect operating system
  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const navItems = [
    { href: '/', label: 'Hikes' },
    { href: '/quiz', label: 'Quiz', icon: Target, highlight: true },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Handle keyboard shortcut for search (Cmd/Ctrl + K)
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              href="/" 
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src="/trailhead-logo.png"
                alt="Trailhead"
                width={1080}
                height={405}
                priority
                style={{
                  height: 'auto',
                  maxHeight: '28px',
                  width: 'auto'
                }}
              />
            </Link>

            {/* Desktop Navigation and Search */}
            <div className="hidden md:flex items-center space-x-6">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-600 text-sm transition-all hover:bg-white hover:border-green-700 hover:text-gray-900 min-w-[180px]"
              >
                <Search className="w-4 h-4" />
                <span>Search hikes...</span>
                <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-white px-1.5 py-0.5 text-xs text-gray-500">
                  {isMac ? (
                    <>
                      <span className="text-xs">⌘</span>K
                    </>
                  ) : (
                    <>
                      <span className="text-xs">Ctrl</span>K
                    </>
                  )}
                </kbd>
              </button>

              {/* Navigation Links */}
              <div className="flex space-x-6">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold transition-all rounded-md ${
                        active 
                          ? 'text-green-700' 
                          : item.highlight
                          ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          : 'text-gray-600 hover:text-green-700 hover:bg-gray-100'
                      } ${item.highlight ? 'ring-1 ring-green-200' : ''}`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 transition-all rounded-md hover:text-green-700 hover:bg-gray-100"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 transition-all rounded-md hover:text-green-700 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="py-2 space-y-1">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2 w-full px-4 py-3 transition-colors font-medium ${
                        active 
                          ? 'text-green-700 bg-green-50 border-r-2 border-green-700' 
                          : item.highlight
                          ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                          : 'text-gray-600 hover:text-green-700 hover:bg-gray-100'
                      }`}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        hikes={hikes}
      />
    </>
  );
};

export default Navigation;