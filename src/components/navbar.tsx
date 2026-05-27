'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { User, LogOut, CreditCard, Menu, X, ArrowRight, BookOpen, Shield, ChevronDown, Headphones, BookOpenCheck, Mic, PenTool, GraduationCap, Trophy, Languages, MessageSquare, PenLine, Brain, Award, Newspaper } from 'lucide-react';
// Lazy-load notification bells — they only matter for authenticated users after hydration
const AdminNotificationBell = dynamic(() => import('@/components/admin-notification-bell').then(mod => ({ default: mod.AdminNotificationBell })), { ssr: false });
const NotificationBell = dynamic(() => import('@/components/notification-bell').then(mod => ({ default: mod.NotificationBell })), { ssr: false });
import { useState, useEffect } from 'react';
import { isPaidPlan, getPlanLabel, getPlanBadgeClasses } from '@/lib/plan-utils';
import { useHydrated } from '@/hooks/use-hydrated';
import { cn } from '@/lib/utils';

// CEFR Test dropdown items
const CEFR_ITEMS = [
  { href: '/listening', label: 'Listening', icon: Headphones, description: 'Test your listening comprehension' },
  { href: '/reading', label: 'Reading', icon: BookOpenCheck, description: 'Assess your reading skills' },
  { href: '/writing', label: 'Writing', icon: PenTool, description: 'Evaluate your writing ability' },
  { href: '/speaking', label: 'Speaking', icon: Mic, description: 'Practice your spoken English' },
];

// Courses dropdown items
const COURSE_ITEMS = [
  { href: '/courses?level=a1', label: 'Beginners', icon: GraduationCap, description: 'A1 & A2 foundational courses', tag: 'A1-A2' },
  { href: '/courses?level=b1', label: 'Intermediate', icon: BookOpen, description: 'B1 & B2 proficiency courses', tag: 'B1-B2' },
  { href: '/courses?level=c1', label: 'Advanced', icon: Trophy, description: 'C1 & C2 mastery courses', tag: 'C1-C2' },
];

