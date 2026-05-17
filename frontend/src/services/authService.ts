import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_token";

type JwtPayload = {
  sub: string;
  email: string;
  role: string;
  exp: number;
};

export const authService = {
  saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // authService.ts
  // authService.ts
  isTokenValid: (): boolean => {
    const token = localStorage.getItem("auth_token"); // Zmenené z "token" na "auth_token"
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp;
      if (exp && Date.now() >= exp * 1000) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  },

  getRole(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token).role ?? null;
    } catch {
      return null;
    }
  },

  getUserId(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    try {
      return jwtDecode<JwtPayload>(token).sub ?? null;
    } catch {
      return null;
    }
  },
};
