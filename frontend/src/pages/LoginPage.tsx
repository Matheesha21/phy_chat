import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Moon, Sun } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LoginPage: React.FC = () => {
  const { isAuthenticated, loginWithGoogle } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      const redirectTo = (location.state as {
        from?: string;
      } | null)?.from || '/';
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      toast.error('Google did not return a credential. Please try again.');
      return;
    }
    try {
      await loginWithGoogle(credentialResponse.credential);
      toast.success('Signed in successfully.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-in failed. Please try again.';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
      <button
        onClick={toggleTheme}
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        className="absolute top-4 right-4 p-2 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">

        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">
        <img
          src="/images.png"
          alt="University of Sri Jayewardenepura crest"
          className="w-16 h-16 object-contain" />


        <div className="text-center">
          <h1 className="text-xl font-bold text-foreground">
            USJ Physics Department
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in with your university Google account to continue
          </p>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => toast.error('Google sign-in failed. Please try again.')}
            theme={theme === 'dark' ? 'filled_black' : 'outline'}
            shape="pill"
            size="large" />

        </div>

        <p className="text-xs text-muted-foreground text-center">
          Designed by <span className="font-bold">Elvion Labs</span>
        </p>

        <p className="text-xs text-muted-foreground text-center">
          Access is limited to authorized university accounts.
        </p>
      </div>
    </div>);

};
