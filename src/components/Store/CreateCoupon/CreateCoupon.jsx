import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import "./createCoupon.css";
import { useHistory } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
import BazaarBayIcon from "../../../images/bazaarbay-icon.ico";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { useEffect } from "react";
import { formatDaysLeft, revertTimeStamp, formatDaysToStart } from "../../longFunctions";

const CreateCoupon = () => {
  const { BACKEND_URL, config, currentUser } = useContext(AuthContext);
  const { setOption } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState({
    percent: "",
    quantity: 1,
    description: "",
    startAt: "",
    expiredAt: "",
  });
  const now = new Date();
  const [couponPercent, setCouponPercent] = useState(
    `Discount ${coupon.percent}%`
  );
  const [couponDescription, setCouponDescription] = useState(
    `${coupon.description}`
  );
  const [couponQuantity, setCouponQuantity] = useState(
    `${coupon.quantity} remaining`
  );

  const [couponStartAt, setCouponStartAt] = useState(now)

  const [couponStart, setCouponStart] = useState(
    formatDaysToStart(coupon.startAt)
  );

  const [couponExpired, setCouponExpired] = useState(
    formatDaysLeft(coupon.expiredAt)
  );
  const toast = useToast();
  const history = useHistory();

  const handleChange = (e) => {
    if (e.target.id === "startAt") {
      setCouponStartAt(e.target.value)
    }
    setCoupon((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleRegisterDelivery = async () => {
    if (
      !coupon.percent ||
      !coupon.quantity ||
      !coupon.description ||
      !coupon.expiredAt
    ) {
      return toast({
        title: "Please fill all the required fields!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      try {
        setLoading(true);
        await axios.post(`${BACKEND_URL}/api/store/create-coupon-set`, {
          precent: parseInt(coupon.percent),
          quantity: parseInt(coupon.quantity),
          description: coupon.description,
          startAt: coupon.startAt,
          expiredAt: coupon.expiredAt
        }, config)
        toast({
          title: "Create coupon set successful!",
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
          title: "An error occurred while creating coupon set!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);  
      }
    }
  };

  useEffect(() => {
    setCouponPercent(`Discount ${coupon.percent}%`);
    setCouponDescription(`${coupon.description}`);
    setCouponQuantity(`${coupon.quantity} remaining`);
    setCouponStart(formatDaysToStart(coupon.startAt));
    setCouponExpired(formatDaysLeft(coupon.expiredAt));
  }, [coupon]);

  return (
    <div className="storeCreateCoupon">
      <div className="storeCreateCouponContainer">
        <div className="storeCreateCouponTitle">Create Coupon</div>
        <div className="storeCreateCouponBody">
          <div className="storeCreateCouponLeft">
            <table>
              <tbody>
                <tr>
                  <td className="updateHeading">Discount</td>
                  <td>
                    <div
                      className="inputField"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="number"
                        placeholder="Discount Percentage"
                        maxLength="30"
                        value={coupon.percent}
                        id="percent"
                        onChange={handleChange}
                      />
                      <span className="inputCharacter">%</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading">Quantity</td>
                  <td>
                    <div
                      className="inputField"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="number"
                        placeholder="Quantity"
                        value={coupon.quantity}
                        id="quantity"
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
                        value={coupon.description}
                        id="description"
                        onChange={handleChange}
                      />
                      <span className="inputCharacter">{`${coupon.description.length}/100`}</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading">Start At</td>
                  <td>
                    <div
                      className="inputField"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="datetime-local"
                        placeholder="Expired Date"
                        value={coupon.startAt}
                        id="startAt"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading">Expired At</td>
                  <td>
                    <div
                      className="inputField"
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <input
                        type="datetime-local"
                        placeholder="Expired Date"
                        value={coupon.expiredAt}
                        id="expiredAt"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </td>
                </tr>
                <tr style={{ paddingTop: "5px" }}>
                  <td className="updateHeading">Coupon Category</td>
                  <td>
                    <div
                      style={{
                        justifyContent: "space-between",
                      }}
                    >
                      <span>All Categories</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="updateHeading"></td>
                  <td>
                    <button
                      className="saveBtn"
                      onClick={handleRegisterDelivery}
                      style={{ width: !loading && "150px" }}
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
                        "Update Coupon"
                      )}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="storeCreateCouponRight">
            <div className="voucher">
              <div className="voucherLeft">
                <div className="voucherImage">
                  <img src={currentUser.avatar} alt="" />
                  <span>{currentUser.name}</span>
                </div>
                <div className="voucherInfo">
                  <div className="voucherBasicInfo">
                    <h2 className="voucherPercent">{couponPercent}</h2>
                    <span className="voucherDescription">
                      {`${couponDescription.substring(0, 60)}${
                        couponDescription.length > 60 ? "..." : ""
                      }`}
                    </span>
                  </div>
                  {revertTimeStamp(couponStartAt) >= revertTimeStamp(new Date()) && (
                    <span className="voucherExpired">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{couponStart}</span>
                    </span>
                  )}
                  {revertTimeStamp(couponStartAt) < revertTimeStamp(new Date()) && (
                    <span className="voucherExpired">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{couponExpired}</span>
                    </span>
                  )}
                  
                </div>
              </div>
              <div className="voucherRight">
                <span>{couponQuantity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;
