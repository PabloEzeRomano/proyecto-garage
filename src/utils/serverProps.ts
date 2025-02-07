import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Role } from '@/types/database';

/**
 * Query filter options for Supabase queries
 */
interface QueryFilters {
  eq?: Record<string, any>;    // Equal to
  in?: Record<string, any[]>;  // In array of values
  gt?: Record<string, any>;    // Greater than
  lt?: Record<string, any>;    // Less than
  gte?: Record<string, any>;   // Greater than or equal
  lte?: Record<string, any>;   // Less than or equal
  like?: Record<string, any>;  // Pattern matching
  ilike?: Record<string, any>; // Case insensitive pattern matching
  neq?: Record<string, any>;   // Not equal to
}

/**
 * Options for data fetching and server-side operations
 */
interface FetchDataOptions<T> {
  /** The Supabase table name to query */
  table: string;
  /** Specific columns to select (comma-separated). Defaults to '*' */
  columns?: string;
  /** Query filters to apply */
  query?: QueryFilters;
  /** Whether to return a single record. Defaults to false */
  single?: boolean;
  /** Required user roles for access */
  requiredRoles?: Role[];
  /** Redirect path if authentication/authorization fails */
  redirectTo?: string;
  /** Whether authentication is required */
  requireAuth?: boolean;
  /** Sorting configuration */
  order?: {
    column: string;
    ascending: boolean;
  };
  /** Enable server-side mutations */
  mutations?: {
    /** Enable create operation */
    create?: boolean;
    /** Enable update operation */
    update?: boolean;
    /** Enable delete operation */
    delete?: boolean;
  };
}

/**
 * Server-side mutation functions for a specific table
 */
interface TableMutations<T> {
  onCreate?: (data: Partial<T>) => Promise<{ data: T | null; error: Error | null }>;
  onUpdate?: (id: string, data: Partial<T>) => Promise<{ data: T | null; error: Error | null }>;
  onDelete?: (id: string) => Promise<{ error: Error | null }>;
}

export async function fetchDataFromSupabase<T>(
  context: GetServerSidePropsContext,
  options: FetchDataOptions<T>
) {
  const supabase = createServerSupabaseClient(context);

  try {
    // Check authentication if required
    if (options.requireAuth || options.requiredRoles) {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        return {
          redirect: {
            destination: '/auth/sign-in',
            permanent: false,
          },
        };
      }

      // Check roles if required
      if (options.requiredRoles && options.requiredRoles.length > 0) {
        const userRoles = session.user.app_metadata.roles as Role[];
        const hasRequiredRole = options.requiredRoles.some(role =>
          userRoles?.includes(role)
        );

        if (!hasRequiredRole) {
          return {
            redirect: {
              destination: options.redirectTo || '/',
              permanent: false,
            },
          };
        }
      }
    }

    // Build the query
    let query = supabase
      .from(options.table)
      .select(options.columns || '*');

    // Apply filters if any
    if (options.query) {
      Object.entries(options.query).forEach(([operator, conditions]) => {
        Object.entries(conditions).forEach(([field, value]) => {
          switch (operator) {
            case 'eq':
              query = query.eq(field, value);
              break;
            case 'in':
              query = query.in(field, value as any[]);
              break;
            case 'gt':
              query = query.gt(field, value);
              break;
            case 'lt':
              query = query.lt(field, value);
              break;
            case 'gte':
              query = query.gte(field, value);
              break;
            case 'lte':
              query = query.lte(field, value);
              break;
            case 'like':
              query = query.like(field, value as string);
              break;
            case 'ilike':
              query = query.ilike(field, value as string);
              break;
            case 'neq':
              query = query.neq(field, value);
              break;
            default:
              throw new Error(`Invalid operator: ${operator}`);
          }
        });
      });
    }

    // Apply ordering if specified
    if (options.order) {
      query = query.order(options.order.column, { ascending: options.order.ascending });
    }

    // Execute query
    const { data, error } = options.single
      ? await query.single()
      : await query;

    if (error) throw error;

    return {
      props: {
        [options.table]: JSON.parse(JSON.stringify(data || (options.single ? null : []))),
      },
    };
  } catch (error) {
    console.error(`Error fetching ${options.table}:`, error);
    return {
      props: {
        [options.table]: options.single ? null : [],
      },
    };
  }
}

/**
 * Creates a GetServerSideProps function with Supabase integration
 * @param options Configuration options for data fetching and mutations
 * @returns GetServerSideProps function
 *
 * @example
 * // Basic usage
 * export const getServerSideProps = createServerSideProps<Item>({
 *   table: 'items',
 *   columns: '*'
 * });
 *
 * @example
 * // With authentication and role requirements
 * export const getServerSideProps = createServerSideProps<Item>({
 *   table: 'items',
 *   requireAuth: true,
 *   requiredRoles: [Role.ADMIN],
 *   redirectTo: '/login'
 * });
 *
 * @example
 * // With filters and ordering
 * export const getServerSideProps = createServerSideProps<Event>({
 *   table: 'events',
 *   query: {
 *     gt: { date: new Date().toISOString() },
 *     eq: { status: 'active' }
 *   },
 *   order: {
 *     column: 'date',
 *     ascending: true
 *   }
 * });
 *
 * @example
 * // With mutations
 * export const getServerSideProps = createServerSideProps<Item>({
 *   table: 'items',
 *   mutations: {
 *     create: true,
 *     update: true,
 *     delete: true
 *   }
 * });
 */
export function createServerSideProps<T>(options: FetchDataOptions<T>): GetServerSideProps {
  return async (context) => {
    return fetchDataFromSupabase<T>(context, options);
  };
}