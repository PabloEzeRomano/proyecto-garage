import useAuth from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Role, User } from '@/types/database';
import { GetServerSideProps } from 'next';

export default function Users({ users }: { users: User[] }) {
  const { session, loading } = useAuth([Role.ADMIN]);

  if (loading || !session) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: users, error } = await supabase
    .from('users')
    .select('*');

  if (error) throw error;

  return {
    props: { users: users || [] },
  };
};
