import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import useAuth from '@/hooks/useAuth';
import { prisma } from '@/lib/prisma';
import { User, Role } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import '@/styles/addForm.css';
import { getSession } from 'next-auth/react';

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

  const { session, status } = useAuth();

  if (status === 'loading' || !session) {
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
    const { id, role, ...updateData } = userData;

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
      value: userData.role || '',
      options: Object.values(Role),
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
  const session = await getSession(context);
  if (!session || !session.user) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return { props: { user: JSON.parse(JSON.stringify(user)) } };
};
