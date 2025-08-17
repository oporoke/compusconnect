
export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface User {
  id: string; // e.g. S001 or T01
  name: string;
  role: Role;
}

// This is now primarily for client-side role mapping and fallback.
// The source of truth for login is the database.
export const USERS: Omit<User, 'id'>[] = [
  { name: 'Super Admin User', role: ROLES.SUPER_ADMIN },
  { name: 'Admin User', role: ROLES.ADMIN },
  { name: 'Teacher User', role: ROLES.TEACHER },
  { name: 'Student User', role: ROLES.STUDENT },
  { name: 'Parent User', role: ROLES.PARENT },
];
