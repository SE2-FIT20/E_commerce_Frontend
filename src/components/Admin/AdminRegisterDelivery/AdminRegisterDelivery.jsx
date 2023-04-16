import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import "./adminRegisterDelivery.css";
import { useHistory } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";

const AdminRegisterDelivery = () => {
  const { BACKEND_URL, config } =
    useContext(AuthContext);
  const { setOption } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    description: "",
    shippingFee: 50000,
  });
  const toast = useToast();
  const history = useHistory();

  const handleChange = (e) => {
    setUserInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRegisterDelivery = async () => {
    if (
      !userInfo.name ||
      !userInfo.email ||
      !userInfo.password ||
      !userInfo.confirmPassword ||
      !userInfo.description ||
      userInfo.shippingFee <= 0
    ) {
      return toast({
        title: "Please fill all the required fields!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else if (userInfo.password !== userInfo.confirmPassword) {
      return toast({
        title: "Passwords do not match!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      try {
        setLoading(true);
        await axios.post(`${BACKEND_URL}/api/admin/app-setting/delivery-partners`, {
          email: userInfo.email,
          password: userInfo.password,
          name: userInfo.name,
          description: userInfo.description,
          shippingFee: userInfo.shippingFee
        }, config)
        toast({
          title: "Register delivery partner successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        setOption("all");
        history.push(`/admin/users/all?page=1`);
      } catch (error) {
        toast({
          title: "An error occurred while registering delivery partner!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    }
  };

  return (
    <div className="adminRegisterDelivery">
      <div className="adminRegisterDeliveryContainer">
        <div className="adminRegisterDeliveryTitle">
          Register New Delivery Partner
        </div>
        <div className="adminRegisterDeliveryBody">
          <div className="adminRegisterDeliveryLeft">
            <table>
              <tbody>
                <tr>
                  <td className="updateHeading">Name</td>
                  <td>
                    <div
                      className="inputField"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Name"
                        maxLength="30"
                        id="name"
                        onChange={handleChange}
                      />
                      <span className="inputCharacter">{`${userInfo.name.length}/30`}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading">Email</td>
                  <td>
                    <div
                      className="inputField"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Email"
                        maxLength="30"
                        id="email"
                        onChange={handleChange}
                      />
                      <span className="inputCharacter">{`${userInfo.email.length}/30`}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading">Password</td>
                  <td>
                    <div
                      className="inputField"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="password"
                        placeholder="Password"
                        maxLength="30"
                        id="password"
                        onChange={handleChange}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading">Confirm Password</td>
                  <td>
                    <div
                      className="inputField"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="password"
                        placeholder="Confirm Password"
                        maxLength="30"
                        id="confirmPassword"
                        onChange={handleChange}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading">Description</td>
                  <td>
                    <div
                      className="inputField"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Description"
                        maxLength="100"
                        id="description"
                        onChange={handleChange}
                      />
                      <span className="inputCharacter">{`${userInfo.description.length}/100`}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading">Shipping Fee</td>
                  <td>
                    <div
                      className="inputField"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="number"
                        placeholder="Shipping Fee"
                        id="shippingFee"
                        onChange={handleChange}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading"></td>
                  <td>
                    <button
                      className="saveBtn"
                      onClick={handleRegisterDelivery}
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
                        "Register"
                      )}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterDelivery;
