import React from "react";
import "./updatePassword.css";

const UpdatePassword = () => {
  return (
    <div className="updatePassword">
      <div className="updatePasswordContainer">
        <div className="updatePasswordTitle">Change password</div>
        <div className="updatePasswordBody">
          <ul>
            <li>
              <span>Current Password </span>
              <input type="password" />
            </li>
            <li>
              <span>New Password </span>
              <input type="password" />
            </li>
            <li>
              <span>Confirm Password </span>
              <input type="password" />
            </li>
          </ul>
          <button className="button">Save change</button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
