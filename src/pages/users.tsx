import { ClientOnly } from '@/components/ClientOnly';
import useAuth from '@/hooks/useAuth';
import { supabase, supabaseAdmin } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Role } from '@/types/database';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { EditIcon, TrashIcon } from '../../public/icons';

import '@/styles/users.css';

interface UsersProps {
  users: User[];
}

export const UsersPage: React.FC<UsersProps> = ({ users: initialUsers }) => {
  const { user, loading } = useAuth([Role.ADMIN, Role.ROOT]);
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);

  if (loading) {
    return <div>Loading...</div>;
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
      <div className="list-container">
        <h1 className="list-title">Usuarios</h1>
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
                    <div className="action-buttons">
                      <button
                        className="action-button edit-button"
                        onClick={() => router.push(`/edit-user?id=${user.id}`)}
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

export const getServerSideProps: GetServerSideProps = async () => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (!user || userError || !user.app_metadata?.roles?.includes(Role.ROOT)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  if (!supabaseAdmin) {
    return {
      props: { users: [] },
    };
  }
  const {
    data: { users },
    error,
  } = await supabaseAdmin.auth.admin.listUsers();

  if (error) {
    console.error('Error fetching users:', error);
  }

  return {
    props: { users: users || [] },
  };
};
