import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  designation: string;
  email: string;
  id: string;
  mPinSetup: boolean;
  name: string;
  phoneNo: string;
  profile: string;
  roles: string[];
  sessionId: string;
  userStatus: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const userStr = localStorage.getItem('user');
        const accessToken = localStorage.getItem('access_token');

        if (userStr && accessToken) {
          const user = JSON.parse(userStr);
          setState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  const login = useCallback(
    (userData: User, tokens: { access_token: string; refresh_token: string }) => {
      try {
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        localStorage.setItem('user', JSON.stringify(userData));

        setState({
          user: userData,
          isAuthenticated: true,
          isLoading: false,
        });
      } catch (error) {
        console.error('Error during login:', error);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');

      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });

      router.push('/login');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }, [router]);

  const getAccessToken = useCallback(() => {
    return localStorage.getItem('access_token');
  }, []);

  const getRefreshToken = useCallback(() => {
    return localStorage.getItem('refresh_token');
  }, []);

  const updateUser = useCallback((userData: Partial<User>) => {
    setState((prev) => {
      if (!prev.user) return prev;

      const updatedUser = { ...prev.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return {
        ...prev,
        user: updatedUser,
      };
    });
  }, []);

  return {
    ...state,
    login,
    logout,
    updateUser,
    getAccessToken,
    getRefreshToken,
  };
}
