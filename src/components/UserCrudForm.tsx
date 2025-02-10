import { Input } from '@/components/Input';
import { useAuthMutations } from '@/hooks/useAuthMutations';
import { Role } from '@/types/database';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { useState } from 'react';

interface InputConfig {
  label: string;
  name: string;
  type: string;
  value: any;
  options?: string[];
}

type UserUpdateData = {
  id?: string;
  email: string;
  user_metadata: { name: string };
  app_metadata: { roles: Role[] };
};

interface UserCrudFormProps {
  data?: User;
  defaultData: UserUpdateData;
  title: string;
  inputs: InputConfig[];
  redirectPath: string;
}

export function UserCrudForm({
  data,
  defaultData,
  title,
  inputs,
  redirectPath,
}: UserCrudFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<UserUpdateData>(() => {
    if (data) {
      return {
        id: data.id,
        email: data.email || '',
        user_metadata: {
          name: data.user_metadata?.name || '',
        },
        app_metadata: {
          roles: (data.app_metadata?.roles || [Role.USER]) as Role[],
        },
      };
    }
    return defaultData;
  });
  const { updateUser, createUser, loading } = useAuthMutations();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const nameParts = name.split('.');

    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;

      for (let i = 0; i < nameParts.length - 1; i++) {
        const part = nameParts[i];
        if (!(part in current)) {
          current[part] = {};
        }
        current = current[part];
      }

      const lastPart = nameParts[nameParts.length - 1];
      if (lastPart.includes('[') && lastPart.includes(']')) {
        const [arrayName, indexStr] = lastPart.split(/[\[\]]/);
        const index = parseInt(indexStr);
        if (!Array.isArray(current[arrayName])) {
          current[arrayName] = [];
        }
        current[arrayName][index] = value;
      } else {
        current[lastPart] = value;
      }

      return newData;
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, ...restData } = formData;

    try {
      if (id) {
        await updateUser(id, {
          email: restData.email,
          user_metadata: { name: restData.user_metadata.name },
          app_metadata: { roles: restData.app_metadata.roles },
        }, {
          onSuccess: () => {
            router.push(redirectPath);
          },
          onError: (error) => {
            console.error('Error updating user:', error);
            alert('Error updating user: ' + error.message);
          }
        });
      } else {
        await createUser({
          email: restData.email,
          password: 'temporary-password', // You might want to generate this or request it from the user
          user_metadata: { name: restData.user_metadata.name },
          app_metadata: { roles: restData.app_metadata.roles },
        }, {
          onSuccess: () => {
            router.push(redirectPath);
          },
          onError: (error) => {
            console.error('Error creating user:', error);
            alert('Error creating user: ' + error.message);
          }
        });
      }
    } catch (error) {
      // Errors are handled by onError callbacks
    }
  };

  return (
    <div className="add-container">
      <h1 className="add-title">
        {formData.id ? `Actualizar ${title}` : `Agregar ${title}`}
      </h1>
      <form onSubmit={handleFormSubmit} className="form-container">
        {inputs.map((input) => {
          const nameParts = input.name.split('.');
          let currentValue: any = formData;
          for (const part of nameParts) {
            if (currentValue && typeof currentValue === 'object') {
              currentValue = currentValue[part];
            }
          }

          return (
            <Input
              key={input.name}
              {...input}
              value={currentValue}
              onChange={handleInputChange}
            />
          );
        })}

        <div className="flex justify-between">
          <button type="submit" className="submit" disabled={loading}>
            {formData.id ? `Actualizar ${title}` : `Agregar ${title}`}
          </button>
        </div>
      </form>
    </div>
  );
}