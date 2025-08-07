'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Hikes' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Updated styles - bolder text, no active underline
  const navStyles = {
    nav: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(10px)',
      boxShadow: 'var(--shadow-soft)',
      borderBottom: '1px solid var(--ds-border)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 50,
      transition: 'all 0.3s ease'
    },
    logo: {
      transition: 'all 0.3s ease'
    },
    navLink: {
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      fontWeight: 600, // CHANGED: Increased from 500 to 600 (bolder)
      textDecoration: 'none',
      transition: 'all 0.3s ease',
      borderRadius: '0.375rem',
      fontFamily: 'Inter, system-ui, sans-serif'
    },
    navLinkActive: {
      color: 'var(--ds-primary)',
      // REMOVED: borderBottom (no more underline for active page)
    },
    navLinkInactive: {
      color: '#6b7280',
    },
    navLinkHover: {
      color: 'var(--ds-primary)',
      backgroundColor: 'var(--ds-muted)'
    },
    mobileButton: {
      padding: '0.5rem',
      color: '#6b7280',
      transition: 'all 0.3s ease',
      borderRadius: '0.375rem'
    },
    mobileButtonHover: {
      color: 'var(--ds-primary)',
      backgroundColor: 'var(--ds-muted)'
    },
    mobileLinkActive: {
      color: 'var(--ds-primary)',
      backgroundColor: 'rgba(var(--ds-primary), 0.1)',
      borderRight: '2px solid var(--ds-primary)'
    },
    mobileLinkInactive: {
      color: '#6b7280'
    }
  };

  return (
    <nav style={navStyles.nav}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="hover:opacity-80 transition-opacity"
            style={navStyles.logo}
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

          {/* Desktop Navigation - Bolder text, no active underline */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    ...navStyles.navLink,
                    ...(active ? navStyles.navLinkActive : navStyles.navLinkInactive)
                  }}
                  onMouseEnter={(e) => {
                    if (!active) {
                      Object.assign(e.currentTarget.style, navStyles.navLinkHover);
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      Object.assign(e.currentTarget.style, navStyles.navLinkInactive);
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={navStyles.mobileButton}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, navStyles.mobileButtonHover);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t" style={{ borderColor: 'var(--ds-border)' }}>
            <div className="py-2 space-y-1">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center w-full px-4 py-3 transition-colors"
                    style={active ? navStyles.mobileLinkActive : navStyles.mobileLinkInactive}
                    onMouseEnter={(e) => {
                      if (!active) {
                        Object.assign(e.currentTarget.style, navStyles.navLinkHover);
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        Object.assign(e.currentTarget.style, navStyles.mobileLinkInactive);
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;