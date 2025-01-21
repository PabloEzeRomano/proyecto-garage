import { Input } from '@/components/Input';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';

import '@/styles/session.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      router.push('/');
    } catch (error) {
      alert('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    if (error) {
      alert('Error al enviar el correo de recuperación');
    } else {
      alert('Correo de recuperación enviado');
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
          disabled={loading}
        />
        <Input
          placeholder="*****"
          label="Contraseña:"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
          className="session-input"
          disabled={loading}
        />
        <div className="flex items-center justify-between">
          <button className="session-button" type="submit" disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </div>
        <div className="session-divider" />
        <div className="flex justify-between items-center">
          <button
            type="button"
            className="session-link"
            onClick={handleResetPassword}
            disabled={!email || loading}
          >
            ¿Olvidaste tu contraseña?
          </button>
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