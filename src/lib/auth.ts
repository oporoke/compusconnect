

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
