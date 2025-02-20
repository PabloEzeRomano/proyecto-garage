import { Input } from '@/components/Input';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import '@/styles/session.css';

export default function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
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

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      alert('Contraseña actualizada correctamente');
      router.push('/auth/sign-in');
    } catch (error) {
      alert('Error al actualizar la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="session-container">
      <form onSubmit={handleSubmit} className="session-form">
        <h2 className="session-title">Actualizar Contraseña</h2>
        <Input
          placeholder="*****"
          label="Nueva Contraseña:"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          value={password}
          className="session-input"
          required
          disabled={loading}
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
          disabled={loading}
        />
        <button
          type="submit"
          className="session-button"
          disabled={loading || !!passwordError}
        >
          {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
        </button>
      </form>
    </div>
  );
}
