import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, Sun, Moon, Sparkles, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  scrollToSection: (id: string) => void;
  theme: 'light' | 'dark' | 'guinea';
  setTheme: (theme: 'light' | 'dark' | 'guinea') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeSection, 
  setActiveSection, 
  scrollToSection,
  theme,
  setTheme
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Accueil' },
    { id: 'services', label: 'Services' },
    { id: 'realizations', label: 'Réalisations' },
    { id: 'formations', label: 'Formations' },
    { id: 'about', label: 'À propos' },
    { id: 'contact', label: 'Contact' },
  ];

  const themeOptions = [
    { id: 'light' as const, label: 'Clair', icon: Sun, color: 'text-amber-500' },
    { id: 'dark' as const, label: 'Sombre', icon: Moon, color: 'text-indigo-400' },
    { id: 'guinea' as const, label: 'Syli (Guinée)', icon: Sparkles, color: 'text-emerald-500' }
  ];

  const currentThemeOpt = themeOptions.find(opt => opt.id === theme) || themeOptions[1];
  const CurrentThemeIcon = currentThemeOpt.icon;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    setIsMobileMenuOpen(false);
    scrollToSection(id);
  };

  const getMenuItemClass = (isActive: boolean) => {
    const base = "relative py-2 text-sm font-medium tracking-wide transition-colors duration-200 focus:outline-none cursor-pointer";
    if (theme === 'light') {
      return `${base} ${isActive ? 'text-blue-600 font-semibold' : 'text-slate-600 hover:text-blue-600'}`;
    }
    if (theme === 'guinea') {
      return `${base} ${isActive ? 'text-gold-500 font-semibold' : 'text-slate-300 hover:text-white'}`;
    }
    return `${base} ${isActive ? 'text-blue-400 font-semibold' : 'text-slate-300 hover:text-white'}`;
  };

  const isLight = theme === 'light';
  const isGuinea = theme === 'guinea';

  let scrolledNavbarBg = 'bg-white/90 border-slate-100/80 text-slate-900 shadow-sm';
  if (theme === 'dark') {
    scrolledNavbarBg = 'bg-brand-950/90 border-brand-800/80 text-white shadow-lg';
  } else if (theme === 'guinea') {
    scrolledNavbarBg = 'bg-[#050e07]/95 border-[#122c17]/80 text-[#f4fcf6] shadow-lg';
  }

  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    isScrolled 
      ? `${scrolledNavbarBg} backdrop-blur-md py-4` 
      : 'bg-transparent py-6'
  }`;

  return (
    <header id="main-header" className={headerClass}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          id="logo-button"
          onClick={() => handleNavClick('home')}
          className="flex items-center text-left group focus:outline-none transform hover:scale-[1.02] transition-transform duration-200"
        >
          <Logo 
            height={44} 
            showText={true} 
            showSubtitle={true} 
            onDarkBackground={theme !== 'light' || (!isScrolled && !isMobileMenuOpen)} 
          />
        </button>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-6">
            {menuItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  id={`nav-item-${item.id}`}
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={getMenuItemClass(isActive)}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-full ${
                        theme === 'light' 
                          ? 'bg-blue-600' 
                          : theme === 'guinea' 
                            ? 'bg-gold-500' 
                            : 'bg-blue-400'
                      }`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Theme Selector */}
          <div className="relative">
            <button
              id="theme-selector-btn"
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 border cursor-pointer ${
                isScrolled
                  ? (theme === 'light' 
                      ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-800' 
                      : theme === 'guinea'
                        ? 'bg-emerald-950/20 hover:bg-emerald-950/40 border-[#122c17] text-[#f4fcf6]'
                        : 'bg-white/5 hover:bg-white/10 border-brand-800 text-slate-200')
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
              }`}
            >
              <CurrentThemeIcon size={16} className={currentThemeOpt.color} />
              <span className="hidden lg:inline">{currentThemeOpt.label}</span>
              <ChevronDown size={14} className="opacity-60" />
            </button>

            <AnimatePresence>
              {showThemeDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowThemeDropdown(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute right-0 mt-2 w-48 rounded-2xl shadow-xl border p-1.5 z-50 backdrop-blur-md ${
                      theme === 'light'
                        ? 'bg-white border-slate-100 text-slate-800'
                        : theme === 'guinea'
                          ? 'bg-[#0b140d]/95 border-[#122c17] text-white'
                          : 'bg-[#0f1424]/95 border-brand-800 text-white'
                    }`}
                  >
                    {themeOptions.map((opt) => {
                      const IconComp = opt.icon;
                      const isSelected = theme === opt.id;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setTheme(opt.id);
                            setShowThemeDropdown(false);
                          }}
                          className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-left text-sm font-medium transition-colors cursor-pointer ${
                            isSelected
                              ? (theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-white/10 text-white')
                              : (theme === 'light' ? 'hover:bg-slate-50 text-slate-600' : 'hover:bg-white/5 text-slate-300')
                          }`}
                        >
                          <IconComp size={16} className={`${opt.color} ${isSelected ? 'animate-pulse' : ''}`} />
                          <span>{opt.label}</span>
                          {opt.id === 'guinea' && (
                            <span className="flex space-x-0.5 ml-auto">
                              <span className="w-1.5 h-3 bg-red-600 rounded-sm" />
                              <span className="w-1.5 h-3 bg-yellow-500 rounded-sm" />
                              <span className="w-1.5 h-3 bg-green-500 rounded-sm" />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button
            id="nav-cta-btn"
            onClick={() => handleNavClick('contact')}
            className={`flex items-center space-x-2 font-medium text-xs px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${
              isScrolled 
                ? 'bg-brand-800 hover:bg-brand-900 text-white' 
                : 'bg-white hover:bg-slate-100 text-brand-950'
            }`}
          >
            <span>Obtenir un devis</span>
            <ArrowUpRight size={14} />
          </button>
        </nav>

        {/* Mobile Menu Trigger */}
        <button
          id="mobile-menu-trigger"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg transition-colors focus:outline-none ${
            isScrolled || isMobileMenuOpen 
              ? (theme === 'light' 
                  ? 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/80' 
                  : theme === 'guinea'
                    ? 'text-slate-200 hover:text-gold-500 hover:bg-white/5'
                    : 'text-slate-200 hover:text-white hover:bg-white/10')
              : 'text-slate-200 hover:text-white hover:bg-white/10'
          }`}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={`md:hidden border-b overflow-hidden ${
              theme === 'light'
                ? 'bg-white border-slate-100 text-slate-800'
                : theme === 'guinea'
                  ? 'bg-[#050e07] border-[#122c17] text-white'
                  : 'bg-[#0f1424] border-brand-800 text-white'
            }`}
          >
            <div className="px-6 py-6 flex flex-col space-y-4">
              {menuItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    id={`mobile-nav-item-${item.id}`}
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`text-left py-2 px-3 rounded-lg text-base font-medium transition-colors ${
                      isActive 
                        ? (theme === 'light'
                            ? 'bg-blue-50 text-blue-600 font-semibold' 
                            : 'bg-white/10 text-white font-semibold')
                        : (theme === 'light'
                            ? 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white')
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}

              {/* Theme selection pills in mobile view */}
              <div className={`mt-6 pt-6 border-t ${theme === 'light' ? 'border-slate-100' : 'border-white/10'}`}>
                <span className="block text-xs font-mono uppercase tracking-wider mb-3 text-slate-400">
                  Changer de Thème
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {themeOptions.map((opt) => {
                    const IconComp = opt.icon;
                    const isSelected = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setTheme(opt.id)}
                        className={`flex flex-col items-center justify-center py-3 px-2 rounded-2xl border transition-all text-xs font-semibold gap-1.5 cursor-pointer ${
                          isSelected
                            ? (theme === 'light' 
                                ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                                : 'bg-white/15 border-white/25 text-white')
                            : (theme === 'light'
                                ? 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-slate-100'
                                : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10')
                        }`}
                      >
                        <IconComp size={16} className={opt.color} />
                        <span>{opt.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                id="mobile-nav-cta"
                onClick={() => handleNavClick('contact')}
                className="w-full flex items-center justify-center space-x-2 bg-brand-800 hover:bg-brand-900 text-white font-medium py-3 rounded-xl shadow-sm mt-4 cursor-pointer"
              >
                <span>Obtenir un devis</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
