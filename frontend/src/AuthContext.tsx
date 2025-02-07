import React, { useContext, useMemo, useState } from "react";

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  email: string | null;
  setToken: (token: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setEmail: (email: string | null) => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = React.createContext<AuthState>({} as AuthState);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("email")
  );

  const value = useMemo(
    () => ({
      token,
      isAuthenticated,
      email,
      setToken: (tk: string | null) => {
        localStorage.setItem("token", tk ?? "");
        setToken(tk);
      },
      setIsAuthenticated: (isAuth: boolean) => {
        localStorage.setItem("isAuthenticated", String(isAuth));
        setIsAuthenticated(isAuth);
      },
      setEmail: (email: string | null) => {
        localStorage.setItem("email", email ?? "");
        setEmail(email);
      },
    }),
    [token, isAuthenticated, email]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