// Learn Tools dropdown items
const LEARN_ITEMS = [
  { href: '/ai-tutor', label: 'Lexi AI', icon: MessageSquare, description: 'Practice with AI conversation partner', tag: 'AI' },
  { href: '/grammar-check', label: 'Grammar Checker', icon: PenLine, description: 'Check your writing for errors', tag: 'AI' },
  { href: '/vocabulary', label: 'Vocabulary Trainer', icon: Brain, description: 'Learn words with spaced repetition', tag: 'NEW' },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileCefrOpen, setMobileCefrOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [mobileLearnOpen, setMobileLearnOpen] = useState(false);
  const [communityVisible, setCommunityVisible] = useState(false);
  const mounted = useHydrated();
  const pathname = usePathname();

  const isAuth = mounted && isAuthenticated;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch community user count to conditionally show Community nav
  // Delayed with requestIdleCallback to avoid competing with critical FCP resources
  useEffect(() => {
    const doFetch = () => {
      fetch('/api/community/user-count')
        .then((res) => res.json())
        .then((data) => {
          if (data.count >= 5) {
            setCommunityVisible(true);
          }
        })
        .catch(() => {
          // On error, keep Community hidden
        });
    };
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(doFetch, { timeout: 3000 });
    } else {
      setTimeout(doFetch, 2000);
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout(); // Await server cookie clearing before redirect
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
          ? 'bg-[#0F0A1E]/80 backdrop-blur-xl border-b border-white/[0.03] py-1 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
          : 'bg-[#0F0A1E]/40 backdrop-blur-sm border-b border-white/[0.02] py-2'
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative transition-transform duration-300 group-hover:scale-105">
            <div className="absolute inset-0 bg-blue-500/20 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img src="/logo-icon.svg" alt="CEFR Test" className="h-12 w-12 sm:h-16 sm:w-16 relative" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-lg sm:text-xl tracking-tight leading-tight group-hover:text-blue-200 transition-colors">
              test<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">cefr</span><span className="text-blue-300/80">.com</span>
            </span>
            <span className="text-white/30 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] leading-tight hidden sm:block">
              AI Language Assessment
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Dropdown Menus */}
        <div className="hidden lg:flex items-center">
          <NavigationMenu className="gap-0">
            <NavigationMenuList className="gap-0">
              {/* Home */}
              <NavigationMenuItem>
                <Link href="/" className={navigationMenuTriggerStyle()}>
                  <span className={`text-sm ${isActive('/') ? 'text-white' : 'text-white/50 hover:text-white'}`}>
                    Home
                  </span>
                </Link>
              </NavigationMenuItem>

              {/* CEFR Test Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/[0.04] data-[state=open]:bg-white/[0.04] h-9 text-sm text-white/50 hover:text-white px-3">
                  CEFR Test
                  <ChevronDown className="ml-0.5 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[320px] gap-1 p-1.5 bg-[#0F0A1E]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-xl shadow-black/60">
                    {CEFR_ITEMS.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                              isActive(item.href)
                                ? 'bg-white/[0.06] text-white'
                                : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                            )}
                          >
                            <div className={cn(
                              'flex items-center justify-center w-8 h-8 rounded-lg',
                              isActive(item.href) ? 'bg-blue-500/20' : 'bg-white/[0.04]'
                            )}>
                              <item.icon className={cn(
                                'h-4 w-4',
                                isActive(item.href) ? 'text-blue-400' : 'text-white/30'
                              )} />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.label}</div>
                              <div className="text-xs text-white/30">{item.description}</div>
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                    <li className="mt-1 pt-1 border-t border-white/[0.04]">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/test"
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20">
                            <Trophy className="h-4 w-4 text-cyan-400" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Take Full Test</div>
                            <div className="text-xs text-white/30">Complete CEFR assessment</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Courses Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/[0.04] data-[state=open]:bg-white/[0.04] h-9 text-sm text-white/50 hover:text-white px-3">
                  Courses
                  <ChevronDown className="ml-0.5 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[320px] gap-1 p-1.5 bg-[#0F0A1E]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-xl shadow-black/60">
                    {COURSE_ITEMS.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                          >
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04]">
                              <item.icon className="h-4 w-4 text-white/30" />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.label}</div>
                              <div className="text-xs text-white/30">{item.description}</div>
                            </div>
                            <span className="ml-auto text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400">
                              {item.tag}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                    <li className="mt-1 pt-1 border-t border-white/[0.04]">
                      <NavigationMenuLink asChild>
                        <Link
                          href="/courses"
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-200"
                        >
                          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04]">
                            <BookOpen className="h-4 w-4 text-white/30" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">All Courses</div>
                            <div className="text-xs text-white/30">Browse the full catalog</div>
                          </div>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Learn Tools Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-white/[0.04] data-[state=open]:bg-white/[0.04] h-9 text-sm text-white/50 hover:text-white px-3">
                  Learn
                  <ChevronDown className="ml-0.5 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[340px] gap-1 p-1.5 bg-[#0F0A1E]/95 backdrop-blur-xl border border-white/[0.08] rounded-xl shadow-xl shadow-black/60">
                    {LEARN_ITEMS.map((item) => (
                      <li key={item.href}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200',
                              isActive(item.href)
                                ? 'bg-white/[0.06] text-white'
                                : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                            )}
                          >
                            <div className={cn(
                              'flex items-center justify-center w-8 h-8 rounded-lg',
                              isActive(item.href) ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20' : 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10'
                            )}>
                              <item.icon className={cn(
                                'h-4 w-4',
                                isActive(item.href) ? 'text-cyan-400' : 'text-cyan-400/50'
                              )} />
                            </div>
                            <div>
                              <div className="text-sm font-medium">{item.label}</div>
                              <div className="text-xs text-white/30">{item.description}</div>
                            </div>
                            <span className={cn(
                              'ml-auto text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded',
                              item.tag === 'AI' && 'bg-cyan-500/15 text-cyan-400',
                              item.tag === 'NEW' && 'bg-emerald-500/15 text-emerald-400'
                            )}>
                              {item.tag}
                            </span>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Pricing */}
              <NavigationMenuItem>
                <Link href="/pricing" className={navigationMenuTriggerStyle()}>
                  <span className={`text-sm ${isActive('/pricing') ? 'text-white' : 'text-white/50 hover:text-white'}`}>
                    Pricing
                  </span>
                </Link>
              </NavigationMenuItem>

              {/* Blog */}
              <NavigationMenuItem>
                <Link href="/blog" className={navigationMenuTriggerStyle()}>
                  <span className={`text-sm flex items-center gap-1 ${isActive('/blog') ? 'text-white' : 'text-white/50 hover:text-white'}`}>
                    <Newspaper className="h-3.5 w-3.5" />
                    Blog
                  </span>
                </Link>
              </NavigationMenuItem>

              {/* Community — only visible when user count >= 50 */}
              {communityVisible && (
                <NavigationMenuItem>
                  <Link href="/community" className={navigationMenuTriggerStyle()}>
                    <span className={`text-sm flex items-center gap-1 ${isActive('/community') ? 'text-white' : 'text-white/50 hover:text-white'}`}>
                      <Languages className="h-3.5 w-3.5" />
                      Community
                    </span>
                  </Link>
                </NavigationMenuItem>
              )}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Auth-only links */}
          {isAuth && (
            <div className="flex items-center gap-0.5 ml-1">
              <Link
                href="/learn"
                className={`text-sm px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1 ${
                  isActive('/learn')
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                My Learning
              </Link>
              <Link
                href="/test"
                className="text-sm px-3 py-1.5 rounded-lg transition-all duration-300 text-white/50 hover:text-white hover:bg-white/[0.04]"
              >
                Take Test
              </Link>
              <Link
                href="/ai-tutor"
                className={`text-sm px-3 py-1.5 rounded-lg transition-all duration-300 flex items-center gap-1 ${
                  isActive('/ai-tutor')
                    ? 'text-cyan-300 bg-cyan-500/10'
                    : 'text-cyan-400/70 hover:text-cyan-300 hover:bg-cyan-500/10'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Lexi AI
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="text-sm text-blue-400/80 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.04] flex items-center gap-1"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Auth Section */}
        <div className="hidden lg:flex items-center gap-2.5">
          {isAuth && <NotificationBell />}
          {isAuth && user?.role === 'admin' && <AdminNotificationBell />}
          {isAuth ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 bg-white/[0.04] border border-white/[0.06] text-white text-sm cursor-pointer hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-300">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-xs font-bold">
                    {(user?.name || user?.email || 'U')[0].toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate text-xs text-white/70">{user?.name || user?.email}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#0F0A1E]/95 backdrop-blur-xl border-white/[0.08] text-white shadow-xl shadow-black/60">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user?.name || 'User'}</p>
                  <p className="text-xs text-white/50">{user?.email}</p>
                  <div className="mt-1">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getPlanBadgeClasses(user?.plan)}`}
                    >
                      {getPlanLabel(user?.plan)}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/[0.06] focus:bg-white/[0.06]">
                  <Link href="/learn">
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Learning
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/[0.06] focus:bg-white/[0.06]">
                  <Link href="/dashboard">
                    <Award className="mr-2 h-4 w-4" />
                    Certificates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/[0.06] focus:bg-white/[0.06]">
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/[0.06] focus:bg-white/[0.06]">
                  <Link href="/dashboard">
                    <Shield className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/[0.06] focus:bg-white/[0.06]">
                  <Link href="/pricing">
                    <CreditCard className="mr-2 h-4 w-4" />
                    {isPaidPlan(user?.plan) ? 'Manage Plan' : 'Upgrade Plan'}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-400/80 hover:bg-red-500/10 focus:bg-red-500/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <button className="text-sm text-white/50 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.04] cursor-pointer">
                  Sign In
                </button>
              </Link>
              <Link href="/register">
                <button className="group flex items-center gap-1.5 rounded-xl px-4 py-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer">
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden text-white hover:bg-white/10 rounded-lg p-1.5 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile backdrop overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 top-16 bg-black/70 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F0A1E]/95 backdrop-blur-xl border-t border-white/[0.04] p-3 space-y-0.5 animate-slide-down relative z-50 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <Link
            href="/"
            className={`block text-sm py-2 px-3 rounded-lg transition-all duration-300 ${
              isActive('/') ? 'text-white bg-white/[0.06]' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </Link>

          {/* Mobile CEFR Test Accordion */}
          <div>
            <button
              className="w-full flex items-center justify-between text-sm py-2 px-3 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300"
              onClick={() => setMobileCefrOpen(!mobileCefrOpen)}
            >
              CEFR Test
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${mobileCefrOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileCefrOpen && (
              <div className="ml-3 space-y-0.5 border-l border-white/[0.06] pl-3 mt-0.5">
                {CEFR_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm py-1.5 px-3 rounded-lg transition-all duration-300 ${
                      isActive(item.href) ? 'text-white bg-white/[0.06]' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                    }`}
                    onClick={() => { setMobileMenuOpen(false); setMobileCefrOpen(false); }}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                ))}
                {isAuth && (
                  <Link
                    href="/test"
                    className="flex items-center gap-2 text-sm py-1.5 px-3 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300"
                    onClick={() => { setMobileMenuOpen(false); setMobileCefrOpen(false); }}
                  >
                    <Trophy className="h-3.5 w-3.5" />
                    Take Full Test
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Courses Accordion */}
          <div>
            <button
              className="w-full flex items-center justify-between text-sm py-2 px-3 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300"
              onClick={() => setMobileCoursesOpen(!mobileCoursesOpen)}
            >
              Courses
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${mobileCoursesOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileCoursesOpen && (
              <div className="ml-3 space-y-0.5 border-l border-white/[0.06] pl-3 mt-0.5">
                {COURSE_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 text-sm py-1.5 px-3 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300"
                    onClick={() => { setMobileMenuOpen(false); setMobileCoursesOpen(false); }}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                    <span className="ml-auto text-[9px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400">
                      {item.tag}
                    </span>
                  </Link>
                ))}
                <Link
                  href="/courses"
                  className="flex items-center gap-2 text-sm py-1.5 px-3 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-all duration-300"
                  onClick={() => { setMobileMenuOpen(false); setMobileCoursesOpen(false); }}
                >
                  <BookOpen className="h-3.5 w-3.5" />
                  All Courses
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Learn Accordion */}
          <div>
            <button
              className="w-full flex items-center justify-between text-sm py-2 px-3 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.04] transition-all duration-300"
              onClick={() => setMobileLearnOpen(!mobileLearnOpen)}
            >
              Learn
              <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${mobileLearnOpen ? 'rotate-180' : ''}`} />
            </button>
            {mobileLearnOpen && (
              <div className="ml-3 space-y-0.5 border-l border-cyan-500/20 pl-3 mt-0.5">
                {LEARN_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm py-1.5 px-3 rounded-lg transition-all duration-300 ${
                      isActive(item.href) ? 'text-white bg-white/[0.06]' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                    }`}
                    onClick={() => { setMobileMenuOpen(false); setMobileLearnOpen(false); }}
                  >
                    <item.icon className="h-3.5 w-3.5" />
                    {item.label}
                    <span className={cn(
                      'ml-auto text-[9px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded',
                      item.tag === 'AI' && 'bg-cyan-500/15 text-cyan-400',
                      item.tag === 'NEW' && 'bg-emerald-500/15 text-emerald-400'
                    )}>
                      {item.tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/pricing"
            className={`block text-sm py-2 px-3 rounded-lg transition-all duration-300 ${
              isActive('/pricing') ? 'text-white bg-white/[0.06]' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Pricing
          </Link>

          <Link
            href="/blog"
            className={`flex items-center gap-1.5 text-sm py-2 px-3 rounded-lg transition-all duration-300 ${
              isActive('/blog') ? 'text-white bg-white/[0.06]' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Newspaper className="h-3.5 w-3.5" />
            Blog
          </Link>

          {communityVisible && (
            <Link
              href="/community"
              className={`flex items-center gap-1.5 text-sm py-2 px-3 rounded-lg transition-all duration-300 ${
                isActive('/community') ? 'text-white bg-white/[0.06]' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Languages className="h-3.5 w-3.5" />
              Community
            </Link>
          )}

          {/* Mobile Auth Section */}
          {isAuth ? (
            <>
              <Link
                href="/learn"
                className={`flex items-center gap-2 text-sm py-2 px-3 rounded-lg transition-all duration-300 ${
                  isActive('/learn') ? 'text-white bg-white/[0.06]' : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <BookOpen className="h-4 w-4" />
                My Learning
              </Link>
              <Link
                href="/profile"
                className="block text-sm text-white/50 hover:text-white py-2 px-3 rounded-lg hover:bg-white/[0.04]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                href="/dashboard"
                className="block text-sm text-white/50 hover:text-white py-2 px-3 rounded-lg hover:bg-white/[0.04]"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <div className="py-1 px-3">
                <NotificationBell />
              </div>
              {user?.role === 'admin' && (
                <>
                  <div className="py-1 px-3">
                    <AdminNotificationBell />
                  </div>
                  <Link
                    href="/admin"
                    className="block text-sm text-blue-400/80 py-2 px-3 rounded-lg hover:bg-white/[0.04]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="inline h-3.5 w-3.5 mr-1" />
                    Admin
                  </Link>
                </>
              )}
              <div className="pt-2 mt-1 border-t border-white/[0.06]">
                <p className="text-sm text-white/40 mb-1 px-3">{user?.email}</p>
                <button
                  className="w-full text-left text-sm text-red-400/80 py-2 px-3 rounded-lg hover:bg-red-500/10"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2 mt-1 border-t border-white/[0.06] px-3 space-y-2">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full rounded-xl py-2 bg-white/[0.04] border border-white/[0.06] text-white text-sm font-medium hover:bg-white/[0.08] transition-all duration-300">
                  Sign In
                </button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full rounded-xl py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-sm font-medium hover:from-blue-500 hover:to-cyan-400 transition-all duration-300">
                  Get Started
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
