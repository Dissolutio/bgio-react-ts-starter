// Hook (use-auth.js)

import React, { useContext, createContext } from "react";
// import { useLocalStorage } from "./useLocalStorage";
import { useSessionStorage } from "./useSessionStorage";

const localStorageKey_bgioCredentials = "bgio-player-credentials";

type StoredCredentials = {
  playerName: string;
  matchID: string;
  gameName: string;
  playerCredentials: string;
  playerID: string;
};
const initialCredentials: StoredCredentials = {
  playerName: "",
  matchID: "",
  gameName: "",
  playerCredentials: "",
  playerID: "",
};

type AuthValue = {
  storedCredentials: StoredCredentials;
  isAuthenticated: boolean;
  signin: (name: string) => void;
  signout: () => void;
  updateCredentials: (newCredentials: StoredCredentials) => Promise<void>;
};
const AuthContext = createContext<AuthValue | undefined>(undefined);
type AuthProviderProps = {
  children: React.ReactNode;
};
export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  // const [storedCredentials, setStoredCredentials] = useLocalStorage(
  //   localStorageKey_bgioCredentials,
  //   initialCredentials
  // )
  const [storedCredentials, setStoredCredentials] = useSessionStorage(
    localStorageKey_bgioCredentials,
    initialCredentials
  );

  // keeping isAuthenticated simple and replaceable
  const isAuthenticated = Boolean(storedCredentials?.playerName);
  const signin = (newName: string) => {
    const newCredentials = {
      ...storedCredentials,
      playerName: newName,
    };
    setStoredCredentials(newCredentials);
  };
  const signout = async () => {
    setStoredCredentials(initialCredentials);
  };
  const updateCredentials = async (newCredentials: StoredCredentials) => {
    setStoredCredentials({
      ...storedCredentials,
      ...newCredentials,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        storedCredentials,
        isAuthenticated,
        updateCredentials,
        signin,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
