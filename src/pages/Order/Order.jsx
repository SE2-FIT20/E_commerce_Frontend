import { useState, useEffect, useContext} from "react";
import "./order.css";
import { handleConvertOrderType, handleDisplayOrderType } from "../../components/Store/StoreAllOrders/storeAllOrdersLogic";
import { useHistory } from "react-router-dom";

const Order = () => {
  const history = useHistory();
  const pageIndex = Math.floor(history.location.search.split("=")[1]);
  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [orderType, setOrderType] = useState(
    handleConvertOrderType(history.location.pathname.split("/")[3])
  );
  const handleChangeOrderType = (e) => {
    setOrderType(e.currentTarget.id);
    history.push(
      `/account/order/${handleDisplayOrderType(
        e.currentTarget.id
      )}?pages=${currentPage}`
    );
  };
  return (
    <div className="order">
      <div className="orderContainer">
        <div className="ordersFilter">
          <ul>
            <li
              className={orderType === "ALL" ? "all active" : "all"}
              id="ALL"
              onClick={handleChangeOrderType}
            >
              All
            </li>
            <li
              className={orderType === "PENDING" ? "pending active" : "pending"}
              id="PENDING"
              onClick={handleChangeOrderType}
            >
              Pending
            </li>
            <li
              className={
                orderType === "READY_FOR_DELIVERY"
                  ? "outOfStock active"
                  : "outOfStock"
              }
              id="READY_FOR_DELIVERY"
              onClick={handleChangeOrderType}
            >
              Ready
            </li>
            <li
              className={
                orderType === "DELIVERING" ? "outOfStock active" : "outOfStock"
              }
              id="DELIVERING"
              onClick={handleChangeOrderType}
            >
              Delivering
            </li>
            <li
              className={
                orderType === "DELIVERED" ? "outOfStock active" : "outOfStock"
              }
              id="DELIVERED"
              onClick={handleChangeOrderType}
            >
              Delivered
            </li>
            <li
              className={
                orderType === "CANCELLED" ? "outOfStock active" : "outOfStock"
              }
              id="CANCELLED"
              onClick={handleChangeOrderType}
            >
              Cancelled
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Order;
