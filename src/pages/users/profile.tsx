'use client';

import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { Role, User } from '@/types/database';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import '@/styles/addForm.css';

interface ProfileProps {
  initialProfile: User;
}

export default function ProfilePage({ initialProfile }: ProfileProps) {
  console.log('initialProfile', initialProfile);
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<User>({
    ...initialProfile,
    password: '',
    confirmPassword: '',
  });

  if (loading || !user) {
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

    if (userData.password !== userData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      email: userData.email,
      password: userData.password || undefined,
      data: {
        name: userData.name,
      },
    });

    if (error) {
      alert('Error al actualizar el perfil: ' + error.message);
      return;
    }

    alert('Perfil actualizado correctamente');
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
      className: 'w-full p-4',
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseClient(context);

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log('user', user);

    if (!user) {
      return {
        redirect: {
          destination: '/auth/sign-in',
          permanent: false,
        },
      };
    }

    if (error) throw error;

    return {
      props: {
        initialProfile: {
          ...user,
          roles: user.app_metadata.roles,
          permissions: user.app_metadata.permissions,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      props: {
        initialProfile: null,
      },
    };
  }
};
