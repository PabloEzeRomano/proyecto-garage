import useAuth from '@/hooks/useAuth';
import { Role } from '@prisma/client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  AboutIcon,
  AddEventIcon,
  AddItemIcon,
  AddStockIcon,
  EventsIcons,
  LogoIcon,
  MenuIcon,
  StockIcon,
  UsersIcon,
} from '../../public/icons';
import { SessionButton } from './SesionButton';

import '@/styles/navbar.css';

const variants = {
  open: { opacity: 1, y: 0, scale: 1 },
  closed: { opacity: 0, y: '-10%', scale: 0.5 },
};

const linkVariants = {
  hover: { scale: 1.1 },
};

export const NavBar = () => {
  const { isAllowed } = useAuth([], false);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: '/users', icon: UsersIcon, text: 'Usuarios', roles: [Role.ADMIN] },
    { href: '/stocks', icon: StockIcon, text: 'Stock', roles: [Role.ADMIN] },
    {
      href: '/add-stock',
      icon: AddStockIcon,
      text: 'Agregar Stock',
      roles: [Role.ADMIN],
    },
    {
      href: '/add-item',
      icon: AddItemIcon,
      text: 'Agregar Item',
      roles: [Role.ADMIN],
    },
    {
      href: '/add-event',
      icon: AddEventIcon,
      text: 'Agregar Evento',
      roles: [Role.ADMIN],
    },
    { href: '/items', icon: MenuIcon, text: 'Menu', roles: [Role.ADMIN] },
    { href: '/events', icon: EventsIcons, text: 'Proximos Eventos', roles: [] },
    { href: '/about-us', icon: AboutIcon, text: 'Sobre Nosotros', roles: [] },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header-container">
      <Link className="home-link" href={'/'}>
        <LogoIcon />
        <span className="leading-none">Proyecto Garage</span>
      </Link>
      <nav className="navbar-container" ref={menuRef}>
        <button className="hamburger-menu" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </button>
        <motion.div
          animate={isMenuOpen ? 'open' : 'closed'}
          variants={variants}
          className={`menu-items ${isMenuOpen ? 'open' : ''}`}
        >
          {navItems.map(
            ({ href, icon: Icon, text, roles }) =>
              (roles.length === 0 || isAllowed(roles)) && (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <motion.div
                    whileHover="hover"
                    variants={linkVariants}
                    className={`navigation-item ${
                      pathname?.includes(href) ? 'active-tab' : ''
                    }`}
                  >
                    <Icon />
                    {text}
                  </motion.div>
                </Link>
              )
          )}
          <div className="session-button-container">
            <SessionButton />
          </div>
        </motion.div>
      </nav>
    </header>
  );
};
