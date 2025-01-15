import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import useAuth from '@/hooks/useAuth';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { Role } from '@/types/database';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';

import '@/styles/addForm.css';

interface EditUserProps {
  users: User[];
}

function EditUser({ users }: EditUserProps) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<User | null>(users[0] || null);

  const { user, loading } = useAuth([Role.ADMIN]);

  if (loading || !user) {
    return <div>Cargando...</div>;
  }

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = e.target.value;
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

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (!selectedUser) return;
    setSelectedUser({ ...selectedUser, user_metadata: { name: value } });
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    if (!selectedUser) return;
    setSelectedUser({ ...selectedUser, app_metadata: { roles: [value] } });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    const { error } = (await supabaseAdmin?.auth.admin.updateUserById(
      selectedUser.id,
      {
        email: selectedUser.email,
        user_metadata: { name: selectedUser.user_metadata?.name },
        app_metadata: { roles: [selectedUser.app_metadata?.roles?.[0]] },
      }
    )) || { error: new Error('Admin client not available') };

    if (error) {
      console.error('Error updating user:', error);
      return;
    }

    router.push('/edit-user');
  };

  const inputs = [
    {
      label: 'Nombre',
      onChange: handleNameChange,
      type: 'text',
      name: 'user_metadata.name',
      value: selectedUser?.user_metadata?.name || '',
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
      onChange: handleRoleChange,
      type: 'select',
      name: 'app_metadata.roles',
      value: selectedUser?.app_metadata?.roles?.[0] || '',
      options: [Role.USER, Role.ADMIN],
    },
    // Add more fields as needed
  ];

  console.log('Users fetched:', users);

  return (
    <div className="add-container">
      <h1 className="add-title">Editar Usuario</h1>
      <Select
        label="Seleccionar usuario"
        name="userSelect"
        value={selectedUser?.id?.toString() || ''}
        options={users.map((user) => ({
          value: user.id.toString(),
          label: `${user.user_metadata?.name || ''} (${user.email})`,
        }))}
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

export default EditUser;

export const getServerSideProps: GetServerSideProps = async () => {
  if (supabaseAdmin) {
    const {
      data: { users },
      error,
    } = await supabaseAdmin.auth.admin.listUsers();

    if (error) {
      console.error('Error fetching users:', error);
      return { props: { users: [] } };
    }

    return { props: { users: JSON.parse(JSON.stringify(users)) } };
  }

  return { props: { users: [] } };
};
