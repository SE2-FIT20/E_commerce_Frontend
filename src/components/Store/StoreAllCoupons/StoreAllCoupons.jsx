import React, { useContext, useEffect, useRef, useState } from "react";
import "./storeAllCoupons.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { StoreContext } from "../../../context/StoreContext";
import StoreCoupon from "../StoreCoupon/StoreCoupon";
import StorePopup from "../StorePopup/StorePopup";
import NoCoupon from "../../../images/no-coupon.png";
import CustomerPopup from "../../../components/Customer/CustomerPopup/CustomerPopup"

const StoreAllCoupons = () => {
  const history = useHistory();
  const { BACKEND_URL, config } = useContext(AuthContext);
  const { option } = useContext(StoreContext);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [openCustomerPopup, setOpenCustomerPopup] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [openFilterOptions, setOpenFilterOptions] = useState(false);
  const [openFilterOrder, setOpenFilterOrder] = useState(false);
  const [moreCouponLoading, setMoreCouponLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOption, setFilterOption] = useState("percent");
  const [filterOrder, setFilterOrder] = useState("asc");
  const filterOptionRef = useRef();
  const filterOrderRef = useRef();
  const productPerPageOptionRef = useRef();
  const toast = useToast();

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/store/coupon-sets?page=${currentPage}&elementsPerPage=20&filter=${filterOption}&sortBy=${filterOrder}`,
        config
      );
      setCoupons(data.data.content);
      setTotalPages(data.data.totalPages);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (
        error.response.data.message ===
        "Your account is locked! Please contact admin to unlock your account!"
      ) {
        setLoading(false);
        setOpenCustomerPopup(true);
        return;
      }
      toast({
        title: "An error occurred fetching coupons",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleScroll = async (event) => {
    // const { scrollTop, scrollHeight, clientHeight } = event.target;
    // if (
    //   scrollHeight - scrollTop === clientHeight &&
    //   currentPage < totalPages - 1
    // ) {
    //   setCurrentPage((prev) => prev + 1);
    //   try {
    //     setMoreCouponLoading(true);
    //     setTimeout(async () => {
    //       const { data } = await axios.get(
    //         `${BACKEND_URL}/api/store/coupon-sets?page=${
    //           currentPage + 1
    //         }&elementsPerPage=7&filter=${filterOption}&sortBy=${filterOrder}`,
    //         config
    //       );
    //       setCoupons((prevVouchers) => [...prevVouchers, ...data.data.content]);
    //       setMoreCouponLoading(false);
    //     }, [1000]);
    //   } catch (error) {
    //     toast({
    //       title: "An error occured while fetching vouchers!",
    //       status: "error",
    //       duration: 3000,
    //       isClosable: true,
    //       position: "bottom",
    //     });
    //     setMoreCouponLoading(false);
    //   }
    // }
  };

  const handleChooseFilterOption = (option) => {
    setFilterOption(option);
    setOpenFilterOptions(false);
  };

  const handleDisplayFilterOption = (option) => {
    switch (option) {
      case "id":
        return "ID";
      case "createdAt":
        return "Date";
      case "startAt":
        return "Start At";
      case "expiredAt":
        return "Expired At";
      case "percent":
        return "Percent";
      default:
        return "";
    }
  };
  useEffect(() => {
    fetchCoupons();
  }, [filterOption, filterOrder, option]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterOptionRef.current &&
        !filterOptionRef.current.contains(event.target)
      ) {
        setOpenFilterOptions(false);
      }
      if (
        filterOrderRef.current &&
        !filterOrderRef.current.contains(event.target)
      ) {
        setOpenFilterOrder(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOptionRef, filterOrderRef, productPerPageOptionRef]);

  return (
    <div className="storeAllCoupon">
      <div className="storeAllCouponContainer">
        <div className="adminFilterOptions">
          <div className="adminFilterOptionsContainer">
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
                    onClick={() => handleChooseFilterOption("id")}
                    className={filterOption === "id" ? "selected" : ""}
                  >
                    ID
                  </li>
                  <li
                    onClick={() => handleChooseFilterOption("createdAt")}
                    className={filterOption === "createdAt" ? "selected" : ""}
                  >
                    Date
                  </li>
                  <li
                    onClick={() => handleChooseFilterOption("startAt")}
                    className={filterOption === "startAt" ? "selected" : ""}
                  >
                    Started At
                  </li>
                  <li
                    onClick={() => handleChooseFilterOption("expiredAt")}
                    className={filterOption === "expiredAt" ? "selected" : ""}
                  >
                    Expired At
                  </li>
                  <li
                    onClick={() => handleChooseFilterOption("percent")}
                    className={filterOption === "percent" ? "selected" : ""}
                  >
                    Percent
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
          </div>
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
          <div className="adminVouchers">
            <table>
              <thead>
                <tr>
                  <th
                    style={{
                      flex: "4",
                      justifyContent: "center",
                    }}
                  >
                    <span>Coupon</span>
                  </th>
                  <th
                    style={{
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    <span>Quantity</span>
                  </th>
                  <th
                    style={{
                      justifyContent: "center",
                      display: "flex",
                    }}
                  >
                    <span></span>
                  </th>
                </tr>
              </thead>
              <tbody
                onScroll={(e) => handleScroll(e)}
                style={{ overflow: coupons.length === 0 && "hidden" }}
              >
                {coupons.length > 0 &&
                  coupons.map((coupon) => (
                    <StoreCoupon
                      coupon={coupon}
                      key={coupon.id}
                      setOpenPopup={setOpenPopup}
                      setSelectedCoupon={setSelectedCoupon}
                      setPopupType={setPopupType}
                      fetchCoupons={fetchCoupons}
                    />
                  ))}
                {coupons.length === 0 && (
                  <div className="noCoupon">
                    <img src={NoCoupon} alt="" />
                    <span>No Coupon Found</span>
                  </div>
                )}
                {moreCouponLoading && (
                  <th>
                    <div className="partialLoading">
                      <div className="lds-ellipsis">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                    </div>
                  </th>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <StorePopup
        open={openPopup}
        setOpen={setOpenPopup}
        popupType={popupType}
        coupon={selectedCoupon}
        fetchCoupons={fetchCoupons}
      />
      <CustomerPopup open={openCustomerPopup} setOpen={setOpenCustomerPopup} popupType="account-locked" />
    </div>
  );
};

export default StoreAllCoupons;
