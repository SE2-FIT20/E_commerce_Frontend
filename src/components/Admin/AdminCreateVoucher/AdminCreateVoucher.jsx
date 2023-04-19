import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import "./adminCreateVoucher.css";
import { useHistory } from "react-router-dom";
import { StoreContext } from "../../../context/StoreContext";
import BazaarBayIcon from "../../../images/bazaarbay-icon.ico";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { useEffect } from "react";
import {
  formatDaysLeft,
  revertTimeStamp,
  formatDaysToStart,
} from "../../longFunctions";

const AdminCreateVoucher = () => {
  const { BACKEND_URL, config } = useContext(AuthContext);
  const { setOption } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [voucher, setVoucher] = useState({
    percent: "",
    quantity: 1,
    description: "",
    startAt: "",
    expiredAt: "",
  });
  const now = new Date();
  const [voucherPercent, setVoucherPercent] = useState(
    `Discount ${voucher.percent}%`
  );
  const [voucherDescription, setVoucherDescription] = useState(
    `${voucher.description}`
  );
  const [voucherQuantity, setVoucherQuantity] = useState(
    `${voucher.quantity} remaining`
  );

  const [voucherStartAt, setVoucherStartAt] = useState(now);

  const [voucherStart, setVoucherStart] = useState(
    formatDaysToStart(voucher.startAt)
  );

  const [voucherExpired, setVoucherExpired] = useState(
    formatDaysLeft(voucher.expiredAt)
  );
  const toast = useToast();
  const history = useHistory();

  const handleChange = (e) => {
    if (e.target.id === "startAt") {
      setVoucherStartAt(e.target.value);
    }
    setVoucher((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleRegisterDelivery = async () => {
    if (
      !voucher.percent ||
      !voucher.quantity ||
      !voucher.description ||
      !voucher.expiredAt
    ) {
      return toast({
        title: "Please fill all the required fields!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else if (voucher.expiredAt < voucher.startAt) {
      return toast({
        title: "Invalid Start Date and Expired Date",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else {
      try {
        setLoading(true);
        await axios.post(
          `${BACKEND_URL}/api/admin/create-voucher-set`,
          {
            precent: parseInt(voucher.percent),
            quantity: parseInt(voucher.quantity),
            description: voucher.description,
            startAt: voucher.startAt,
            expiredAt: voucher.expiredAt,
          },
          config
        );
        toast({
          title: "Create voucher set successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        setOption("all");
        history.push(`/admin/vouchers/all`);
      } catch (error) {
        toast({
          title: "An error occurred while creating voucher set!",
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
    setVoucherPercent(`Discount ${voucher.percent}%`);
    setVoucherDescription(`${voucher.description}`);
    setVoucherQuantity(`${voucher.quantity} remaining`);
    setVoucherStart(formatDaysToStart(voucher.startAt));
    setVoucherExpired(formatDaysLeft(voucher.expiredAt));
  }, [voucher]);

  return (
    <div className="adminCreateVoucher">
      <div className="adminCreateVoucherContainer">
        <div className="adminCreateVoucherTitle">Create New Voucher</div>
        <div className="adminCreateVoucherBody">
          <div className="adminCreateVoucherLeft">
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
                        value={voucher.percent}
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
                        value={voucher.quantity}
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
                        value={voucher.description}
                        id="description"
                        onChange={handleChange}
                      />
                      <span className="inputCharacter">{`${voucher.description.length}/100`}</span>
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
                        value={voucher.startAt}
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
                        value={voucher.expiredAt}
                        id="expiredAt"
                        onChange={handleChange}
                        style={{ width: "100%" }}
                      />
                    </div>
                  </td>
                </tr>
                <tr style={{ paddingTop: "5px" }}>
                  <td className="updateHeading">Voucher Category</td>
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
                        "Create Voucher"
                      )}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="adminCreateVoucherRight">
            <div className="voucher">
              <div className="voucherLeft">
                <div className="voucherImage">
                  <img src={BazaarBayIcon} alt="" />
                  <span>BazaarBay</span>
                </div>
                <div className="voucherInfo">
                  <div className="voucherBasicInfo">
                    <h2 className="voucherPercent">{voucherPercent}</h2>
                    <span className="voucherDescription">
                      {`${voucherDescription.substring(0, 60)}${
                        voucherDescription.length > 60 ? "..." : ""
                      }`}
                    </span>
                  </div>
                  {revertTimeStamp(voucherStartAt) >=
                    revertTimeStamp(new Date()) && (
                    <span className="voucherExpired">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{voucherStart}</span>
                    </span>
                  )}
                  {revertTimeStamp(voucherStartAt) <
                    revertTimeStamp(new Date()) && (
                    <span className="voucherExpired">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{voucherExpired}</span>
                    </span>
                  )}
                </div>
              </div>
              <div className="voucherRight">
                <span>{voucherQuantity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateVoucher;
