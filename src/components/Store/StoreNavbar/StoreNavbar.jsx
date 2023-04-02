import React, { useContext, useState } from "react";
import "./storeNavbar.css";
import logo from "../../../images/image-removebg-preview.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../context/AuthContext";
import { useHistory } from "react-router-dom";

const StoreNavbar = () => {
  const { currentUser, setRole, setCurrentUser } = useContext(AuthContext);
  const [openSetting, setOpenSetting] = useState(false);
  const history = useHistory();
  return (
    <div className="storeNavbar">
      <div className="storeNavbarContainer">
        <div className="storeNavbarLeft">
          <img src={logo} alt="" onClick={() => history.push(`/store/product/all?pages=1`)}/>
        </div>
        <div className="storeNavbarRight">
          <div className="storeInfo">
            <div className="storeImg">
              <img
                src={currentUser.avatar}
                alt=""
                onMouseOver={() => setOpenSetting(true)}
                onMouseLeave={() => setOpenSetting(false)}
              />
              <ul
                className={openSetting ? "userOptions" : "userOptions"}
                onMouseOver={() => setOpenSetting(true)}
                onMouseLeave={() => setOpenSetting(false)}
              >
                <li
                  className="option"
                  onClick={() => history.push("/account/profile")}
                >
                  My Store
                </li>
                <li
                  className="option"
                  onClick={() => history.push("/account/password")}
                >
                  Change Password
                </li>
                <li
                  className="option"
                  onClick={() => {
                    setCurrentUser(null);
                    setRole("CUSTOMER");
                  }}
                >
                  Log out
                </li>
              </ul>
            </div>

            <span>{currentUser.name}</span>
          </div>
          <div className="notification">
            <FontAwesomeIcon icon={faBell} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreNavbar;
