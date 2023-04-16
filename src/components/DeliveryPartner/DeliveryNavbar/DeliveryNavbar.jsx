import React from 'react'
import logo from "../../../images/image-removebg-preview.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import "./deliveryNavbar.css"

const DeliveryNavbar = () => {
  const { currentUser, setRole, setCurrentUser } = useContext(AuthContext);
  const [openSetting, setOpenSetting] = useState(false);
  const history = useHistory();
  return (
    <div className="deliveryNavbar">
      <div className="deliveryNavbarContainer">
        <div className="deliveryNavbarLeft">
          <img src={logo} alt="" onClick={() => history.push(`/delivery/product/all?pages=1`)}/>
        </div>
        <div className="deliveryNavbarRight">
          <div className="deliveryInfo">
            <div className="deliveryImg">
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
                  My Profile
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
                    history.push("/")
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
}

export default DeliveryNavbar