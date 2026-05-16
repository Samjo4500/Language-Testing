'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, CreditCard, Menu, Shield, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/listening', label: 'Listening' },
  { href: '/speaking', label: 'Speaking' },
  { href: '/writing', label: 'Writing' },
  { href: '/quick-tour', label: 'Quick Tour' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/sample-certificate', label: 'Sample Certificate' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  /* Use false for isAuthenticated until client mounts to avoid hydration mismatch */
  const isAuth = mounted && isAuthenticated;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass-nav py-2'
          : 'bg-[#1a1f36]/60 backdrop-blur-md border-b border-white/5 py-3'
      }`}
    >
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg shadow-purple-500/25 transition-transform duration-300 group-hover:scale-110">
              CE
            </div>
            <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-400 border-2 border-[#1a1f36] animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-base tracking-tight leading-tight group-hover:text-purple-200 transition-colors">
              testcefr.com
            </span>
            <span className="text-white/40 text-[9px] uppercase tracking-[0.2em] leading-tight">
              English Assessment
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-0.5 ml-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`relative text-sm px-3 py-1.5 rounded-lg transition-all duration-300 ${
                isActive(link.href)
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
              )}
            </Link>
          ))}
          {isAuth && (
            <Link
              href="/test"
              className={`text-sm px-3 py-1.5 rounded-lg transition-all duration-300 text-white/60 hover:text-white hover:bg-white/5`}
            >
              Take Test
            </Link>
          )}
          {isAuth && user?.role === 'admin' && (
            <Link
              href="/admin"
              className="text-sm text-orange-400 hover:text-orange-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5 flex items-center gap-1"
            >
              <Shield className="h-3.5 w-3.5" />
              Admin
            </Link>
          )}
        </div>

        {/* Auth Section */}
        <div className="hidden lg:flex items-center gap-3">
          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl px-3 py-1.5 glass-button text-white text-sm cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-xs font-bold">
                    {(user?.name || user?.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{user?.name || user?.email}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#1a1f36] border-white/10 text-white">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-white/50">{user?.email}</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        user?.plan === 'premium'
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-white/10 text-white/60 border border-white/10'
                      }`}
                    >
                      {user?.plan === 'premium' ? 'Premium' : 'Free'}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <Link href="/dashboard">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10">
                  <Link href="/pricing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    {user?.plan === 'premium' ? 'Manage Plan' : 'Upgrade Plan'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <button className="flex items-center gap-2 rounded-xl px-5 py-2 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer">
                <Sparkles className="h-3.5 w-3.5" />
                Sign In
              </button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-nav border-t border-white/5 p-4 space-y-1 animate-slide-down">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block text-sm py-2.5 px-4 rounded-xl transition-all duration-300 ${
                isActive(link.href)
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAuth ? (
            <>
              <Link
                href="/test"
                className="block text-sm text-white/60 hover:text-white py-2.5 px-4 rounded-xl hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                Take Test
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-white/60 hover:text-white py-2.5 px-4 rounded-xl hover:bg-white/5"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="block text-sm text-orange-400 py-2.5 px-4 rounded-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Shield className="inline h-3.5 w-3.5 mr-1" />
                  Admin
                </Link>
              )}
              <div className="pt-3 mt-2 border-t border-white/10">
                <p className="text-sm text-white/50 mb-2 px-4">{user?.email}</p>
                <button
                  className="w-full text-left text-sm text-red-400 py-2.5 px-4 rounded-xl hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-3 mt-2 border-t border-white/10 px-4">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full rounded-xl py-2.5 bg-gradient-to-r from-purple-600 to-purple-500 text-white text-sm font-medium">
                  Sign In
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
