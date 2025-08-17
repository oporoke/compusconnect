"use client";

import { User, ROLES } from '@/lib/auth';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LogOut,
  LayoutDashboard,
  Users,
  CalendarCheck,
  BookCopy,
  Megaphone,
  School,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppSidebarProps {
  user: User;
}

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
  { href: '/students', label: 'Students', icon: Users, roles: [ROLES.ADMIN, ROLES.TEACHER] },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck, roles: [ROLES.ADMIN, ROLES.TEACHER] },
  { href: '/timetable', label: 'Timetable', icon: BookCopy, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
  { href: '/announcements', label: 'Announcements', icon: Megaphone, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const { logout } = useAuth();
  const pathname = usePathname();

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return names[0].substring(0, 2);
  };

  return (
    <>
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <School className="h-6 w-6 text-primary" />
          <span className="font-headline">CampusConnect Lite</span>
        </Link>
      </div>
      <div className="flex-1">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-1">
          {navLinks.filter(link => link.roles.includes(user.role)).map(link => (
            <Link key={link.href} href={link.href} className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname === link.href ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={`https://placehold.co/100x100.png`} alt={user.name} data-ai-hint="profile picture" />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold text-sm">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Logout</span>
            </Button>
          </div>
      </div>
    </>
  );
}
