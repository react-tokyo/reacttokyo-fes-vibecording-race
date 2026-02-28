import { createContext, useContext, useEffect, useState } from 'react';
import { api, CURRENT_USER_ID } from '../api/client';
import type { User } from '../types';

interface AppContextValue {
  currentUserId: string;
  currentUser: User | null;
}

const AppContext = createContext<AppContextValue>({
  currentUserId: CURRENT_USER_ID,
  currentUser: null,
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    api.getMe().then(setCurrentUser).catch(console.error);
  }, []);

  return (
    <AppContext.Provider value={{ currentUserId: CURRENT_USER_ID, currentUser }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
