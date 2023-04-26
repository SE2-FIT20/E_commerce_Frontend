import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("currentUser")) || null
  );
  const [role, setRole] = useState(
    JSON.parse(localStorage.getItem("role")) || "CUSTOMER"
  );
  const [token, setToken] = useState(
    JSON.parse(localStorage.getItem("token")) || ""
  );
  const BACKEND_URL = "https://e-commerce-production-2185.up.railway.app";
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const history = useHistory();

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(token));
  }, [token]);

  useEffect(() => {
    localStorage.setItem("role", JSON.stringify(role));
  }, [role]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        role,
        setRole,
        token,
        config,
        setToken,
        BACKEND_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
