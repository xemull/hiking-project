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
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-14">
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
                  maxHeight: '24px',
                  width: 'auto'
                }}
              />
            </Link>

            {/* Desktop Navigation and Search */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-md text-gray-600 text-sm transition-all hover:bg-white hover:border-gray-300"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm">Search</span>
              </button>

              {/* Navigation Links */}
              {navItems.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap rounded-md ${
                      active
                        ? 'text-green-700'
                        : item.highlight
                        ? 'text-green-600 hover:text-green-700 hover:bg-green-50'
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    {item.label}
                  </Link>
                );
              })}
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