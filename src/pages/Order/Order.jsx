import { useState, useEffect, useContext } from "react";
import "./order.css";
import { handleConvertOrderType, handleDisplayOrderType } from "./orderLogic";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import { formatNumber, capitalize } from "../../components/longFunctions";
import NoOrder from "../../images/no-order-icon.png"

const Order = () => {
  const history = useHistory();
  const toast = useToast();
  const { BACKEND_URL, config } = useContext(AuthContext);
  const pageIndex = Math.floor(0);
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [orderType, setOrderType] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleChangeOrderType = (e) => {
    setOrderType(e.target.id);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/customer/orders?page=0&elementsPerPage=20&sortBy=desc&filter=createdAt&status=${handleConvertOrderType(
          orderType
        )}`,
        config
      );
      setOrders(data.data.content);
      setLoading(false);
    } catch (error) {
      toast({
        title: "An error occured while fetching orders!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    history.push(`/account/order/${orderType}`);
  }, [orderType]);

  return (
    <div className="order">
      <div className="orderContainer">
        <div className="ordersFilter">
          <ul>
            <li
              className={orderType === "all" ? "all active" : "all"}
              id="all"
              onClick={handleChangeOrderType}
            >
              All
            </li>
            <li
              className={orderType === "pending" ? "pending active" : "pending"}
              id="pending"
              onClick={handleChangeOrderType}
            >
              Pending
            </li>
            <li
              className={
                orderType === "ready" ? "outOfStock active" : "outOfStock"
              }
              id="ready"
              onClick={handleChangeOrderType}
            >
              Ready
            </li>
            <li
              className={
                orderType === "delivering" ? "outOfStock active" : "outOfStock"
              }
              id="delivering"
              onClick={handleChangeOrderType}
            >
              Delivering
            </li>
            <li
              className={
                orderType === "delivered" ? "outOfStock active" : "outOfStock"
              }
              id="delivered"
              onClick={handleChangeOrderType}
            >
              Delivered
            </li>
            <li
              className={
                orderType === "cancelled" ? "outOfStock active" : "outOfStock"
              }
              id="cancelled"
              onClick={handleChangeOrderType}
            >
              Cancelled
            </li>
          </ul>
        </div>
        {!loading && (
          <div className="orders">
            {orders.length > 0 &&
              orders.map((order) => (
                <div className="ordersContainer" key={order.id}>
                  <div className="orderStore">
                    <div className="orderStoreContainer">
                      <div className="orderStoreAvatar">
                        <img src={order.items[0].product.store.avatar} alt="" />
                        <span>{order.items[0].product.store.name}</span>
                        <button
                          className="button"
                          onClick={() =>
                            history.push(
                              `/store/${order.items[0].product.store.id}`
                            )
                          }
                        >
                          Visit Store
                        </button>
                      </div>
                      <div className="orderInfo">
                        <span>
                          Order Code: <span>{order.orderCode}</span>
                        </span>
                        <span className="orderStatus">{order.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="orderProducts">
                    {order.items.map((item) => (
                      <div className="orderProductContainer" key={item.id}>
                        <div className="orderProductLeft">
                          <div className="orderProductImage">
                            <img src={item.product.images[0]} alt="" />
                          </div>
                          <div className="orderProductInfo">
                            <span className="orderProductName">
                              {item.product.name}
                            </span>
                            <span className="orderProductCategory">
                              {capitalize(item.product.category.toLowerCase())}
                            </span>
                            <span className="orderProductQuantity">{`x${item.quantity}`}</span>
                          </div>
                        </div>
                        <div className="orderProductRight">
                          <span className="price-symbol">₫</span>
                          {formatNumber(item.product.price * item.quantity)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="orderShipping">
                    <div className="orderShippingLeft">
                      <div className="orderDeliveryTitle">
                        <span>Delivery Partner:</span>
                      </div>
                      <div className="orderDeliveryName">
                        <img src={order.deliveryPartner.avatar} alt="" />
                        <span>{order.deliveryPartner.name}</span>
                      </div>
                    </div>
                    <div className="orderShippingRight">
                      <span className="price-symbol">₫</span>
                      {formatNumber(order.deliveryPartner.shippingFee)}
                    </div>
                  </div>
                  <div className="orderTotal">
                    <div className="orderTotalPrice">
                      Total:
                      <span>{"₫" + formatNumber(order.totalPrice)}</span>
                    </div>
                    <div className="orderButtons">
                      <button className="button" onClick={() => window.location.href=`/product/${order.items[0].product.id}`}>Review Product</button>
                      <button className="button purchaseAgain">
                        Purchase Again
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            {orders.length === 0 && (
              <div className="noOrder">
                <img src={NoOrder}/>
                <span>No Orders</span>
              </div>
            )}
          </div>
        )}
        {loading && (
          <div className="fullLoading">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
