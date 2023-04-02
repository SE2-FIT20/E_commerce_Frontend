import React, { useState } from "react";
import "./register.css";
import BreadCrumb from "../../components/Customer/BreadCrumb/BreadCrumb";
import { Link, useHistory } from "react-router-dom";
import Container from "../../components/Customer/Container/Container";
import CustomerIcon from "../../images/customerIcon.png";
import StoreIcon from "../../images/storeIcon.jpg";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { handleRegister } from "../../components/longFunctions";

const Register = () => {
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

  const handleChooseRole = (e) => {
    e.preventDefault();
    setRole(e.currentTarget.id);
  };

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <>
      <BreadCrumb title="Register" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3" style={{ fontSize: "27px", fontWeight: "500"}}>Register</h3>
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
                        handleRegister(e, credentials, role, config, toast, history)
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
    </>
  );
};

export default Register;
