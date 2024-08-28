import { Input } from '@/components/Input';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import '@/styles/session.css';

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (password && repeatPassword) {
      if (password !== repeatPassword) {
        setPasswordError('Las contraseñas no coinciden');
      } else {
        setPasswordError('');
      }
    } else {
      setPasswordError('');
    }
  }, [password, repeatPassword]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (password !== repeatPassword) {
      return;
    }
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      router.push('/auth/sign-in');
    } else {
      alert('Error al registrarse');
    }
  };

  return (
    <div className="session-container">
      <form onSubmit={handleSubmit} className="session-form">
        <h2 className="session-title">Registrarse</h2>
        <Input
          placeholder="Juan"
          label="Nombre:"
          onChange={(e) => setName(e.target.value)}
          type="text"
          value={name}
          className="session-input"
          required
        />
        <Input
          placeholder="ejemplo@ejemplo.com"
          label="Correo electrónico:"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          value={email}
          className="session-input"
          required
        />
        <Input
          placeholder="*****"
          label="Contraseña:"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
          className="session-input"
          required
        />
        <Input
          placeholder="*****"
          label="Repetir Contraseña:"
          onChange={(e) => setRepeatPassword(e.target.value)}
          type="password"
          value={repeatPassword}
          className="session-input"
          required
          error={passwordError}
        />
        <button type="submit" className="session-button">
          Registrarse
        </button>
        <div className="session-divider"></div>
        <div className="text-center">
          <Link href="/auth/sign-in" className="session-link">
            ¿Ya tenés una cuenta? Iniciar Sesión
          </Link>
        </div>
      </form>
    </div>
  );
}