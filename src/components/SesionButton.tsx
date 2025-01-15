import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { UserPlusIcon } from '../../public/icons';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import '@/styles/button.css';

export const SessionButton = () => {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push('/auth/sign-in');
    }
  };

  if (loading) {
    return null;
  }

  if (session) {
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
