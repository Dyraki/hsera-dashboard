import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Permission } from '../../core/domain/models/User';
import { jwtDecode } from 'jwt-decode';
import { hasPermissionAction } from '../../core/domain/permissions';
import { AxiosHttpClient } from '../../core/infrastructure/api/AxiosHttpClient';

interface AuthContextType {
  user: User | null;
  permissions: Permission[];
  login: (token: string) => void;
  logout: () => Promise<void>;
  hasPermission: (menuId: string, minLevel: number) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const applyUserToken = useCallback((token: string) => {
    localStorage.setItem('token', token);
    const decoded: any = jwtDecode(token);
    setUser({
      id: decoded.sub,
      username: decoded.username,
      jenis: decoded.jenis,
      idRelasi: decoded.idRelasi,
      karyawan: decoded.karyawan,
      scope: decoded.scope,
    });
    const perms = (decoded.permissions || []).map((p: any) => ({
      ...p,
      menuId: String(p.menuId),
    }));
    setPermissions(perms);
  }, []);

  const logout = useCallback(async () => {
    try {
      await AxiosHttpClient.post('/api/auth/logout', {});
    } catch {
      // Abaikan jika server offline saat logout
    } finally {
      localStorage.removeItem('token');
      setUser(null);
      setPermissions([]);
    }
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setPermissions([]);
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Coba perpanjang sesi secara otomatis via Refresh Token
            try {
              const res = await AxiosHttpClient.post<{ accessToken: string }>('/api/auth/refresh');
              applyUserToken(res.data.accessToken);
            } catch {
              await logout();
            }
          } else {
            applyUserToken(token);
          }
        } catch {
          await logout();
        }
      } else {
        // Coba periksa apakah ada session aktif dari HttpOnly cookie
        try {
          const res = await AxiosHttpClient.post<{ accessToken: string }>('/api/auth/refresh');
          applyUserToken(res.data.accessToken);
        } catch {
          // Tidak ada sesi aktif
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [applyUserToken, logout]);

  const login = (token: string) => {
    applyUserToken(token);
  };

  const hasPermission = (menuId: string, minLevel: number): boolean => {
    if (user?.jenis === 'SA' || user?.jenis === 'admin' || user?.username === 'admin') {
      return true;
    }
    const perm = permissions.find((p) => String(p.menuId) === String(menuId));
    if (!perm || !perm.enable) return false;
    return hasPermissionAction(perm.level, minLevel);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        permissions,
        login,
        logout,
        hasPermission,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
