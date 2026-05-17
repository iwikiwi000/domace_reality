import { jwtDecode } from "jwt-decode";
import type { ReactNode } from "react";
import { createContext, useState } from "react";
import { authService } from "../services/authService";
import { UserRole } from "../types/user-role.enum";

type User = {
  userId: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  isAdmin: boolean;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (...roles: UserRole[]) => boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

function getUserFromToken(): User | null {
  const token = authService.getToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<{ userId: string; email: string; role?: string }>(
      token
    );
    const role = (decoded.role as UserRole) || UserRole.USER;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role,
      isAdmin: role === UserRole.ADMIN,
    };
  } catch (error) {
    console.error("Invalid token:", error);
    authService.removeToken();
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getUserFromToken);

  const login = (token: string, userData: User) => {
    authService.saveToken(token);
    setUser(userData);
  };

  const logout = () => {
    authService.removeToken();
    setUser(null);
  };

  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const hasAnyRole = (...roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    userRole: user?.role ?? null,
    isAdmin: user?.isAdmin ?? false,
    hasRole,
    hasAnyRole,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
