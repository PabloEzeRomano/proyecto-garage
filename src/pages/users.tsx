import useAuth from '@/hooks/useAuth';
import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { Role } from '@/types/database';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps } from 'next';
import { useState, useEffect } from 'react';

export default function Users() {
  const { user, loading } = useAuth([Role.ROOT]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await supabaseAdmin?.auth.admin.listUsers();
      if (response?.data) {
        setUsers(response.data.users as User[]);
      }
      if (response?.error) {
        console.error('Error fetching users:', response.error);
        return;
      }
    };
    fetchUsers();
  }, []);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.user_metadata?.name}</td>
              <td>{user.app_metadata?.roles?.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
