import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import useAuth from '@/hooks/useAuth';
import { prisma } from '@/lib/prisma';
import { User, Role } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { getSession } from 'next-auth/react';

import '@/styles/addForm.css';

interface EditUserProps {
  users: User[];
}

export default function EditUser({ users }: EditUserProps) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { session, status } = useAuth([Role.ADMIN]);

  if (status === 'loading' || !session) {
    return <div>Cargando...</div>;
  }

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(e.target.value);
    const user = users.find((u) => u.id === userId) || null;
    setSelectedUser(user);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (!selectedUser) return;
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    await fetch('/api/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(selectedUser),
    });

    router.push('/edit-user');
  };

  const inputs = [
    {
      label: 'Nombre',
      onChange: handleInputChange,
      type: 'text',
      name: 'name',
      value: selectedUser?.name || '',
    },
    {
      label: 'Email',
      onChange: handleInputChange,
      type: 'email',
      name: 'email',
      value: selectedUser?.email || '',
    },
    {
      label: 'Rol',
      onChange: handleInputChange,
      type: 'select',
      name: 'role',
      value: selectedUser?.role,
      options: Object.values(Role),
    },
    // Add more fields as needed
  ];

  return (
    <div className="add-container">
      <h1 className="add-title">Editar Usuario</h1>
      <Select
        label="Seleccionar usuario"
        name="userSelect"
        value={selectedUser?.id?.toString() || ''}
        options={users.map((user) => `${user.id}:${user.name} (${user.email})`)}
        onChange={handleUserSelect}
      />
      {selectedUser && (
        <form onSubmit={handleFormSubmit} className="form-container">
          {inputs.map((input, index) => (
            <Input key={index} {...input} />
          ))}
          <button type="submit" className="submit">
            Actualizar Usuario
          </button>
        </form>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  console.log(session);

  if (!session || !session.user || session.user.role !== Role.ADMIN) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const users = await prisma.user.findMany();
  return { props: { users: JSON.parse(JSON.stringify(users)) } };
};
