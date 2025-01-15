'use client';

import useAuth from '@/hooks/useAuth';
import { sendTextMessage } from '@/lib/whatsapp';
import '@/styles/navbar.css';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  UsersIcon
} from '../../public/icons';
import { CartButton } from './CartButton';
import { ClientOnly } from './ClientOnly';
import { SessionButton } from './SesionButton';
import { Role } from '@/types/database';

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
  const router = useRouter();

  const navItems = [
    { href: '/users', icon: UsersIcon, text: 'Usuarios', roles: [Role.ADMIN] },
    { href: '/stocks', icon: StockIcon, text: 'Stock', roles: [Role.ADMIN] },
    { href: '/profile', icon: UsersIcon, text: 'Perfil', roles: [] },
    {
      href: '/edit-user',
      icon: UsersIcon,
      text: 'Editar Usuario',
      roles: [],
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
    { href: '/about-us', icon: AboutIcon, text: 'Sobre Nosotros', roles: [] },
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
    <header className="header-container">
      <Link className="home-link" href={'/'}>
        <LogoIcon />
        <span className="leading-none">Proyecto Garage</span>
      </Link>
      <nav className="navbar-container" ref={menuRef}>
        <div className="quick-actions">
          <ClientOnly>
            <CartButton />
          </ClientOnly>
          <button
            onClick={handleOutsideNotification}
            className="quick-action-button outside-button"
          >
            ¡Estoy afuera!
          </button>
          <Link
            href="/events"
            className="quick-action-button text-white flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
          >
            <EventsIcons className="w-5 h-5" />
            <span>Eventos</span>
          </Link>
        </div>
        <button
          className="hamburger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
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
              (roles.length === 0 || hasRole(roles)) && (
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
          <div className="auth-buttons">
            <SessionButton />
          </div>
        </motion.div>
      </nav>
    </header>
  );
};

export default NavBar;
