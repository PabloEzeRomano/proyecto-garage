'use client';

import useAuth from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { LogoIcon } from '../../public/icons';
import { CartButton } from './CartButton';
import { sendTextMessage } from '@/lib/whatsapp';
import { ClientOnly } from './ClientOnly';
import '@/styles/navbar.css';

export const NavBar = () => {
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleOrderFood = () => {
    router.push('/products');
  };

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
          <button
            onClick={handleOrderFood}
            className="quick-action-button order-button"
          >
            Ver Productos
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
