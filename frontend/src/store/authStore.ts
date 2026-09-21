import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  /**
   * True while the app is performing the initial /me validation on startup.
   * ProtectedRoute should show a loader (not redirect) during this window.
   */
  isInitializing: boolean;
  // Tokens live in memory only — excluded from localStorage persistence
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  /**
   * Called once at app startup. Validates the persisted session by calling
   * /me with the in-memory access token. If the call fails (e.g., no token
   * in memory after a reload, or the token is expired/revoked), auth state
   * is cleared so protected routes correctly redirect to login.
   */
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isInitializing: true,
      accessToken: null,
      refreshToken: null,
      setUser: (user) => set({ user, isAuthenticated: true }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      logout: () =>
        set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null, isInitializing: false }),
      initializeAuth: async () => {
        const { accessToken, isAuthenticated } = get();

        // If there's no access token in memory (e.g., after a page reload where
        // tokens were not persisted), clear any stale persisted auth state.
        if (!accessToken) {
          if (isAuthenticated) {
            // Persisted state says "authenticated" but no token — stale state.
            set({ user: null, isAuthenticated: false, isInitializing: false });
          } else {
            set({ isInitializing: false });
          }
          return;
        }

        // There is a token in memory — verify it is still valid against the server.
        try {
          const { apiClient } = await import('@/core/api/client');
          const res = await apiClient.get('/auth/me');
          const serverUser: User = res.data?.data?.user;
          if (serverUser) {
            set({ user: serverUser, isAuthenticated: true, isInitializing: false });
          } else {
            set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null, isInitializing: false });
          }
        } catch {
          // /me failed — token is expired, revoked, or server is unreachable.
          // Clear auth state so the user is treated as logged out.
          set({ user: null, isAuthenticated: false, accessToken: null, refreshToken: null, isInitializing: false });
        }
      },
    }),
    {
      name: 'fraudshield-auth',
      // Only persist user identity — tokens stay in memory to limit XSS exposure.
      // isInitializing is never persisted; it always starts as true and resolves
      // during the startup check.
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);

