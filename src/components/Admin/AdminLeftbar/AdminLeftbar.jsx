import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import "./adminLeftbar.css";
import { StoreContext } from "../../../context/StoreContext";
import { useHistory, useLocation } from "react-router-dom";
import { handleChooseOption, handleNavigateOption } from "./adminLeftbarLogic";

const AdminLeftbar = () => {
  const [openUserManagement, setOpenUserManagement] = useState(false);
  const [openProductManagement, setOpenProductManagement] = useState(false);
  const [openPromotionManagement, setOpenPromotionManagement] = useState(false);
  const [openMyStore, setOpenMyStore] = useState(false);
  const { option, setOption } = useContext(StoreContext);
  const history = useHistory();
  const location = useLocation();
  useEffect(() => {
    setOption(handleNavigateOption(location.pathname));
  }, [location]);

  return (
    <div className="adminLeftbar">
      <div className="adminLeftbarContainer">
        <div className="orderSite">
          <div
            className="heading"
            onClick={() => setOpenUserManagement(!openUserManagement)}
          >
            <span>User Management</span>
            <FontAwesomeIcon
              icon={faChevronUp}
              className={
                openUserManagement ? "openOption" : "openOption rotate"
              }
            />
          </div>

          <ul className={openUserManagement ? "options selected" : "options"}>
            <li
              className={option === "all" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("all", setOption, history)
              }
            >
              All users
            </li>
            <li
              className={option === "customer" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("customer", setOption, history)
              }
            >
              All customers
            </li>
            <li
              className={option === "store" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("store", setOption, history)
              }
            >
              All stores
            </li>
            <li
              className={option === "delivery-partner" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("delivery-partner", setOption, history)
              }
            >
              All delivery partners
            </li>
          </ul>
        </div>
        <div className="productSite">
          <div
            className="heading"
            onClick={() => setOpenProductManagement(!openProductManagement)}
          >
            <span>Product Management</span>
            <FontAwesomeIcon
              icon={faChevronUp}
              className={
                openProductManagement ? "openOption" : "openOption rotate"
              }
            />
          </div>
          <ul
            className={openProductManagement ? "options selected" : "options"}
          >
            <li
              className={option === "product" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("product", setOption, history)
              }
            >
              All Products
            </li>
  
          </ul>
        </div>
        <div className="promotionSite">
          <div
            className="heading"
            onClick={() => setOpenPromotionManagement(!openPromotionManagement)}
          >
            <span>Voucher Management</span>
            <FontAwesomeIcon
              icon={faChevronUp}
              className={
                openPromotionManagement ? "openOption" : "openOption rotate"
              }
            />
          </div>
          <ul
            className={openPromotionManagement ? "options selected" : "options"}
          >
            <li
              className={option === "global-vouchers" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("global-vouchers", setOption, history)
              }
            >
              All Vouchers
            </li>
            <li
              className={option === "new-global-voucher" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("new-global-voucher", setOption, history)
              }
            >
              Create Vouncher
            </li>
          </ul>
        </div>
        <div className="myStoreSite">
          <div className="heading" onClick={() => setOpenMyStore(!openMyStore)}>
            <span>Delivery Partner Management</span>
            <FontAwesomeIcon
              icon={faChevronUp}
              className={openMyStore ? "openOption" : "openOption rotate"}
            />
          </div>
          <ul className={openMyStore ? "options selected" : "options"}>
            <li
              className={option === "registerNewDeliveryPartner" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("registerNewDeliveryPartner", setOption, history)
              }
            >
              Register New Delivery Partner
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLeftbar;
