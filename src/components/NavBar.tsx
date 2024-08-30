import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Role } from '@prisma/client';
import {
  AddEventIcon,
  AddItemIcon,
  AddStockIcon,
  EventsIcons,
  LogoIcon,
  MenuIcon,
  StockIcon,
  UsersIcon,
  AboutIcon,
} from '../../public/icons';
import { SessionButton } from './SesionButton';

import '@/styles/navbar.css';

export const NavBar = () => {
  const { isAllowed } = useAuth([], false);
  const pathname = usePathname();

  const navItems = [
    { href: '/users', icon: UsersIcon, text: 'Usuarios', roles: [Role.ADMIN] },
    { href: '/stocks', icon: StockIcon, text: 'Stock', roles: [Role.ADMIN] },
    { href: '/add-stock', icon: AddStockIcon, text: 'Agregar Stock', roles: [Role.ADMIN] },
    { href: '/add-item', icon: AddItemIcon, text: 'Agregar Item', roles: [Role.ADMIN] },
    { href: '/add-event', icon: AddEventIcon, text: 'Agregar Evento', roles: [Role.ADMIN] },
    { href: '/items', icon: MenuIcon, text: 'Menu', roles: [] },
    { href: '/events', icon: EventsIcons, text: 'Proximos Eventos', roles: [] },
    { href: '/about-us', icon: AboutIcon, text: 'Sobre Nosotros', roles: [] }, // New item
  ];

  return (
    <header className="header-container">
      <Link className="home-link" href={'/'}>
        <LogoIcon />
        <span className="leading-none">Proyecto Garage</span>
      </Link>
      <nav className="navbar-container">
        {navItems.map(({ href, icon: Icon, text, roles }) => (
          (roles.length === 0 || isAllowed(roles)) && (
            <Link
              key={href}
              className={`navigation-item ${pathname?.includes(href) ? 'active-tab' : ''}`}
              href={href}
            >
              <Icon />
              {text}
            </Link>
          )
        ))}
        <div className="flex gap-2">
          <SessionButton />
        </div>
      </nav>
    </header>
  );
};
