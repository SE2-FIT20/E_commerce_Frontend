import { useContext, useState } from "react";
import "./updateProfile.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import {
  handleUpdateProfile,
  handleChange,
  handleChooseImage,
} from "./updateProfileLogic.js";

const UpdateProfile = () => {
  const { currentUser, setCurrentUser, BACKEND_URL, config } =
    useContext(AuthContext);
  const [newAvatar, setNewAvatar] = useState(null);

  const [userInfo, setUserInfo] = useState({
    name: currentUser.name || "",
    email: currentUser.email || "",
    phoneNumber: currentUser.phoneNumber || "",
    avatar: newAvatar || null,
  });
  const toast = useToast();
  const nothingChanged =
    currentUser.name === userInfo.name &&
    currentUser.phone === userInfo.phone &&
    currentUser.address === userInfo.address &&
    currentUser.image === userInfo.image &&
    currentUser.email === userInfo.email &&
    userInfo.avatar === (newAvatar ? newAvatar : currentUser.avatar);

  return (
    <div className="updateProfile">
      <div className="updateProfileContainer">
        <div className="updateProfileTitle">My Profile</div>
        <div className="updateProfileBody">
          <div className="updateProfileLeft">
            <table>
              <tbody>
                <tr style={{ paddingBottom: "10px" }}>
                  <td className="updateHeading">Email</td>
                  <td>{userInfo.email}</td>
                </tr>
                <tr>
                  <td className="updateHeading">Name</td>
                  <td>
                    <input
                      type="text"
                      value={userInfo.name}
                      placeholder="Your full name"
                      id="name"
                      onChange={(e) => handleChange(e, setUserInfo)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading">Phone</td>
                  <td>
                    <input
                      type="text"
                      id="phoneNumber"
                      value={userInfo.phoneNumber}
                      placeholder="Your phone number"
                      onChange={(e) => handleChange(e, setUserInfo)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading"></td>
                  <td>
                    <button
                      className="saveBtn"
                      onClick={(e) =>
                        handleUpdateProfile(
                          e,
                          userInfo,
                          newAvatar,
                          setCurrentUser,
                          BACKEND_URL,
                          config,
                          toast
                        )
                      }
                    >
                      Save Change
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="updateProfileRight">
            <img
              src={
                !newAvatar ? currentUser.avatar : URL.createObjectURL(newAvatar)
              }
              alt=""
            />
            <label htmlFor="file">
              <div className="choosePictureBtn">Choose Picture</div>
              <input
                type="file"
                style={{ display: "none" }}
                id="file"
                accept=".png,.jpeg,.jpg,.gif"
                onChange={(e) => handleChooseImage(e, setNewAvatar)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
