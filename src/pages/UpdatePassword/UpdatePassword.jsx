import React, { useContext, useEffect, useState } from "react";
import "./updatePassword.css";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import CustomerPopup from "../../components/Customer/CustomerPopup/CustomerPopup";

const UpdatePassword = ({ setCartProducts }) => {
  const { BACKEND_URL, config, setCurrentUser, setRole } =
    useContext(AuthContext);
  const toast = useToast();
  const history = useHistory();
  const [openPopup, setOpenPopup] = useState(false);

  const [credentials, setCredentials] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleLogout = () => {
    setCurrentUser(null);
    setRole("CUSTOMER");
    setCartProducts([]);
  };
  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.id]: e.target.value.trim(),
    }));
  };

  const handleSubmit = async () => {
    if (credentials.newPassword !== credentials.confirmPassword) {
      return toast({
        title: "Password do not match!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      await axios.put(
        `${BACKEND_URL}/api/auth/change-password`,
        {
          oldPassword: credentials.oldPassword,
          newPassword: credentials.newPassword,
        },
        config
      );
      toast({
        title: "Update password successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      history.push("/");
      handleLogout();
    } catch (error) {
      if (
        error.response.data.message ===
        "Your account is locked! Please contact admin to unlock your account!"
      ) {
        setOpenPopup(true);
        return;
      }
      return toast({
        title: "Wrong password!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    document.title = "Change Password | BazaarBay";
  }, []);
  return (
    <div className="updatePassword">
      <div className="updatePasswordContainer">
        <div className="updatePasswordTitle">Change password</div>
        <div className="updatePasswordBody">
          <ul>
            <li>
              <span>Current Password </span>
              <input
                type="password"
                id="oldPassword"
                onChange={handleChange}
                value={credentials.oldPassword}
              />
            </li>
            <li>
              <span>New Password </span>
              <input
                type="password"
                id="newPassword"
                onChange={handleChange}
                value={credentials.newPassword}
              />
            </li>
            <li>
              <span>Confirm Password </span>
              <input
                type="password"
                id="confirmPassword"
                onChange={handleChange}
                value={credentials.confirmPassword}
              />
            </li>
          </ul>
          <button className="button" onClick={handleSubmit}>
            Save change
          </button>
        </div>
      </div>
      <CustomerPopup
        open={openPopup}
        setOpen={setOpenPopup}
        popupType="account-locked"
      />
    </div>
  );
};

export default UpdatePassword;
