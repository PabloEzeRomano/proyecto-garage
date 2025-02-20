import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import {
  createServerSupabaseAdmin,
  createServerSupabaseClient,
} from '@/lib/supabase-server';
import { Role } from '@/types/database';
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Query filter operators supported by the Supabase query builder
 */
type QueryOperator =
  | 'eq'
  | 'in'
  | 'gt'
  | 'lt'
  | 'gte'
  | 'lte'
  | 'like'
  | 'ilike'
  | 'neq';

/**
 * Query filter options for Supabase queries
 * @property eq - Equal to comparison
 * @property in - Check if value is in array
 * @property gt - Greater than comparison
 * @property lt - Less than comparison
 * @property gte - Greater than or equal comparison
 * @property lte - Less than or equal comparison
 * @property like - Pattern matching (case sensitive)
 * @property ilike - Pattern matching (case insensitive)
 * @property neq - Not equal comparison
 */
interface QueryFilters {
  eq?: Record<string, any>;
  in?: Record<string, any[]>;
  gt?: Record<string, any>;
  lt?: Record<string, any>;
  gte?: Record<string, any>;
  lte?: Record<string, any>;
  like?: Record<string, any>;
  ilike?: Record<string, any>;
  neq?: Record<string, any>;
}

/**
 * Options for data fetching and server-side operations
 * @template T - Type of the data being fetched
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
  /** Custom fetch function that returns Promise<{ data: T | T[], error: any }> */
  customFetch?: (
    supabase: SupabaseClient,
    context: GetServerSidePropsContext
  ) => Promise<{ data: any; error: any }>;
  /** Whether to use the admin client */
  useAdminClient?: boolean;
  /** The key for the fetched data */
  key: string;
}

/**
 * Applies query filters to a Supabase query
 * @param query - The Supabase query builder
 * @param filters - Query filters to apply
 * @param context - Server-side context for parameter resolution
 * @returns The modified query builder
 */
function applyQueryFilters(
  query: any,
  filters: QueryFilters,
  context: GetServerSidePropsContext
) {
  Object.entries(filters).forEach(([operator, conditions]) => {
    Object.entries(conditions).forEach(([field, value]) => {
      // Get the actual value from URL parameters if it's a string reference
      const paramValue =
        typeof value === 'string' && value in (context.params || {})
          ? (context.params as any)[value]
          : value;

      // Skip this filter if paramValue is undefined or null
      if (paramValue === undefined || paramValue === null) {
        return;
      }

      const op = operator as QueryOperator;
      query = query[op](field, op === 'in' ? value : paramValue);
    });
  });
  return query;
}

/**
 * Checks user authentication and authorization
 * @param supabase - Supabase client instance
 * @param options - Fetch data options containing auth requirements
 * @returns Redirect object if auth fails, null if successful
 */
async function checkAuth(
  supabase: SupabaseClient,
  options: FetchDataOptions<any>
) {
  if (!options.requireAuth && !options.requiredRoles) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      redirect: {
        destination: '/auth/sign-in',
        permanent: false,
      },
    };
  }

  if (options.requiredRoles?.length) {
    const userRoles = user.app_metadata.roles as Role[];
    const hasRequiredRole = options.requiredRoles.some((role) =>
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

  return null;
}

// Add this after the imports
type AdminFetchFunction<T> = (
  adminClient: SupabaseClient,
  context: GetServerSidePropsContext
) => Promise<{ data: T | T[]; error: any }>;

/**
 * Creates a GetServerSideProps function specifically for admin operations
 * @template T - Type of the data being fetched
 * @param fetchFn - Admin fetch function that uses the admin client
 * @param requiredRoles - Required roles for access (defaults to [Role.ADMIN])
 * @param key - Key for the returned data in props
 * @returns GetServerSideProps function
 */
export function createAdminServerSideProps<T>({
  fetchFn,
  key,
  requiredRoles = [Role.ADMIN],
}: {
  fetchFn: AdminFetchFunction<T>;
  key: string;
  requiredRoles?: Role[];
}): GetServerSideProps {
  return async (context) => {
    const supabase = createServerSupabaseClient(context);
    const adminClient = createServerSupabaseAdmin();

    try {
      // Check authentication and authorization
      const authCheck = await checkAuth(supabase, {
        requireAuth: true,
        requiredRoles,
        key,
        table: 'admin',
      });
      if (authCheck) return authCheck;

      // Execute admin operation
      const { data, error } = await fetchFn(adminClient, context);
      if (error) {
        console.error(`Admin operation error for ${key}:`, error);
        return { props: { [key]: [] } };
      }

      return {
        props: {
          [key]: JSON.parse(JSON.stringify(data)),
        },
      };
    } catch (error) {
      console.error(`Error in admin operation for ${key}:`, error);
      return { props: { [key]: [] } };
    }
  };
}

/**
 * Fetches data from a single table
 * @param supabase - Supabase client instance
 * @param options - Options for fetching data
 * @param context - Server-side context
 * @returns Object containing the fetched data
 */
async function fetchSingleTable<T>(
  supabase: SupabaseClient,
  options: FetchDataOptions<T>,
  context: GetServerSidePropsContext
) {
  try {
    let query = supabase.from(options.table).select(options.columns || '*');

    if (options.query) {
      query = applyQueryFilters(query, options.query, context);
    }

    if (options.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending,
      });
    }

    // Only skip fetching for single records that have an ID-based query
    const requiresId = options.single && options.query?.eq?.id === 'id';
    if (requiresId && !context.params?.id) {
      return {
        props: { [options.key]: null },
      };
    }

    const { data, error } = options.single ? await query.single() : await query;
    if (error) {
      console.error('Supabase query error:', error);
      return {
        props: { [options.key]: options.single ? null : [] },
      };
    }

    return {
      props: {
        [options.key]: JSON.parse(
          JSON.stringify(data || (options.single ? null : []))
        ),
      },
    };
  } catch (error) {
    console.error(`Error fetching data for ${options.key}:`, error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return { props: { [options.key]: options.single ? null : [] } };
  }
}

