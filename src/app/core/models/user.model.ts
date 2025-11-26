export interface User {
  id: number;
  documentId: string;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  locale: string;
  role: UserRole;
}

export interface UserRole {
  id: number;
  documentId: string;
  name: string;
  description: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  locale: string;
}

export interface LoginCredentials {
  identifier: string; // email or username
  password: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export enum RoleTypes {
  SUPER_ADMIN = 'super_admin',
  YOUTH_ADMIN = 'youth_admin',
  CHOIR_ADMIN = 'choir_admin'
}