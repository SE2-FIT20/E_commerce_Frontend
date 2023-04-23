import { useContext, useEffect, useState } from "react";
import "./updateProfile.css";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Footer from "../../components/Customer/Footer/Footer";

import { useToast } from "@chakra-ui/react";
import {
  handleUpdateProfile,
  handleChange,
  handleChooseImage,
  handleUpdateStore,
  handleUpdateDelivery
} from "./updateProfileLogic.js";

const UpdateProfile = () => {
  const { currentUser, setCurrentUser, BACKEND_URL, config, role } =
    useContext(AuthContext);
  const [newAvatar, setNewAvatar] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: currentUser.name || "",
    phoneNumber: currentUser.phoneNumber || "",
    avatar: newAvatar || null,
    email: currentUser.email,
  });
  const [storeInfo, setStoreInfo] = useState({
    name: currentUser.name,
    phoneNumber: currentUser.phoneNumber || "",
    avatar: newAvatar || null,
    address: currentUser.address || "",
    city: currentUser.city || "",
    description: currentUser.description || "",
  });
  const [deliveryInfo, setDeliveryInfo] = useState({
    shippingFee: currentUser.shippingFee || "",
    description: currentUser.description || "",
    avatar : newAvatar || null
  })
  const toast = useToast();
  const nothingChanged =
    currentUser.name === userInfo.name &&
    currentUser.phone === userInfo.phone &&
    currentUser.address === userInfo.address &&
    currentUser.image === userInfo.image &&
    currentUser.email === userInfo.email &&
    userInfo.avatar === (newAvatar ? newAvatar : currentUser.avatar);

  useEffect(() => {
    document.title = "My Profile | BazaarBay";
  }, []);
  return (
    <div className="updateProfile">
      {role === "CUSTOMER" && (
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
                  !newAvatar
                    ? currentUser.avatar
                    : URL.createObjectURL(newAvatar)
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
      )}
      {role === "STORE" && (
        <div className="updateProfileContainer">
          <div className="updateProfileTitle">My Store</div>
          <div className="updateProfileBody">
            <div className="updateProfileLeft">
              <table>
                <tbody>
                  <tr style={{ paddingBottom: "10px" }}>
                    <td className="updateHeading">Email</td>
                    <td>{currentUser.email}</td>
                  </tr>
                  <tr>
                    <td className="updateHeading">Name</td>
                    <td>
                      <input
                        type="text"
                        value={storeInfo.name}
                        placeholder="Your full name"
                        id="name"
                        onChange={(e) => handleChange(e, setStoreInfo)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="updateHeading">Phone</td>
                    <td>
                      <input
                        type="text"
                        id="phoneNumber"
                        value={storeInfo.phoneNumber}
                        placeholder="Your phone number"
                        onChange={(e) => handleChange(e, setStoreInfo)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="updateHeading">Address</td>
                    <td>
                      <input
                        type="text"
                        id="address"
                        value={storeInfo.address}
                        placeholder="Your store address"
                        onChange={(e) => handleChange(e, setStoreInfo)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="updateHeading">City</td>
                    <td>
                      <input
                        type="text"
                        id="city"
                        value={storeInfo.city}
                        placeholder="Your store city"
                        onChange={(e) => handleChange(e, setStoreInfo)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="updateHeading"
                      style={{ alignItems: "flex-start" }}
                    >
                      Description
                    </td>
                    <td>
                      <textarea
                        type="text"
                        wrap="soft"
                        id="description"
                        value={storeInfo.description}
                        placeholder="Your store description..."
                        onChange={(e) => handleChange(e, setStoreInfo)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="updateHeading"></td>
                    <td>
                      <button
                        className="saveBtn"
                        onClick={(e) =>
                          handleUpdateStore(
                            e,
                            storeInfo,
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
                  !newAvatar
                    ? currentUser.avatar
                    : URL.createObjectURL(newAvatar)
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
      )}
      {role === "DELIVERY_PARTNER" && (
        <div className="updateProfileContainer">
          <div className="updateProfileTitle">My Store</div>
          <div className="updateProfileBody">
            <div className="updateProfileLeft">
              <table>
                <tbody>
                  <tr style={{ paddingBottom: "10px" }}>
                    <td className="updateHeading">Email</td>
                    <td>{currentUser.email}</td>
                  </tr>
                  <tr>
                    <td className="updateHeading">Name</td>
                    <td>{currentUser.name}</td>
                  </tr>
                  <tr>
                    <td className="updateHeading">Shipping Fee</td>
                    <td>
                      <input
                        type="number"
                        id="shippingFee"
                        value={deliveryInfo.shippingFee}
                        placeholder="Your shipping fee"
                        onChange={(e) => handleChange(e, setDeliveryInfo)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      className="updateHeading"
                      style={{ alignItems: "flex-start" }}
                    >
                      Description
                    </td>
                    <td>
                      <textarea
                        type="text"
                        wrap="soft"
                        id="description"
                        value={deliveryInfo.description}
                        placeholder="Your description..."
                        onChange={(e) => handleChange(e, setDeliveryInfo)}
                      />
                    </td>
                  </tr>
                  <tr>
                    <td className="updateHeading"></td>
                    <td>
                      <button
                        className="saveBtn"
                        onClick={(e) =>
                          handleUpdateDelivery(
                            e,
                            deliveryInfo,
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
                  !newAvatar
                    ? currentUser.avatar
                    : URL.createObjectURL(newAvatar)
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
      )}
      <Footer />
    </div>
  );
};

export default UpdateProfile;
