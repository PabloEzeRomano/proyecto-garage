import useAuth from '@/hooks/useAuth';
import { prisma } from '@/lib/prisma';
import { Role, User } from '@prisma/client';
import { GetServerSideProps } from 'next';

export default function Users({ users }: { users: User[] }) {
  const { session, status } = useAuth([Role.ADMIN]);

  if (status === 'loading' || !session) {
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
  const users = await prisma.user.findMany();
  return {
    props: { users },
  };
};
