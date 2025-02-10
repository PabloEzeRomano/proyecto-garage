import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserPlusIcon } from '../../public/icons';
import { useSupabase } from '@/contexts/SupabaseContext';
import { useAuth } from '@/contexts/AuthContext';
import '@/styles/button.css';

export const SessionButton = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const supabase = useSupabase();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/auth/sign-in');
    }
  };

  if (loading) {
    return null;
  }

  if (!!user) {
    return (
      <motion.button
        className="secondary"
        onClick={handleSignOut}
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
        onClick={() => router.push('/auth/sign-in')}
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
