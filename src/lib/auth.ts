// Authentication utilities
// Menggunakan localStorage untuk menyimpan session

const AUTH_KEY = 'admin_auth_session';

export interface AuthSession {
  isAuthenticated: boolean;
  email: string;
  loginTime: string;
}

export const auth = {
  // Set session setelah login berhasil
  setSession: (email: string) => {
    const session: AuthSession = {
      isAuthenticated: true,
      email,
      loginTime: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    }
  },

  // Get current session
  getSession: (): AuthSession | null => {
    if (typeof window === 'undefined') return null;
    const sessionStr = localStorage.getItem(AUTH_KEY);
    if (!sessionStr) return null;
    try {
      return JSON.parse(sessionStr);
    } catch {
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    const session = auth.getSession();
    return session?.isAuthenticated === true;
  },

  // Clear session (logout)
  clearSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_KEY);
    }
  },
};

