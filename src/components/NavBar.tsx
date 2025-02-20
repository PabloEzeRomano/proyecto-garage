'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/database';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoIcon } from '../../public/icons';
import { CartButton } from './CartButton';
import { ClientOnly } from './ClientOnly';
import { SessionButton } from './SesionButton';
import { ThemeToggle } from './ThemeToggle';
import { useState, useEffect } from 'react';

import '@/styles/navbar.css';

const linkVariants = {
  hover: { scale: 1.1 },
};

interface NavItem {
  href: string;
  text: string;
  roles?: Role[];
  requireAuth?: boolean;
}

export const NavBar = () => {
  const { user, hasRole } = useAuth();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems: NavItem[] = [
    { href: '/items', text: 'Menú' },
    { href: '/events', text: 'Eventos' },
    { href: '/about-us', text: 'Sobre Nosotros' },
    { href: '/users/profile', text: 'Perfil', requireAuth: true },
  ];

  return (
    <header className="header-container theme-surface">
      <nav className="navbar-container">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2">
          <Link className="home-link" href={'/'}>
            <LogoIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            <span className="leading-none">Proyecto Garage</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="nav-links">
            {navItems.map(
              ({ href, text, roles, requireAuth }) =>
                (!requireAuth || user) &&
                (!roles || hasRole(roles)) && (
                  <Link key={href} href={href}>
                    <motion.div
                      whileHover="hover"
                      variants={linkVariants}
                      className={`nav-link ${
                        pathname?.includes(href) ? 'active-tab' : ''
                      }`}
                    >
                      {text}
                    </motion.div>
                  </Link>
                )
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <ClientOnly>
            <CartButton />
          </ClientOnly>
          <div className="theme-toggle">
            <ThemeToggle />
          </div>
          <div className="session-buttons">
            <SessionButton />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="hamburger-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`${
                isMenuOpen ? 'rotate-45 translate-y-[0.3rem]' : ''
              }`}
            />
            <span className={`${isMenuOpen ? 'opacity-0' : ''}`} />
            <span
              className={`${
                isMenuOpen ? '-rotate-45 -translate-y-[0.3rem]' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`mobile-menu theme-surface ${isMenuOpen ? 'open' : ''}`}
        >
          {/* Navigation Section */}
          <div className="mobile-nav-section">
            {navItems.map(
              ({ href, text, roles, requireAuth }) =>
                (!requireAuth || user) &&
                (!roles || hasRole(roles)) && (
                  <Link key={href} href={href}>
                    <motion.div
                      whileHover="hover"
                      variants={linkVariants}
                      className={`nav-link ${
                        pathname?.includes(href) ? 'active-tab' : ''
                      }`}
                    >
                      {text}
                    </motion.div>
                  </Link>
                )
            )}
          </div>

          {/* Actions Section */}

          <div className="mobile-actions">
            <ThemeToggle />
            <SessionButton />
          </div>
        </div>
      </nav>
    </header>
  );
};
