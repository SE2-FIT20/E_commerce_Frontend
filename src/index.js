import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { ChakraProvider } from "@chakra-ui/react";
import { StoreContextProvider } from "./context/StoreContext";
import { CustomerContextProvider } from "./context/CustomerContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <CustomerContextProvider>
          <StoreContextProvider>
            <ChakraProvider>
              <App />
            </ChakraProvider>
          </StoreContextProvider>
        </CustomerContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// cach su dung react-router-dom
// file index.js:
