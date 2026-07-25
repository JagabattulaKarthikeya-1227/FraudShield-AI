import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleDarkMode: () => set((state) => {
        const next = !state.isDarkMode;
        if (next) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: next };
      }),
      setDarkMode: (isDark) => set(() => {
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: isDark };
      }),
    }),
    {
      name: 'fraudshield-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.isDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      }
    }
  )
);
