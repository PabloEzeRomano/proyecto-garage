import '@/styles/searchBar.css';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef } from 'react';

interface SearchBarProps {
  handleSearch: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export const SearchBar = ({ handleSearch, isLoading }: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('query')?.toString() || '';
    const date = formData.get('date')?.toString() || '';

    // Update URL with search parameters
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    if (date) params.set('date', date);

    if (query || date) {
      handleSearch(e);
      router.push(`/?${params.toString()}`);
    } else {
      router.push(`/`);
    }
  };

  return (
    <div className="search-container">
      <form ref={formRef} onSubmit={onSubmit} className="search-form theme-surface">
        <div className="search-input-group">
          <input
            type="text"
            name="query"
            className="search-input"
            placeholder="Buscar eventos..."
            defaultValue={searchParams?.get('query') || ''}
          />
        </div>
        <div className="search-input-group">
          <input
            type="date"
            name="date"
            placeholder="dd/mm/yyyy"
            min={new Date().toISOString().split('T')[0]}
            className="search-input"
            defaultValue={searchParams?.get('date') || ''}
          />
        </div>
        <button type="submit" className="search-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <svg
                className="search-button-loading w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Buscando...</span>
            </>
          ) : (
            <span>Buscar</span>
          )}
        </button>
      </form>
    </div>
  );
};