// Add this helper function after the imports
function getSupabaseClient(
  context: GetServerSidePropsContext,
  useAdmin: boolean = false
): SupabaseClient {
  return useAdmin
    ? createServerSupabaseAdmin()
    : createServerSupabaseClient(context);
}

/**
 * Fetches data from Supabase for server-side props
 * @template T - Type of the data being fetched
 * @param context - Next.js server-side context
 * @param options - Single or multiple fetch options
 * @returns Props object containing the fetched data
 */
export async function fetchDataFromSupabase<T>(
  context: GetServerSidePropsContext,
  options: FetchDataOptions<T> | FetchDataOptions<T>[]
) {
  const supabase = createServerSupabaseClient(context);

  try {
    if (Array.isArray(options)) {
      const results = await Promise.all(
        options.map(async (opt) => {
          const supabaseFetch = getSupabaseClient(context, opt.useAdminClient);
          const authCheck = await checkAuth(supabase, opt);
          if (authCheck) return authCheck;
          return fetchSingleTable(supabaseFetch, opt, context);
        })
      );

      // Check if any results contain redirects
      const redirect = results.find((result) => 'redirect' in result);
      if (redirect) return redirect;

      // Merge all props from results into a single props object
      const mergedProps = results.reduce((acc, result) => {
        if ('props' in result) {
          return { ...acc, ...result.props };
        }
        return acc;
      }, {});

      return { props: mergedProps };
    }

    const supabaseFetch = getSupabaseClient(context, options.useAdminClient);
    const authCheck = await checkAuth(supabase, options);
    if (authCheck) return authCheck;

    return await fetchSingleTable(supabaseFetch, options, context);
  } catch (error) {
    console.error('Error in fetchDataFromSupabase:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }

    // Return empty results for all requested tables
    if (Array.isArray(options)) {
      const emptyResults = options.reduce(
        (acc, opt) => ({
          ...acc,
          [opt.key]: opt.single ? null : [],
        }),
        {}
      );
      return { props: emptyResults };
    }

    return { props: { [options.key]: options.single ? null : [] } };
  }
}

/**
 * Creates a GetServerSideProps function with Supabase integration
 * @template T - Type of the data being fetched
 * @param options - Configuration options for data fetching
 * @returns GetServerSideProps function
 *
 * @example
 * // Basic usage with single table
 * export const getServerSideProps = createServerSideProps<Item>({
 *   table: 'items',
 *   key: 'items',
 *   columns: '*'
 * });
 *
 * @example
 * // Multiple tables with authentication
 * export const getServerSideProps = createServerSideProps<Item | Stock>([
 *   {
 *     table: 'items',
 *     key: 'items',
 *     columns: 'id, title',
 *     requireAuth: true,
 *     requiredRoles: [Role.ADMIN]
 *   },
 *   {
 *     table: 'stocks',
 *     key: 'stock',
 *     columns: 'id, quantity',
 *     single: true,
 *     query: { eq: { itemId: 'id' } }
 *   }
 * ]);
 *
 * @example
 * // With complex filters and ordering
 * export const getServerSideProps = createServerSideProps<Event>({
 *   table: 'events',
 *   key: 'events',
 *   query: {
 *     gt: { date: new Date().toISOString() },
 *     eq: { status: 'active' }
 *   },
 *   order: {
 *     column: 'date',
 *     ascending: true
 *   }
 * });
 */
export function createServerSideProps<T>(
  options: FetchDataOptions<T> | FetchDataOptions<T>[]
): GetServerSideProps {
  return async (context) => {
    return fetchDataFromSupabase(context, options);
  };
}
