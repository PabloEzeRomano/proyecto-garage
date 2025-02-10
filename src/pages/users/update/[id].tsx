import { UserCrudForm } from '@/components/UserCrudForm';
import { useAuth } from '@/contexts/AuthContext';
import { Role } from '@/types/database';
import { createAdminServerSideProps } from '@/utils/serverProps';
import { User } from '@supabase/supabase-js';

export default function UpdateUser({ user }: { user: User }) {
  const { loading } = useAuth();

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  const defaultUser = {
    email: '',
    user_metadata: { name: '' },
    app_metadata: { roles: [Role.USER] as Role[] },
  };

  const inputs = [
    {
      label: 'Email',
      type: 'email',
      name: 'email',
      value: user.email,
    },
    {
      label: 'Name',
      type: 'text',
      name: 'user_metadata.name',
      value: user.user_metadata?.name || '',
    },
    {
      label: 'Role',
      type: 'select',
      name: 'app_metadata.roles[0]',
      value: user.app_metadata?.roles?.[0] || Role.USER,
      options: [Role.USER, Role.ADMIN, Role.ROOT],
    },
  ];

  return (
    <UserCrudForm
      data={user}
      defaultData={defaultUser}
      title="User"
      inputs={inputs}
      redirectPath="/users"
    />
  );
}

export const getServerSideProps = createAdminServerSideProps<User>({
  fetchFn: async (adminClient, { params }) => {
    const { data, error } = await adminClient.auth.admin.getUserById(
      params?.id as string
    );
    if (!data.user) {
      throw new Error('User not found');
    }
    return { data: data.user, error };
  },
  requiredRoles: [Role.ROOT],
  key: 'user',
});
