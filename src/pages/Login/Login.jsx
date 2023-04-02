import React, { useContext, useState } from "react";
import "./login.css";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import BreadCrumb from "../../components/Customer/BreadCrumb/BreadCrumb";
import Container from "../../components/Customer/Container/Container";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false)
  const { setCurrentUser, setToken, setRole } = useContext(AuthContext);
  const toast = useToast();
  const history = useHistory();
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value.trim() }));
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post(
        "https://e-commerce-production-43d5.up.railway.app/api/auth/login",
        { email: credentials.email, password: credentials.password },
        config
      );
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      const token = response.data.data.token;
      setToken(token);
      if (response.data.data.role === "CUSTOMER") {
        const { data } = await axios.get(
          `https://e-commerce-production-43d5.up.railway.app/api/customer/account`,
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrentUser(data.data);
        setRole("CUSTOMER")
        history.push("/");
      } else if (response.data.data.role === "STORE") {
        const { data } = await axios.get(
          `https://e-commerce-production-43d5.up.railway.app/api/store/account`,
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrentUser(data.data);
        setRole("STORE")
        history.push("/store/product/all?pages=1");
      }
    } catch (error) {
      setLoading(false);
      toast({
        title: "An error occurred while trying to login",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <div className="login">
      <BreadCrumb title="Login" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3
                className="text-center mb-3"
                style={{ fontSize: "27px", fontWeight: "500" }}
              >
                Login
              </h3>
              <form action="" className="d-flex flex-column gap-15">
                <input
                  type="text"
                  id="email"
                  placeholder="Email"
                  onChange={(e) => handleChange(e)}
                  className={`form-control`}
                />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  onChange={(e) => handleChange(e)}
                  className={`form-control`}
                />
                <div>
                  <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                    <button
                      className="button"
                      type="submit"
                      onClick={login}
                      style={{ padding: loading ? "10px 40px" : "13px 40px"}}
                    >
                       {loading ? (
                        <div className="loginLoading">
                          <div class="lds-ring">
                            <div></div>
                            <div></div>
                            <div></div>
                            <div></div>
                          </div>
                        </div>
                      ) : (
                        "Login"
                      )}
                    </button>
                    <Link to="/register" className="button signup">
                      Sign Up
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Login;
