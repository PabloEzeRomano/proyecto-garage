import { Input } from '@/components/Input';
import { useMutations } from '@/hooks/useMutations';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { TrashIcon } from '../../public/icons/TrashIcon';

import '@/styles/addForm.css';
interface InputConfig {
  label: string;
  name: string;
  type: string;
  value: any;
  options?: Array<{ value: string; label: string }>;
}

interface CrudFormProps<T> {
  data?: T;
  defaultData: T;
  table: string;
  title: string;
  inputs: InputConfig[];
  redirectPath: string;
  showImageUpload?: boolean;
}

export function CrudForm<T extends { id: number; image_url?: string | null }>({
  data,
  defaultData,
  table,
  title,
  inputs,
  redirectPath,
  showImageUpload = false,
}: CrudFormProps<T>) {
  const router = useRouter();
  const [formData, setFormData] = useState<T>(data || defaultData);
  const [addMore, setAddMore] = useState(false);
  const { update, create, loading } = useMutations(table);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!showImageUpload) return;

      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = () => {
        setFormData({ ...formData, image_url: reader.result as string });
      };

      reader.readAsDataURL(file);
    },
    [formData, showImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    let parsedValue;

    if (type === 'checkbox') {
      parsedValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      parsedValue = value === '' ? '' : parseFloat(value);
    } else {
      parsedValue = value;
    }

    setFormData((prev) => {
      return { ...prev, [name]: parsedValue };
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { id, ...restData } = formData;

    const isUpdate = id !== -1;

    console.log({ restData, isUpdate });

    try {
      if (isUpdate) {
        await update(id.toString(), restData);
      } else {
        await create(restData);
      }
    } catch (error) {
      console.error(
        `Error ${isUpdate ? 'updating' : 'adding'} ${table}:`,
        error
      );
    }

    if (addMore) {
      if (isUpdate) {
        router.push(`/add-${table.slice(0, -1)}/new`);
      }
      setFormData(defaultData);
    } else {
      router.push(redirectPath);
    }
  };

  return (
    <div className="add-container">
      <h1 className="add-title">
        {formData.id !== -1 ? `Actualizar ${title}` : `Agregar ${title}`}
      </h1>
      <form onSubmit={handleFormSubmit} className="form-container">
        {inputs.map((input) => {
          const currentValue = formData[input.name as keyof T];
          let inputValue: string | number | undefined;

          if (input.type === 'number') {
            inputValue = currentValue !== undefined ? String(currentValue) : '';
          } else if (typeof currentValue === 'boolean') {
            inputValue = undefined; // For checkboxes, we'll use the checked prop instead
          } else {
            inputValue = currentValue as string;
          }

          return (
            <Input
              key={input.name}
              {...input}
              value={inputValue}
              checked={input.type === 'checkbox' ? (currentValue as boolean) : undefined}
              onChange={handleInputChange}
            />
          );
        })}

        {showImageUpload && (
          <>
            <div {...getRootProps()} className="dropzone">
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Suelta la imagen aquí ...</p>
              ) : (
                <p>
                  Arrastrá y soltá una imagen, o hacé click para seleccionar una
                </p>
              )}
            </div>
            {formData.image_url && (
              <div className="flex items-center p-2 border border-stroke rounded-lg mb-4">
                <Image
                  src={formData.image_url}
                  alt="Subida"
                  width={200}
                  height={200}
                  style={{ marginTop: '10px', borderRadius: '10px' }}
                />
                <button
                  className="text-red-500"
                  onClick={() => setFormData({ ...formData, image_url: null })}
                >
                  <TrashIcon />
                </button>
              </div>
            )}
          </>
        )}

        <div className="flex justify-between">
          <button type="submit" className="submit" disabled={loading}>
            {formData.id !== -1 ? `Actualizar ${title}` : `Agregar ${title}`}
          </button>
          <Input
            label={`Agregar otro ${title.toLowerCase()} después de este`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setAddMore(!!e.target.checked);
            }}
            type="checkbox"
            checked={addMore}
          />
        </div>
      </form>
    </div>
  );
}
