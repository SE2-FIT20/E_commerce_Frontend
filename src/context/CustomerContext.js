import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const CustomerContext = createContext();

export const CustomerContextProvider = ({ children }) => {
  const [totalPrice, setTotalPrice] = useState(0);
  // useEffect(() => {
  //   localStorage.setItem("totalPrice", JSON.stringify(totalPrice));
  // }, [option]);
  const history = useHistory();

  return (
    <CustomerContext.Provider
      value={{
        totalPrice, setTotalPrice
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
