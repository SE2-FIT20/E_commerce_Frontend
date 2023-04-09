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
              className={option === "All Users" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("All Users", setOption, history)
              }
            >
              All users
            </li>
            <li
              className={option === "All Customers" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("All Customers", setOption, history)
              }
            >
              All customers
            </li>
            <li
              className={option === "All Stores" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("All Stores", setOption, history)
              }
            >
              All stores
            </li>
            <li
              className={option === "All Delivery Partners" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("All Delivery Partners", setOption, history)
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
              className={option === "All Products" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("All Products", setOption, history)
              }
            >
              All Products
            </li>
            <li
              className={option === "Add a Product" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("Add a Product", setOption, history)
              }
            >
              Add a Product
            </li>
          </ul>
        </div>
        <div className="promotionSite">
          <div
            className="heading"
            onClick={() => setOpenPromotionManagement(!openPromotionManagement)}
          >
            <span>Promotion Management</span>
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
              className={option === "All Promotions" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("All Promotions", setOption, history)
              }
            >
              All Promotions
            </li>
            <li
              className={option === "Add a Promotion" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("Add a Promotion", setOption, history)
              }
            >
              Add a Promotion
            </li>
          </ul>
        </div>
        <div className="myStoreSite">
          <div className="heading" onClick={() => setOpenMyStore(!openMyStore)}>
            <span>My Store</span>
            <FontAwesomeIcon
              icon={faChevronUp}
              className={openMyStore ? "openOption" : "openOption rotate"}
            />
          </div>
          <ul className={openMyStore ? "options selected" : "options"}>
            <li
              className={option === "All Products" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("All Products", setOption, history)
              }
            >
              All Products
            </li>
            <li
              className={option === "Add a Product" ? "chosenOption" : ""}
              onClick={() =>
                handleChooseOption("Add a Product", setOption, history)
              }
            >
              Add a Product
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminLeftbar;
