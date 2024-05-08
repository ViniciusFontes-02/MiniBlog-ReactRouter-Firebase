import { useContext, createContext } from "react";

const AuthContext = createContext();

// exportar o provedor de contexto
export function AuthProvider({ children, value }) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// retorna o contexto ja sendo utilizado
export function useAuthValue() {
  return useContext(AuthContext);
}
