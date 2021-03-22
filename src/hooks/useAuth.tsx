// Hook (use-auth.js)

import React, { useState, useContext, createContext } from "react";

type User = { name: string };

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};

function useProvideAuth() {
  //todo: use useLocalStorage
  const [user, setUser] = useState<User | undefined>({ name: "" });
  // empty string will be falsy, keeping this simple and replaceable
  const authUser = user?.name ?? "";
  const signin = (name: string) => {
    setUser({ name: name });
  };
  const signout = () => {
    setUser({ name: "" });
  };

  return {
    user: authUser,
    signin,
    signout,
  };
}
