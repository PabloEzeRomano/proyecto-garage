import useAuth from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { Role } from '@/types/database';
import { GetServerSideProps } from 'next';
import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { Input } from '@/components/Input';

export default function EditUser() {
  const { user, loading } = useAuth([Role.ROOT]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!supabaseAdmin) return;
      const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) {
        console.error('Error fetching users:', error);
        return;
      }
      setUsers(users);
    };
    fetchUsers();
  }, []);

  const handleUserSelect = (userId: string) => {
    const user = users.find(u => u.id === userId);
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
        app_metadata: { roles: selectedUser.app_metadata?.roles }
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
            onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
          />
          <Input
            label="Name"
            type="text"
            value={selectedUser.user_metadata?.name}
            onChange={(e) => setSelectedUser({ ...selectedUser, user_metadata: { ...selectedUser.user_metadata, name: e.target.value } })}
          />
          <Input
            label="Role"
            type="select"
            value={selectedUser.app_metadata?.roles[0] || ''}
            options={[Role.USER, Role.ADMIN, Role.ROOT]}
            onChange={(e) => setSelectedUser({ ...selectedUser, app_metadata: { ...selectedUser.app_metadata, roles: [e.target.value as Role] } })}
          />
          <button type="submit">Update User</button>
        </form>
      )}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const supabase = createClient(req as any, res as any);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user || error || !user.app_metadata?.roles?.includes(Role.ROOT)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {}
  };
};
