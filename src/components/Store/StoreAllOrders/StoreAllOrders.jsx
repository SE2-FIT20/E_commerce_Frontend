import React, { useContext, useEffect, useState } from "react";
import "./storeAllOrders.css";
import DeadOfWinter from "../../../images/dowln.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { formatNumber } from "../../longFunctions";
import { useToast } from "@chakra-ui/react";

const StoreAllOrders = () => {
  const history = useHistory();
  const location = useLocation();
  const { BACKEND_URL, config } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [orderType, setOrderType] = useState(
    useHistory().location.pathname.split("/")[3]
  );

  const pageIndex = Math.floor(useHistory().location.search.split("=")[1]);
  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [orderPerPage, setOrderPerPage] = useState(3);
  const numOfPages = Math.ceil(orders.length / orderPerPage);
  const orderIndexStart = (currentPage - 1) * orderPerPage;
  const orderIndexEnd = orderIndexStart + orderPerPage - 1;
  const handleChangeOrderPerPage = (e) => {
    setOrderPerPage(Math.floor(e.target.value));
  };
  console.log(orders);

  const toast = useToast();

  const handleChangeOrderType = (e) => {
    setOrderType(e.currentTarget.id);
    history.push(`/store/order/${e.currentTarget.id}?pages=${currentPage}`);
  };
  const handleClickNext = () => {
    setCurrentPage((prev) => (prev === numOfPages ? prev : prev + 1));
  };

  const handleClickPrev = () => {
    setCurrentPage((prev) => (prev === 1 ? prev : prev - 1));
  };
  useEffect(() => {
    history.push(`/store/order/${orderType}?pages=${currentPage}`);
  }, [currentPage]);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = date.toLocaleDateString("en-US", options);
    const day = date.getDate();
    const suffix = getOrdinalSuffix(day);
    return formattedDate.replace(/\d+/, day + suffix);
  };

  const getOrdinalSuffix = (day) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const remainder = day % 100;
    const suffix =
      suffixes[(remainder - 20) % 10] || suffixes[remainder] || suffixes[0];
    return suffix;
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/store/orders`,
        config
      );
      setOrders(data.data);
    } catch (error) {
      toast({
        title: "An error occurred fetching orders",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  console.log(orders);

  return (
    <div className="storeAllOrders">
      <div className="storeAllOrdersContainer">
        <div className="storeOrdersFilter">
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
              Ready to deliver
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
        <div className="storeOrders">
          <table>
            <thead>
              <tr>
                <th style={{ flex: "4", justifyContent: "flex-start" }}>
                  Product
                </th>
                <th style={{ flex: "1.5" }}>Price</th>
                <th style={{ flex: "0.5" }}>Quantity</th>
                <th style={{ flex: "1.5" }}>Category</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders
                .slice(orderIndexStart, orderIndexEnd + 1)
                .map((order, i) => (
                  <tr style={{ marginBottom: "25px" }}>
                    <th className="orderInfo">
                      <div className="customer">
                        <img src={order.customer.avatar} alt="" />
                        <h2>{order.customer.name}</h2>
                      </div>

                      <div className="orderRight">
                        <div className="date">
                          {formatTimestamp(order.createdAt)}
                        </div>
                        <div className="orderCode">
                          <h2>Order Code:</h2>
                          <span>{order.orderCode}</span>
                        </div>
                      </div>
                    </th>
                    <th className="products">
                      {order.items.map((item, i) => (
                        <div className="productsInfo">
                          <div
                            style={{
                              display: "flex",
                              flex: "4",
                              gap: "15px",
                              alignItems: "flex-start",
                              paddingTop: i === 0 && "10px",
                              paddingBottom:
                                i === order.items.length - 1 && "20px",
                              paddingLeft: "15px",
                              justifyContent: "flex-start",
                            }}
                          >
                            <img
                              src={item.product.images[0]}
                              alt=""
                              className="productImage"
                            />
                            <span
                              className="productName"
                              // onClick={() =>
                              //   history.push(
                              //     `/store/product/${order.items.product.id}`
                              //   )
                              // }
                            >
                              {item.product.name}
                            </span>
                          </div>
                          <div style={{ flex: "1.5" }}>
                            <div className="container">
                              <span className="price-symbol">₫</span>
                              {formatNumber(item.product.price)}
                            </div>
                          </div>
                          <div style={{ flex: "0.5" }}>
                            <div className="container">
                              {item.product.quantity}
                            </div>
                          </div>
                          <div style={{ flex: "1.5" }}>
                            <div className="container">
                              {item.product.category}
                            </div>
                          </div>
                          <div className="productButtons"></div>
                        </div>
                      ))}
                      <div className="total">
                        <div className="totalContainer">
                          <div className="totalPriceContainer">
                            <span className="totalPriceTxt">Total: </span>
                          </div>
                          <div className="totalPriceRight">
                            <div className="totalPrice">
                              {formatNumber(order.totalPrice)}
                            </div>
                            <button className="button">Prepared</button>
                          </div>
                        </div>
                      </div>
                    </th>
                  </tr>
                ))}

              <tr
                style={{
                  position: "absolute",
                  left: "0px",
                  bottom: "0px",
                  paddingBottom: "15px",
                  zIndex: "50",
                  backgroundColor: "#fff",
                }}
              >
                <td className="productNav">
                  <div className="productNavBtn">
                    <div className="prevBtn" onClick={handleClickPrev}>
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                    <span>{`${currentPage}/${
                      numOfPages != 1 / 0 ? numOfPages : "1"
                    }`}</span>
                    <div className="nextBtn" onClick={handleClickNext}>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                  </div>
                  <div className="productPerPage">
                    <div className="productPerPageContainer">
                      <input
                        type="number"
                        value={orderPerPage}
                        onChange={handleChangeOrderPerPage}
                      />
                      <span>{`/page`}</span>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StoreAllOrders;
