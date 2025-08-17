export const ROLES = {
  ADMIN: 'admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface User {
  name: string;
  role: Role;
}

export const USERS: User[] = [
  { name: 'Admin User', role: ROLES.ADMIN },
  { name: 'Teacher User', role: ROLES.TEACHER },
  { name: 'Student User', role: ROLES.STUDENT },
  { name: 'Parent User', role: ROLES.PARENT },
];
