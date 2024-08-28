import { Input } from '@/components/Input';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import '@/styles/session.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      router.push('/');
    } else {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="session-container">
      <form onSubmit={handleSubmit} className="session-form">
        <h2 className="session-title">Iniciar Sesión</h2>
        <Input
          placeholder="ejemplo@ejemplo.com"
          label="Correo electrónico:"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          value={email}
          className="session-input"
        />
        <Input
          placeholder="*****"
          label="Contraseña:"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
          className="session-input"
        />
        <div className="flex items-center justify-between">
          <button className="session-button" type="submit">
            Iniciar Sesión
          </button>
        </div>
        <div className="session-divider" />
        <div className="flex justify-between items-center">
          <a className="session-link" href="#">
            ¿Olvidaste tu contraseña?
          </a>
          <div className="text-[#c9a992]">
            {`¿No tenés una cuenta? `}
            <Link href="/auth/sign-up" className="session-link">
              Regístrate
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}