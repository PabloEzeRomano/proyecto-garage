import { signIn, signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserPlusIcon } from '../../public/icons';

import '@/styles/button.css';

export const SessionButton = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <motion.button
        className="secondary"
        onClick={() => signOut()}
        whileHover={{
          scale: 1.1,
          boxShadow: '0 0 8px #946b4d',
          textShadow: '0 0 8px #946b4d',
        }}
      >
        <span className="truncate">Cerrar sesión</span>
      </motion.button>
    );
  }

  return (
    <>
      <motion.button
        className="primary"
        onClick={() => signIn()}
        whileHover={{
          scale: 1.1,
          boxShadow: '0 0 8px #6366f1',
          textShadow: '0 0 8px #6366f1',
        }}
      >
        <span className="truncate">Iniciar sesión</span>
      </motion.button>
      <Link href="/auth/sign-up" className="navigation-item flex-1">
        <UserPlusIcon className="w-6 h-6" />
        <span>Registrarse</span>
      </Link>
    </>
  );
};
