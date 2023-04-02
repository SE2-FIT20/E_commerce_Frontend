import { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export const StoreContext = createContext();

export const StoreContextProvider = ({ children }) => {
  const [option, setOption] = useState(
    JSON.parse(localStorage.getItem("storeOption")) || null
  );
  useEffect(() => {
    localStorage.setItem("storeOption", JSON.stringify(option));
  }, [option]);
  const history = useHistory();

  return (
    <StoreContext.Provider
      value={{
        option,
        setOption,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};
