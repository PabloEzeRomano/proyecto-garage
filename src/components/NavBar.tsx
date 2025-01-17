'use client';

import useAuth from '@/hooks/useAuth';
import { sendTextMessage } from '@/lib/whatsapp';
import {
  AboutIcon,
  AddEventIcon,
  AddItemIcon,
  AddStockIcon,
  LogoIcon,
  MenuIcon,
  StockIcon,
  UsersIcon
} from '../../public/icons';
import { Role } from '@/types/database';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { CartButton } from './CartButton';
import { ClientOnly } from './ClientOnly';
import { SessionButton } from './SesionButton';
import { ThemeToggle } from './ThemeToggle';

import '@/styles/navbar.css';

const variants = {
  open: { opacity: 1, y: 0, scale: 1 },
  closed: { opacity: 0, y: '-10%', scale: 0.5 },
};

const linkVariants = {
  hover: { scale: 1.1 },
};

interface NavItem {
  href: string;
  icon: React.FC<{ className?: string }>;
  text: string;
  roles: Role[];
}

export const NavBar = () => {
  const { user, hasRole } = useAuth([], [], false);
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { href: '/users', icon: UsersIcon, text: 'Usuarios', roles: [Role.ROOT] },
    { href: '/stocks', icon: StockIcon, text: 'Stock', roles: [Role.ADMIN, Role.ROOT] },
    { href: '/profile', icon: UsersIcon, text: 'Perfil', roles: [] },
    {
      href: '/edit-user',
      icon: UsersIcon,
      text: 'Editar Usuario',
      roles: [Role.ROOT],
    },
    { href: '/createQR', icon: UsersIcon, text: 'Crear QR', roles: [] },
    {
      href: '/testMessages',
      icon: UsersIcon,
      text: 'Enviar Mensaje',
      roles: [],
    },
    {
      href: '/add-stock',
      icon: AddStockIcon,
      text: 'Agregar Stock',
      roles: [Role.ADMIN, Role.ROOT],
    },
    {
      href: '/add-item',
      icon: AddItemIcon,
      text: 'Agregar Item',
      roles: [Role.ADMIN, Role.ROOT],
    },
    {
      href: '/add-event',
      icon: AddEventIcon,
      text: 'Agregar Evento',
      roles: [Role.ADMIN, Role.ROOT],
    },
    { href: '/items', icon: MenuIcon, text: 'Menu', roles: [] },
    { href: '/about-us', icon: AboutIcon, text: 'Sobre Nosotros', roles: [] },
  ];

  const rootLinks = [
    { href: '/users', label: 'Usuarios', roles: [Role.ROOT] },
    { href: '/edit-user', label: 'Editar Usuario', roles: [Role.ROOT] },
  ];

  const handleOutsideNotification = async () => {
    const phoneNumbers = ['54111522550533'];
    const message = '¡Hay alguien esperando afuera!';

    try {
      await Promise.all(
        phoneNumbers.map(async (phoneNumber) => {
          await sendTextMessage(phoneNumber, message);
        })
      );
      alert('Notificación enviada!');
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Error al enviar la notificación');
    }
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
    <header className="header-container theme-surface">
      <Link className="home-link theme-text" href={'/'}>
        <LogoIcon />
        <span className="leading-none">Proyecto Garage</span>
      </Link>
      <nav className="navbar-container" ref={menuRef}>
        <div className="quick-actions">
          <ClientOnly>
            <CartButton />
          </ClientOnly>
        </div>
        <button
          className="hamburger-menu theme-text"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        {isMenuOpen && (
          <motion.div
            animate={isMenuOpen ? 'open' : 'closed'}
            variants={variants}
            className={`menu-items theme-surface ${isMenuOpen ? 'open' : ''}`}
          >
            {navItems.map(
              ({ href, icon: Icon, text, roles }) =>
                (roles.length === 0 || hasRole(roles)) && (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <motion.div
                      whileHover="hover"
                      variants={linkVariants}
                      className={`navigation-item theme-text ${
                        pathname?.includes(href) ? 'active-tab' : ''
                      }`}
                    >
                      <Icon />
                      {text}
                    </motion.div>
                  </Link>
                )
            )}
            <div className="auth-buttons">
              <ThemeToggle />
              <SessionButton />
            </div>
            {user?.app_metadata?.roles?.includes(Role.ROOT) && (
              <>
                {rootLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`navigation-item theme-text ${
                      pathname?.includes(href) ? 'active-tab' : ''
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </>
            )}
          </motion.div>
        )}
      </nav>
    </header>
  );
};

export default NavBar;
