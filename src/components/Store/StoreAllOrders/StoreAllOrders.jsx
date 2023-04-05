import React, { useContext, useEffect, useState, useRef } from "react";
import "./storeAllOrders.css";
import NoItem from "../../../images/no-product.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  handleChangeOrderPerPage,
  handleClickNext,
  handleClickPrev,
  handleDisplayOrderType,
  handleConvertOrderType,
  handleDisplayFilterOption,
  formatTimestamp,
  handleDisplayStatus,
  handleDisplayStatusButton,
} from "./storeAllOrdersLogic";
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
  const [totalPages, setTotalPages] = useState(0);
  const [orderType, setOrderType] = useState(
    handleConvertOrderType(useHistory().location.pathname.split("/")[3])
  );
  const [loading, setLoading] = useState(false);
  const pageIndex = Math.floor(useHistory().location.search.split("=")[1]);
  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [orderPerPage, setOrderPerPage] = useState(10);
  const [openOrderPerPageOptions, setOpenOrderPerPageOptions] = useState(false);
  const [openFilterOrder, setOpenFilterOrder] = useState(false);
  const [openFilterOptions, setOpenFilterOptions] = useState(false);
  const [filterOption, setFilterOption] = useState("createdAt");
  const [filterOrder, setFilterOrder] = useState("desc");
  const toast = useToast();
  const filterOptionRef = useRef();
  const filterOrderRef = useRef();

  const handleChangeOrderType = (e) => {
    setOrderType(e.currentTarget.id);
    history.push(
      `/store/order/${handleDisplayOrderType(
        e.currentTarget.id
      )}?pages=${currentPage}`
    );
  };
  useEffect(() => {
    history.push(
      `/store/order/${handleDisplayOrderType(orderType)}?pages=${currentPage}`
    );
  }, [currentPage]);

  const handleChooseFilterOption = (option) => {
    setFilterOption(option);
    setOpenFilterOptions(false);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/store/orders?elementsPerPage=${orderPerPage}&page=${
          currentPage - 1
        }&status=${orderType}&sortBy=${filterOrder}`,
        config
      );
      setOrders(data.data.content);
      setTotalPages(data.data.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
  }, [orderPerPage, currentPage, orderType, filterOption, filterOrder]);
  return (
    <div className="storeAllOrders">
      <div className="storeAllOrdersContainer">
        <div className="storeFilterOptions">
          <div className="storeFilterOptionsContainer">
            <div className="filterSelect">
              <h2>Filtered By</h2>
              <div
                className="filterSelectItem"
                onClick={() => setOpenFilterOptions(!openFilterOptions)}
                ref={filterOptionRef}
              >
                <span>{handleDisplayFilterOption(filterOption)}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={
                    openFilterOptions ? "openOption rotate" : "openOption"
                  }
                />
                <ul
                  className={
                    openFilterOptions ? "filterOptions open" : "filterOptions"
                  }
                  style={{
                    border: openFilterOptions ? "1px solid #ccc" : "none",
                  }}
                >
                  <li
                    onClick={() => handleChooseFilterOption("price")}
                    className={filterOption === "price" ? "selected" : ""}
                  >
                    Price
                  </li>
                  <li
                    onClick={() => handleChooseFilterOption("createdAt")}
                    className={filterOption === "createdAt" ? "selected" : ""}
                  >
                    Date
                  </li>
                </ul>
              </div>
              <div
                className="filterSelectItem"
                style={{
                  width: "fit-content",
                }}
                onClick={() => setOpenFilterOrder(!openFilterOrder)}
                ref={filterOrderRef}
              >
                <span>{filterOrder === "asc" ? "A-Z" : "Z-A"}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={
                    openFilterOrder ? "openOption rotate" : "openOption"
                  }
                />
                <ul
                  className={
                    openFilterOrder ? "filterOptions open" : "filterOptions"
                  }
                  style={{
                    border: openFilterOrder ? "1px solid #ccc" : "none",
                  }}
                >
                  <li
                    onClick={() => setFilterOrder("asc")}
                    className={filterOrder === "asc" ? "selected" : ""}
                  >
                    A-Z
                  </li>
                  <li
                    onClick={() => setFilterOrder("desc")}
                    className={filterOrder === "desc" ? "selected" : ""}
                  >
                    Z-A
                  </li>
                </ul>
              </div>
            </div>
            <div>
              <h2>Category</h2>
            </div>
          </div>
        </div>
        <div className="storeOrdersFilter">
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
        {!loading && (
          <div className="storeOrders">
            <table>
              <thead>
                <tr>
                  <th style={{ flex: "4", justifyContent: "flex-start" }}>
                    Product
                  </th>
                  <th style={{ flex: "1.5" }}>Price</th>
                  <th style={{ flex: "1.5" }}>Quantity</th>
                  <th style={{ flex: "1.5" }}>Category</th>
                  <th style={{ flex: "1.5" }}>Status</th>
                </tr>
              </thead>
              {orders.length > 0 && (
                <tbody>
                  {orders.map((order, i) => (
                    <tr style={{ marginBottom: "25px" }} key={i}>
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
                          <div className="productsInfo" key={i}>
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
                            <div style={{ flex: "1" }}>
                              <div className="container">{item.quantity}</div>
                            </div>
                            <div style={{ flex: "1.5" }}>
                              <div className="container">
                                {item.product.category}
                              </div>
                            </div>
                            <div style={{ flex: "1.5" }}>
                              <div
                                className="container"
                                style={{ fontWeight: "bold", fontSize: "20px" }}
                              >
                                {handleDisplayStatus(order.status)}
                              </div>
                            </div>
                          </div>
                        ))}
                        <div className="total">
                          <div className="totalContainer">
                            <div className="totalPriceContainer">
                              <span className="totalPriceTxt">Total: </span>
                            </div>
                            <div className="totalPriceRight">
                              <div className="totalPrice">
                                <span className="price-symbol">₫</span>

                                {formatNumber(order.totalPrice)}
                              </div>
                              <button className="button">
                                {handleDisplayStatusButton(order.status)}
                              </button>
                            </div>
                          </div>
                        </div>
                      </th>
                    </tr>
                  ))}
                </tbody>
              )}
              {orders.length === 0 && (
                <tbody
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <tr className="noItem">
                    <img src={NoItem} alt="" className="noItem" />

                    <div className="noItemText">
                      <h2>No Items Found!</h2>
                      <span>Sorry... No items found inside your card</span>
                    </div>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        )}
        {orders.length > 0 && (
          <div className="orderNav">
            <div className="orderNavContainer">
              <div className="orderNavBtn">
                <div
                  className="prevBtn"
                  onClick={() => handleClickPrev(setCurrentPage)}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </div>
                <span>{`${currentPage}/${
                  totalPages !== 0 ? totalPages : 1
                }`}</span>
                <div
                  className="nextBtn"
                  onClick={() => handleClickNext(setCurrentPage, totalPages)}
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
              </div>
              <div className="orderPerPage">
                <div className="orderPerPageContainer">
                  <div
                    className="orderPerPageButton"
                    onClick={() =>
                      setOpenOrderPerPageOptions(!openOrderPerPageOptions)
                    }
                  >
                    <span>{`${orderPerPage}/page`}</span>
                    <FontAwesomeIcon
                      icon={faChevronUp}
                      className={
                        openOrderPerPageOptions
                          ? "openOption rotate"
                          : "openOption"
                      }
                    />
                  </div>

                  <div
                    className="orderPerPageOptions"
                    style={{
                      border: openOrderPerPageOptions
                        ? "1px solid #ccc"
                        : "none",
                    }}
                  >
                    <ul className={openOrderPerPageOptions ? "open" : ""}>
                      <li
                        onClick={() =>
                          handleChangeOrderPerPage(
                            10,
                            setOrderPerPage,
                            setOpenOrderPerPageOptions
                          )
                        }
                        className={orderPerPage === 10 ? "selected" : ""}
                      >
                        10
                      </li>
                      <li
                        onClick={() =>
                          handleChangeOrderPerPage(
                            20,
                            setOrderPerPage,
                            setOpenOrderPerPageOptions
                          )
                        }
                        className={orderPerPage === 20 ? "selected" : ""}
                      >
                        20
                      </li>
                      <li
                        onClick={() =>
                          handleChangeOrderPerPage(
                            30,
                            setOrderPerPage,
                            setOpenOrderPerPageOptions
                          )
                        }
                        className={orderPerPage === 30 ? "selected" : ""}
                      >
                        30
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreAllOrders;
