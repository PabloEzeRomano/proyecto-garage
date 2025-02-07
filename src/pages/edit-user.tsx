import { Input } from '@/components/Input';
import useAuth from '@/hooks/useAuth';
import { supabaseAdmin } from '@/lib/supabase';
import {
  createServerSupabaseAdmin
} from '@/lib/supabase-server';
import { Role } from '@/types/database';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps } from 'next';
import { useState } from 'react';

export default function EditUser({ users }: { users: User[] }) {
  const { user, loading } = useAuth([Role.ROOT]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleUserSelect = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    setSelectedUser(user || null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !supabaseAdmin) return;

    const { error } = await supabaseAdmin.auth.admin.updateUserById(
      selectedUser.id,
      {
        email: selectedUser.email,
        user_metadata: { name: selectedUser.user_metadata?.name },
        app_metadata: { roles: selectedUser.app_metadata?.roles },
      }
    );

    if (error) {
      alert('Error updating user: ' + error.message);
      return;
    }

    alert('User updated successfully');
  };

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Edit User</h1>
      <select onChange={(e) => handleUserSelect(e.target.value)}>
        <option value="">Select a user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email} - {user.user_metadata?.name}
          </option>
        ))}
      </select>

      {selectedUser && (
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={selectedUser.email}
            onChange={(e) =>
              setSelectedUser({ ...selectedUser, email: e.target.value })
            }
          />
          <Input
            label="Name"
            type="text"
            value={selectedUser.user_metadata?.name}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                user_metadata: {
                  ...selectedUser.user_metadata,
                  name: e.target.value,
                },
              })
            }
          />
          <Input
            label="Role"
            type="select"
            value={selectedUser.app_metadata?.roles[0] || ''}
            options={[Role.USER, Role.ADMIN, Role.ROOT]}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                app_metadata: {
                  ...selectedUser.app_metadata,
                  roles: [e.target.value as Role],
                },
              })
            }
          />
          <button type="submit">Update User</button>
        </form>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const supabase = createServerSupabaseAdmin();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (!user || error || !user.app_metadata?.roles?.includes(Role.ROOT)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  if (!supabase) return { props: { users: [] } };
  const {
    data: { users },
    error: usersError,
  } = await supabase.auth.admin.listUsers();
  if (usersError) {
    console.error('Error fetching users:', usersError);
    return { props: { users: [] } };
  }

  return {
    props: {
      users,
    },
  };
};

