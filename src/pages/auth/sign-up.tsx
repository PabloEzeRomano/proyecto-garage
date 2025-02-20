import { Input } from '@/components/Input';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import '@/styles/session.css';

const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  hasUpperCase: true,
  hasLowerCase: true,
  hasNumber: true,
  hasSpecialChar: true,
};

export default function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validatePassword = (password: string) => {
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
      return `La contraseña debe tener al menos ${PASSWORD_REQUIREMENTS.minLength} caracteres`;
    }
    if (PASSWORD_REQUIREMENTS.hasUpperCase && !/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una mayúscula';
    }
    if (PASSWORD_REQUIREMENTS.hasLowerCase && !/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una minúscula';
    }
    if (PASSWORD_REQUIREMENTS.hasNumber && !/\d/.test(password)) {
      return 'La contraseña debe contener al menos un número';
    }
    if (
      PASSWORD_REQUIREMENTS.hasSpecialChar &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      return 'La contraseña debe contener al menos un carácter especial';
    }
    return '';
  };

  useEffect(() => {
    if (password) {
      const validationError = validatePassword(password);
      if (validationError) {
        setPasswordError(validationError);
        return;
      }
    }

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
    if (password !== repeatPassword || passwordError) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'USER',
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          throw new Error('Este correo electrónico ya está registrado');
        }
        throw error;
      }

      router.push('/auth/verify-email');
    } catch (error: any) {
      alert(error.message || 'Error al registrarse');
    } finally {
      setLoading(false);
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
          disabled={loading}
        />
        <Input
          placeholder="ejemplo@ejemplo.com"
          label="Correo electrónico:"
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          value={email}
          className="session-input"
          required
          disabled={loading}
        />
        <div className="space-y-2">
          <Input
            placeholder="*****"
            label="Contraseña:"
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            value={password}
            className="session-input"
            required
            disabled={loading}
          />
          {password && (
            <ul className="text-sm text-[#c9a992] list-disc list-inside">
              <li
                className={
                  password.length >= PASSWORD_REQUIREMENTS.minLength
                    ? 'text-green-500'
                    : ''
                }
              >
                Mínimo {PASSWORD_REQUIREMENTS.minLength} caracteres
              </li>
              <li className={/[A-Z]/.test(password) ? 'text-green-500' : ''}>
                Al menos una mayúscula
              </li>
              <li className={/[a-z]/.test(password) ? 'text-green-500' : ''}>
                Al menos una minúscula
              </li>
              <li className={/\d/.test(password) ? 'text-green-500' : ''}>
                Al menos un número
              </li>
              <li
                className={
                  /[!@#$%^&*(),.?":{}|<>]/.test(password)
                    ? 'text-green-500'
                    : ''
                }
              >
                Al menos un carácter especial
              </li>
            </ul>
          )}
        </div>
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
          {loading ? 'Registrando...' : 'Registrarse'}
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
