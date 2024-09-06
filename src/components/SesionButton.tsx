import { signIn, signOut, useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

import '@/styles/button.css';

export const SessionButton = () => {
  const { data: session } = useSession();

  const buttonProps = session
    ? { className: "secondary", onClick: () => signOut(), text: "Cerrar sesion", shadowColor: "#946b4d" }
    : { className: "primary", onClick: () => signIn(), text: "Iniciar sesion", shadowColor: "#ff6347" };

  return (
    <motion.button
      className={buttonProps.className}
      onClick={buttonProps.onClick}
      whileHover={{
        scale: 1.1,
        boxShadow: `0 0 8px ${buttonProps.shadowColor}`,
        textShadow: `0 0 8px ${buttonProps.shadowColor}`,
      }}
    >
      <span className="truncate">{buttonProps.text}</span>
    </motion.button>
  );
};
