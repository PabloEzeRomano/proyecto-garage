import { signIn, signOut, useSession } from 'next-auth/react';

import '@/styles/button.css';

export const SessionButton = () => {
  const { data: session } = useSession();

  const buttonProps = session
    ? { className: "secondary", onClick: () => signOut(), text: "Cerrar sesion" }
    : { className: "primary", onClick: () => signIn(), text: "Iniciar sesion" };

  return (
    <button
      className={buttonProps.className}
      onClick={buttonProps.onClick}
    >
      <span className="truncate">{buttonProps.text}</span>
    </button>
  );
};
