import React, { useState } from 'react';
import { Fuel, ShieldCheck, Sparkles, Menu, X, User as UserIcon, LogOut, Search, Bell, Sun, Moon } from 'lucide-react';
import { auth, signOut, User } from '../lib/firebase';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAdmin: () => void;
  onOpenAiImageModal: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenUserAuth: (mode?: 'signin' | 'signup') => void;
  isDark: boolean;
  onToggleTheme: () => void;
  currentUser: User | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenAdmin,
  onOpenAiImageModal,
  onOpenSearch,
  onOpenNotifications,
  onOpenUserAuth,
  isDark,
  onToggleTheme,
  currentUser
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'news', label: 'News' },
    { id: 'knowledge', label: 'Knowledge' },
    { id: 'operations', label: 'Operations' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'products', label: 'Products' },
    { id: 'tools', label: 'Tools' },
    { id: 'insights', label: 'Insights' },
    { id: 'about', label: 'About' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          
          {/* Zone 1: Brand Logo - Transparent Background Rendering */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); onNavigate('home'); }}
            className="flex items-center gap-3 whitespace-nowrap shrink-0 group"
          >
            <div className="h-10 flex items-center justify-center transition-transform group-hover:scale-105">
              <img
                src="/assets/aistudio/WingFuel_Orbit_Logo_e3f91314.png"
                alt="WingFuel.co Logo"
                className="h-8 w-auto object-contain mix-blend-multiply dark:bg-white/90 dark:px-2 dark:py-1 dark:rounded-lg dark:mix-blend-normal shadow-sm transition-all"
              />
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block">
                WingFuel<span className="text-orange-500">.co</span>
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-wider uppercase font-semibold">
                Fuel Your Aviation Knowledge
              </span>
            </div>
          </a>

          {/* Zone 2: Navigation Links (Single-Line whitespace-nowrap) */}
          <nav className="hidden xl:flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 px-1 border-b-2 ${
                  currentView === item.id
                    ? 'text-orange-500 border-orange-500 font-bold'
                    : 'border-transparent hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Zone 3: Primary Actions, Search, Theme Toggle & User Auth */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {/* Global Search Bar Input Trigger */}
            <button
              onClick={onOpenSearch}
              className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 text-xs font-medium flex items-center gap-2 transition-all group"
            >
              <Search className="w-3.5 h-3.5 text-orange-500 group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline">Search...</span>
              <kbd className="hidden md:inline bg-slate-200 dark:bg-slate-950 text-slate-500 px-1 py-0.2 rounded text-[10px] font-mono border border-slate-300 dark:border-slate-800">⌘K</kbd>
            </button>

            {/* Notification Bell Button */}
            <button
              onClick={onOpenNotifications}
              className="p-1.5 text-slate-600 hover:text-orange-500 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors relative"
              title="Category Alert Preferences"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full" />
            </button>

            {/* Light / Dark Mode Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Gemini AI Visuals Button */}
            <button
              onClick={onOpenAiImageModal}
              className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Generate Aviation Visuals with Gemini 3 Pro"
            >
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span className="hidden md:inline">AI Studio</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('admin')}
                  className="px-3 py-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 border border-orange-300 dark:border-orange-800/60 rounded-lg flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{currentUser.displayName || 'Account'}</span>
                </button>
                <button
                  onClick={() => signOut(auth)}
                  className="p-1.5 text-slate-500 hover:text-rose-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenUserAuth('signup')}
                  className="px-3.5 py-1.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
                <button
                  onClick={() => onOpenAdmin()}
                  className="px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  title="Admin Dashboard Login"
                >
                  Admin
                </button>
              </div>
            )}
          </div>

          {/* Mobile Action Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onToggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === item.id ? 'bg-orange-500 text-white font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2">
            <button
              onClick={() => { onOpenSearch(); setMobileMenuOpen(false); }}
              className="w-full py-2 bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-800"
            >
              <Search className="w-4 h-4 text-orange-500" /> Global Catalog Search
            </button>
            <button
              onClick={() => { onOpenAiImageModal(); setMobileMenuOpen(false); }}
              className="w-full py-2 bg-slate-200 dark:bg-slate-800 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> AI Image Generator
            </button>
            {!currentUser ? (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => { onOpenUserAuth('signup'); setMobileMenuOpen(false); }}
                  className="py-2 bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <UserIcon className="w-4 h-4" /> Sign Up Free
                </button>
                <button
                  onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
                  className="py-2 bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Login
                </button>
              </div>
            ) : (
              <button
                onClick={() => { onNavigate('admin'); setMobileMenuOpen(false); }}
                className="w-full py-2 bg-orange-950 text-orange-400 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" /> Admin Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
