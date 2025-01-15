export enum Role {
  ADMIN = 'admin',
  USER = 'user'
}

export enum Permission {
  ITEMS_CREATE = 'items.create',
  ITEMS_DELETE = 'items.delete',
  EVENTS_CREATE = 'events.create',
  EVENTS_DELETE = 'events.delete',
  STOCKS_CREATE = 'stocks.create',
  STOCKS_DELETE = 'stocks.delete',
  USERS_MANAGE = 'users.manage'
}

export interface UserRole {
  id: number;
  user_id: string;
  role: Role;
}

export interface RolePermission {
  id: number;
  role: Role;
  permission: Permission;
}

export interface User {
  id: number;
  email: string;
  name: string;
  roles: Role[];
  permissions: Permission[];
  image?: string | null;
  password?: string;
  confirmPassword?: string;
}

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  date: string;
  imageUrl?: string | null;
  price: number;
}

export interface Stock {
  id: number;
  itemId: number;
  quantity: number;
  name: string;
  cost: number;
  item?: Item;
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'roles' | 'permissions'>;
        Update: Partial<Omit<User, 'id' | 'roles' | 'permissions'>>;
      };
      user_roles: {
        Row: UserRole;
        Insert: Omit<UserRole, 'id'>;
        Update: Partial<Omit<UserRole, 'id'>>;
      };
      role_permissions: {
        Row: RolePermission;
        Insert: Omit<RolePermission, 'id'>;
        Update: Partial<Omit<RolePermission, 'id'>>;
      };
      items: {
        Row: Item;
        Insert: Omit<Item, 'id'>;
        Update: Partial<Omit<Item, 'id'>>;
      };
      events: {
        Row: Event;
        Insert: Omit<Event, 'id'>;
        Update: Partial<Omit<Event, 'id'>>;
      };
      stocks: {
        Row: Stock;
        Insert: Omit<Stock, 'id'>;
        Update: Partial<Omit<Stock, 'id'>>;
      };
    };
    Functions: {
      get_user_permissions: {
        Args: { user_id: string };
        Returns: Permission[];
      };
      get_user_roles: {
        Args: { user_id: string };
        Returns: Role[];
      };
    };
  };
};