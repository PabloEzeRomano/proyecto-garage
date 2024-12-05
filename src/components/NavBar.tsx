import useAuth from '@/hooks/useAuth';
import { Role } from '@prisma/client';
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
  const router = useRouter();

  // const navItems = [
  //   { href: '/users', icon: UsersIcon, text: 'Usuarios', roles: [Role.ADMIN] },
  //   { href: '/stocks', icon: StockIcon, text: 'Stock', roles: [Role.ADMIN] },
  //   { href: '/profile', icon: UsersIcon, text: 'Perfil', roles: [] },
  //   { href: '/edit-user', icon: UsersIcon, text: 'Editar Usuario', roles: [Role.ADMIN] },
  //   { href: '/createQR', icon: UsersIcon, text: 'Crear QR', roles: [] },
  //   { href: '/testMessages', icon: UsersIcon, text: 'Enviar Mensaje', roles: [] },
  //   {
  //     href: '/add-stock',
  //     icon: AddStockIcon,
  //     text: 'Agregar Stock',
  //     roles: [Role.ADMIN],
  //   },
  //   {
  //     href: '/add-item',
  //     icon: AddItemIcon,
  //     text: 'Agregar Item',
  //     roles: [Role.ADMIN],
  //   },
  //   {
  //     href: '/add-event',
  //     icon: AddEventIcon,
  //     text: 'Agregar Evento',
  //     roles: [Role.ADMIN],
  //   },
  //   { href: '/items', icon: MenuIcon, text: 'Menu', roles: [Role.ADMIN] },
  //   { href: '/events', icon: EventsIcons, text: 'Proximos Eventos', roles: [] },
  //   { href: '/about-us', icon: AboutIcon, text: 'Sobre Nosotros', roles: [] },
  // ];

  // const toggleMenu = () => {
  //   setIsMenuOpen(!isMenuOpen);
  // };
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
  //       setIsMenuOpen(false);
  //     }
  //   };
  // document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);
  const handleOutsideNotification = async () => {
    const phoneNumbers = ['5491122550533', '5491168484932'];
    const message = '¡Hay alguien esperando afuera!';

    try {
      await Promise.all(
        phoneNumbers.map(async (phoneNumber) => {
          const response = await fetch('/api/sendMessage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber, message }),
          });

          if (!response.ok) {
            throw new Error(`Error sending message to ${phoneNumber}`);
          }
        })
      );

      alert('Notificación enviada!');
    } catch (error) {
      console.error('Error sending notifications:', error);
      alert('Error al enviar la notificación');
    }
  };

  const handleOrderFood = () => {
    router.push('/items');
  };

  return (
    <header className="header-container">
      <Link className="home-link" href={'/'}>
        <LogoIcon />
        <span className="leading-none">Proyecto Garage</span>
      </Link>
      <nav className="navbar-container" ref={menuRef}>
        {/* <button className="hamburger-menu" onClick={toggleMenu}>
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
        </motion.div> */}
        <div className="quick-actions">
          <button
            onClick={handleOutsideNotification}
            className="quick-action-button outside-button"
          >
            ¡Estoy afuera!
          </button>
          <button
            onClick={handleOrderFood}
            className="quick-action-button order-button"
          >
            Pedir Morfi
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
