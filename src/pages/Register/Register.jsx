import React, { useContext, useEffect, useState } from "react";
import "./register.css";
import BreadCrumb from "../../components/Customer/BreadCrumb/BreadCrumb";
import { Link, useHistory } from "react-router-dom";
import Container from "../../components/Customer/Container/Container";
import CustomerIcon from "../../images/customerIcon.png";
import StoreIcon from "../../images/storeIcon.jpg";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "../../context/AuthContext";
import { handleRegister } from "../../components/longFunctions";

const Register = () => {
  const { BACKEND_URL, setCurrentUser, setToken } = useContext(AuthContext);
  const [role, setRole] = useState("CUSTOMER");
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const toast = useToast();
  const history = useHistory();
  const config = {
    headers: {
      "Content-type": "application/json",
    },
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      !credentials.name ||
      !credentials.email ||
      !credentials.password ||
      !credentials.confirmPassword
    ) {
      return toast({
        title: "Please enter all the fields!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
    if (credentials.password !== credentials.confirmPassword) {
      return toast({
        title: "Passwords do not match!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      await axios.post(
        `${BACKEND_URL}/api/auth/register`,
        {
          name: credentials.name,
          email: credentials.email,
          password: credentials.password,
          role: role,
        },
        config
      );
      toast({
        title: "Register successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      const response = await axios.post(
        `${BACKEND_URL}/api/auth/login`,
        { email: credentials.email, password: credentials.password },
        config
      );

      const token = response.data.data.token;
      setToken(token);
      if (response.data.data.role === "CUSTOMER") {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/customer/account`,
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCurrentUser(data.data);
        setRole("CUSTOMER");
        history.push("/");
      } else if (response.data.data.role === "STORE") {
        const { data } = await axios.get(`${BACKEND_URL}/api/store/account`, {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setCurrentUser(data.data);
        setRole("STORE");
        history.push("/store/product/all?pages=1");
      }
    } catch (error) {
      return toast({
        title: "An error occured while trying to register",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleChooseRole = (e) => {
    e.preventDefault();
    setRole(e.currentTarget.id);
  };

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  useEffect(() => {
    document.title = "Register | BazaarBay";
  });

  return (
    <div className="register">
      <BreadCrumb title="Register" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3
                className="text-center mb-3"
                style={{ fontSize: "27px", fontWeight: "500" }}
              >
                Register
              </h3>
              <form action="" className="d-flex flex-column gap-15">
                <input
                  type="text"
                  id="name"
                  placeholder="Name"
                  className="form-control"
                  onChange={handleChange}
                />
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="form-control"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className="form-control"
                  onChange={handleChange}
                />
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm Password"
                  className="form-control"
                  onChange={handleChange}
                />
                <div className="chooseRoleSection">
                  <div className="chooseRoleText">Choose your role</div>
                  <div className="chooseRoleImages">
                    <div
                      className="roleItem"
                      id="CUSTOMER"
                      onClick={(e) => handleChooseRole(e)}
                    >
                      <img
                        className={
                          role === "CUSTOMER"
                            ? "customerImg selected"
                            : "customerImg"
                        }
                        src={CustomerIcon}
                      ></img>
                      <div className="roleDesc">Customer</div>
                    </div>
                    <div
                      className="roleItem"
                      id="STORE"
                      onClick={(e) => handleChooseRole(e)}
                    >
                      <img
                        className={
                          role === "STORE" ? "storeImg selected" : "storeImg"
                        }
                        src={StoreIcon}
                      ></img>
                      <div className="roleDesc">Store</div>
                    </div>
                  </div>
                </div>
                <div>
                  <div className="mt-3 d-flex justify-content-center gap-15 align-items-center">
                    <button
                      className="button border-0"
                      onClick={(e) =>
                        handleRegister(
                          e,
                          credentials,
                          role,
                          config,
                          toast,
                          history
                        )
                      }
                    >
                      Register
                    </button>
                  </div>
                  <div className="loginText">
                    <span>
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        style={{
                          color: "#333",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        Login
                      </Link>
                    </span>
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

export default Register;
