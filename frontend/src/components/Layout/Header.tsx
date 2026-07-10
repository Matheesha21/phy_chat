import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  UserCircle,
  Moon,
  Sun,
  User,
  Settings,
  LogOut,
  ChevronDown } from
'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
interface HeaderProps {
  toggleSidebar: () => void;
}
export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);
  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);
  const handleSignOut = async () => {
    try {
      await logout();
      toast.success('You have been signed out.');
      navigate('/login', { replace: true });
    } catch {
      toast.error('Failed to sign out. Please try again.');
    }
  };

  const menuItems = [
  {
    label: 'My Profile',
    icon: User,
    onClick: () => toast.info('Profile page is coming soon.')
  },
  {
    label: 'Settings',
    icon: Settings,
    onClick: () => toast.info('Settings are coming soon.')
  },
  {
    label: 'Sign out',
    icon: LogOut,
    onClick: handleSignOut,
    danger: true
  }];

  return (
    <header className="h-16 bg-card border-b border-border border-b-2 border-b-gold/60 flex items-center justify-between px-4 lg:px-8 z-20">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          aria-label="Toggle navigation"
          className="p-2 rounded-md text-muted-foreground hover:bg-secondary lg:hidden">
          
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <img
            src="/images.png"
            alt="University of Sri Jayewardenepura crest"
            className="w-10 h-10 object-contain" />
          
          <h1 className="font-bold text-lg text-foreground hidden sm:block leading-tight">
            USJ Physics Department
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          aria-label={
          theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
          }
          className="p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
          
          {theme === 'dark' ?
          <Sun className="w-5 h-5" /> :

          <Moon className="w-5 h-5" />
          }
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md px-1.5 py-1 hover:bg-secondary">
            
            {user?.picture_url ?
            <img
              src={user.picture_url}
              alt=""
              className="w-6 h-6 rounded-full object-cover" /> :

            <UserCircle className="w-6 h-6" />
            }
            <span className="hidden sm:inline truncate max-w-[10rem]">
              {user?.full_name || user?.email || 'Account'}
            </span>
            <ChevronDown
              className={`w-4 h-4 hidden sm:inline transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            
          </button>

          {menuOpen &&
          <div
            role="menu"
            className="absolute right-0 mt-2 w-60 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-30">
            
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                {user?.picture_url ?
              <img
                src={user.picture_url}
                alt=""
                className="w-10 h-10 rounded-full object-cover flex-shrink-0" /> :

              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UserCircle className="w-6 h-6 text-primary" />
                  </div>
              }
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {user?.full_name || 'Signed in'}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="py-1">
                {menuItems.map((item) =>
              <button
                key={item.label}
                role="menuitem"
                onClick={() => {
                  item.onClick();
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-secondary ${item.danger ? 'text-destructive' : 'text-foreground'}`}>
                
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </button>
              )}
              </div>
            </div>
          }
        </div>
      </div>
    </header>);

};