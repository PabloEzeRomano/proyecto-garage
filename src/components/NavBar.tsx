'use client';

import useAuth from '@/hooks/useAuth';
import { LogoIcon } from '../../public/icons';
import { Role } from '@/types/database';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CartButton } from './CartButton';
import { ClientOnly } from './ClientOnly';
import { SessionButton } from './SesionButton';
import { ThemeToggle } from './ThemeToggle';

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
  const { user, hasRole } = useAuth([], [], false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { href: '/items', text: 'Menú' },
    { href: '/events', text: 'Eventos' },
    { href: '/about-us', text: 'Sobre Nosotros' },
    { href: '/profile', text: 'Perfil', requireAuth: true },
  ];

  return (
    <header className="header-container theme-surface">
      <nav className="navbar-container">
        <div className="flex items-center gap-2">
          <Link className="home-link" href={'/'}>
            <LogoIcon />
            <span className="leading-none">Proyecto Garage</span>
          </Link>

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
        <div className="nav-actions">
          <ClientOnly>
            <CartButton />
          </ClientOnly>
          <ThemeToggle />
          <SessionButton />
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
