import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react';
import { authService, AuthUser } from '../services/authService';
import { ApiError } from '../services/httpClient';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    authService.
    getCurrentUser().
    then((currentUser) => {
      if (!cancelled) setUser(currentUser);
    }).
    catch(() => {
      if (!cancelled) setUser(null);
    }).
    finally(() => {
      if (!cancelled) setIsLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const loginWithGoogle = async (idToken: string) => {
    const { user: signedInUser } = await authService.signInWithGoogle(idToken);
    setUser(signedInUser);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      if (!(err instanceof ApiError)) throw err;
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: user !== null,
        loginWithGoogle,
        logout
      }}>

      {children}
    </AuthContext.Provider>);

};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
