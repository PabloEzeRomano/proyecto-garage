import { ClientOnly } from '@/components/ClientOnly';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Role } from '@/types/database';
import { createAdminServerSideProps } from '@/utils/serverProps';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '../../../public/icons';

import '@/styles/table.css';
import '@/styles/users.css';

interface UsersProps {
  users: User[];
}

export const UsersPage: React.FC<UsersProps> = ({ users: initialUsers }) => {
  const { loading, hasRole } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);

  if (loading) {
    return <div>Loading...</div>;
  }

  console.log(users);

  if (!hasRole([Role.ROOT])) {
    router.push('/');
  }

  const deleteUser = async (id: string) => {
    const { data, error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      console.error('Error deleting user:', error);
    } else {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <ClientOnly>
      <div className="main-container">
        <h1 className="main-title">Usuarios</h1>
        <div className="table-container">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th className="header-cell">Nombre</th>
                <th className="header-cell">Email</th>
                <th className="header-cell">Rol</th>
                <th className="header-cell">Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {users.map((user) => (
                <tr key={user.id} className="table-row">
                  <td className="table-cell">
                    <div className="user-name">{user.user_metadata.name}</div>
                  </td>
                  <td className="table-cell">
                    <div className="user-email">{user.email}</div>
                  </td>
                  <td className="table-cell">
                    <span className="user-role">
                      {user.app_metadata?.roles?.join(', ')}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="actions">
                      <button
                        className="action-button edit-button"
                        onClick={() => router.push(`/users/update/${user.id}`)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => deleteUser(user.id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ClientOnly>
  );
};

export default UsersPage;

export const getServerSideProps = createAdminServerSideProps<User>({
  fetchFn: async (adminClient) => {
    const response = await adminClient.auth.admin.listUsers();
    return {
      data: response.data.users,
      error: response.error,
    };
  },
  key: 'users',
  requiredRoles: [Role.ROOT],
});
