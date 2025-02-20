import Link from 'next/link';
import '@/styles/session.css';

export default function VerifyEmail() {
  return (
    <div className="session-container">
      <div className="session-form">
        <h2 className="session-title">Verifica tu correo electrónico</h2>
        <p className="text-center text-[#c9a992] mb-4">
          Te hemos enviado un correo electrónico con un enlace de verificación.
          Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
        </p>
        <div className="session-divider"></div>
        <div className="text-center">
          <Link href="/auth/sign-in" className="session-link">
            Volver a Iniciar Sesión
          </Link>
        </div>
      </div>
    </div>
  );
}
