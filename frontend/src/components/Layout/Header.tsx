import React from 'react';
import { Menu, UserCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
interface HeaderProps {
  toggleSidebar: () => void;
}
export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="h-16 bg-card border-b border-border border-b-2 border-b-gold/60 flex items-center justify-between px-4 lg:px-8 z-10">
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
        <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <UserCircle className="w-6 h-6" />
          <span className="hidden sm:inline">Student Portal</span>
        </button>
      </div>
    </header>);

};