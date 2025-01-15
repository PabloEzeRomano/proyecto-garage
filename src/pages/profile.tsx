import { Input } from '@/components/Input';
import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Role, User } from '@/types/database';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import '@/styles/addForm.css';

interface ProfileProps {
  user: User;
}

export default function Profile({ user: initialUser }: ProfileProps) {
  const router = useRouter();
  const [userData, setUserData] = useState<User & { confirmPassword: string }>({
    ...initialUser,
    password: '',
    confirmPassword: '',
  });

  const { session, loading } = useAuth();

  if (loading || !session) {
    return <div>Cargando...</div>;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, roles, ...updateData } = userData;

    await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updateData }),
    });

    router.push('/profile');
  };

  const inputs = [
    {
      label: 'Nombre',
      onChange: handleInputChange,
      type: 'text',
      name: 'name',
      value: userData.name || '',
    },
    {
      label: 'Email',
      onChange: handleInputChange,
      type: 'email',
      name: 'email',
      value: userData.email || '',
    },
    {
      label: 'Rol',
      onChange: handleInputChange,
      type: 'select',
      name: 'role',
      value: userData.roles[0] || '',
      options: [Role.USER, Role.ADMIN],
    },
    {
      label: 'Contraseña',
      onChange: handleInputChange,
      type: 'password',
      name: 'password',
      value: userData.password || '',
    },
    {
      label: 'Confirmar Contraseña',
      onChange: handleInputChange,
      type: 'password',
      name: 'confirmPassword',
      value: userData.confirmPassword || '',
    },
  ];

  return (
    <div className="add-container">
      <h1 className="add-title">Perfil de Usuario</h1>
      <form onSubmit={handleFormSubmit} className="form-container">
        {inputs.map((input, index) => (
          <Input key={index} {...input} />
        ))}
        <button type="submit" className="submit">
          Actualizar Perfil
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user?.email) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    };
  }

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', session.user.email)
    .single();

  if (error) {
    console.error('Error fetching user:', error);
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    };
  }

  return { props: { user } };
};
