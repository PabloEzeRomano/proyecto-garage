'use client';

import { Input } from '@/components/Input';
import { useAuth } from '@/contexts/AuthContext';
import { Role, UserProfile } from '@/types/database';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

import '@/styles/addForm.css';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userData, setUserData] = useState<UserProfile>({
    ...user,
    password: '',
    confirmPassword: '',
    roles: user?.app_metadata.roles || [],
    permissions: user?.app_metadata.permissions || [],
    name: user?.user_metadata.name || '',
    email: user?.email || '',
    id: user?.id || '',
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (user) {
      setUserData({
        ...user,
        password: '',
        confirmPassword: '',
        roles: user.app_metadata.roles || [],
        permissions: user.app_metadata.permissions || [],
        name: user.user_metadata.name || '',
        email: user.email || '',
        id: user.id || '',
      });
    }
  }, [user]);

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
      value: userData.roles?.[0] || '',
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
