// Hook (use-auth.js)

import React, { useState, useContext, createContext } from "react";

type AuthProviderProps = {
  children: React.ReactNode;
};

type User = { name: string };

type AuthValue = {
  user: User;
  isAuthenticated: boolean;
  signin: (name: string) => void;
  signout: () => void;
};
const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;
  //todo: use useLocalStorage
  const [user, setUser] = useState<User | undefined>({ name: "" });
  const isAuthenticated = Boolean(user?.name);
  // empty string will be falsy, keeping this simple and replaceable
  const signin = (name: string) => {
    setUser({ name: name });
  };
  const signout = () => {
    setUser({ name: "" });
  };

  const auth = {
    user: user,
    isAuthenticated,
    signin,
    signout,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
}
