import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, BookOpen, Users, MapPin, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}
export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const navItems = [
  {
    name: 'Chat',
    path: '/',
    icon: MessageSquare
  },
  {
    name: 'Lectures',
    path: '/lectures',
    icon: BookOpen
  },
  {
    name: 'Lecturers',
    path: '/lecturers',
    icon: Users
  },
  {
    name: 'Halls',
    path: '/halls',
    icon: MapPin
  },
  {
    name: 'About',
    path: '/about',
    icon: Info
  }];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen &&
      <div
        className="fixed inset-0 z-20 bg-black/50 lg:hidden"
        onClick={() => setIsOpen(false)} />

      }

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}>
        
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center gap-2 px-6 border-b border-border lg:hidden">
            <img
              src="/images.png"
              alt="University of Sri Jayewardenepura crest"
              className="w-8 h-8 object-contain" />
            
            <span className="font-bold text-primary text-lg">USJ Physics</span>
          </div>

          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            {navItems.map((item) =>
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive ?
                'bg-primary/10 text-primary' :
                'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )
              }>
              
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            )}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              © 2026 USJ Physics Dept.
            </div>
          </div>
        </div>
      </aside>
    </>);

};