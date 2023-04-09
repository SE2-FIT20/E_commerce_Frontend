import React from 'react'
import logo from "../../../images/image-removebg-preview.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import "./adminNavbar.css"

const AdminNavbar = () => {
  const { currentUser, setRole, setCurrentUser } = useContext(AuthContext);
  const [openSetting, setOpenSetting] = useState(false);
  const history = useHistory();
  return (
    <div className="adminNavbar">
      <div className="adminNavbarContainer">
        <div className="adminNavbarLeft">
          <img src={logo} alt="" onClick={() => history.push(`/admin/product/all?pages=1`)}/>
        </div>
        <div className="adminNavbarRight">
          <div className="adminInfo">
            <div className="adminImg">
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
                  My admin
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

export default AdminNavbar