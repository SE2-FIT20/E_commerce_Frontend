import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
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
  const [cartProducts, setCartProducts] = useState([]);
  const [error, setError] = useState(false);

  const BACKEND_URL = "https://e-commerce-production-2185.up.railway.app";
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const history = useHistory();
  const fetchPreviewCart = async () => {
    if (role === "CUSTOMER" && currentUser) {
      try {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/customer/preview-cart`,
          config
        );
        setCartProducts(data.data);
        setError(false);
      } catch (error) {
        // setError(true);
      }
    }
  };
  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("token", JSON.stringify(token));
  }, [token]);

  useEffect(() => {
    localStorage.setItem("role", JSON.stringify(role));
  }, [role]);

  useEffect(() => {
    if (role === "CUSTOMER") fetchPreviewCart();
  }, [history]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        role,
        setRole,
        token,
        config,
        cartProducts,
        setCartProducts,
        fetchPreviewCart,
        setToken,
        BACKEND_URL,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
