

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
  GraduationCap,
  ClipboardCheck,
  BookOpenCheck,
  FilePen,
  UserPlus,
  Briefcase,
  Library,
  Bus,
  BedDouble,
  DollarSign,
  MessageSquare,
  Calendar as CalendarIcon,
  ShieldCheck,
  History,
  AreaChart,
  HeartPulse,
  Utensils,
  UserSquare,
  FileArchive,
  DatabaseZap,
  BrainCircuit,
  Trophy,
  Bot,
  Columns,
  Archive,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AppSidebarProps {
  user: User;
}

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
  { href: '/admissions', label: 'Admissions', icon: UserPlus, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { href: '/staff', label: 'Staff', icon: Briefcase, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { href: '/students', label: 'Students', icon: Users, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.SUPER_ADMIN] },
  { href: '/exams', label: 'Exams', icon: FilePen, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.SUPER_ADMIN] },
  { href: '/academics/cbc', label: 'CBC Assessment', icon: ClipboardCheck, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.SUPER_ADMIN] },
  { href: '/attendance', label: 'Attendance', icon: CalendarCheck, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.SUPER_ADMIN] },
  { href: '/gradebook', label: 'Gradebook', icon: GraduationCap, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.SUPER_ADMIN] },
  { href: '/timetable', label: 'Timetable', icon: BookCopy, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
  { href: '/lms', label: 'LMS', icon: BookOpenCheck, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
  { href: '/lms/discussions', label: 'Discussions', icon: MessageSquare, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
  { href: '/library', label: 'Library', icon: Library, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
  { href: '/transport', label: 'Transport', icon: Bus, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { href: '/hostel', label: 'Hostel', icon: BedDouble, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { href: '/announcements', label: 'Announcements', icon: Megaphone, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
  { href: '/messages', label: 'Messages', icon: MessageSquare, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
  { href: '/events', label: 'Events', icon: CalendarIcon, roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT] },
  { href: '/report-cards', label: 'Report Cards', icon: ClipboardCheck, roles: [ROLES.ADMIN, ROLES.TEACHER, ROLES.SUPER_ADMIN] },
  { href: '/finance', label: 'Finance', icon: DollarSign, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { href: '/analytics', label: 'Analytics', icon: AreaChart, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { type: 'divider', roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT]},
  { href: '/academics/adaptive-learning', label: 'Adaptive Learning', icon: BrainCircuit, roles: [ROLES.STUDENT, ROLES.PARENT] },
  { href: '/academics/gamification', label: 'Achievements', icon: Trophy, roles: [ROLES.STUDENT, ROLES.PARENT] },
  { type: 'divider', roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN]},
  { href: '/inventory', label: 'Inventory', icon: Archive, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN]},
  { href: '/canteen', label: 'Canteen', icon: Utensils, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { href: '/alumni', label: 'Alumni', icon: UserSquare, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { href: '/health', label: 'Health Center', icon: HeartPulse, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { href: '/academics/document-vault', label: 'Document Vault', icon: FileArchive, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN]},
  { type: 'divider', roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN]},
  { href: '/analytics/ai-query', label: 'AI Query', icon: Bot, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { href: '/analytics/cross-school', label: 'Cross-School', icon: Columns, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { href: '/security/data-privacy', label: 'Data & Privacy', icon: DatabaseZap, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
  { href: '/security/permissions', label: 'Permissions', icon: ShieldCheck, roles: [ROLES.SUPER_ADMIN] },
  { href: '/security/audit-log', label: 'Audit Log', icon: History, roles: [ROLES.ADMIN, ROLES.SUPER_ADMIN] },
];

export function AppSidebar({ user }: AppSidebarProps) {
  const { logout } = useAuth();
  const pathname = usePathname();

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${''}${names[0][0]}${names[1][0]}`;
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
      <div className="flex-1 overflow-y-auto">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-1">
          {navLinks.filter(link => link.roles.includes(user.role)).map((link, index) => (
            link.type === 'divider' ? (
              <div key={`divider-${index}`} className="my-2 border-t border-border/50" />
            ) : (
            <Link key={link.href} href={link.href!} className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname.startsWith(link.href!) ? 'bg-muted text-primary' : 'text-muted-foreground hover:text-primary'}`}>
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
            )
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
