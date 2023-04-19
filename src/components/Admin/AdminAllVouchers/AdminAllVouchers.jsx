import React, { useContext, useEffect, useRef, useState } from "react";
import "./adminAllVouchers.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { StoreContext } from "../../../context/StoreContext";
import AdminPopup from "../AdminPopup/AdminPopup";
import AdminVoucher from "../AdminVoucher/AdminVoucher";

const AdminAllProducts = () => {
  const history = useHistory();
  const { BACKEND_URL, config } = useContext(AuthContext);
  const { option } = useContext(StoreContext);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [popupType, setPopupType] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [openFilterOptions, setOpenFilterOptions] = useState(false);
  const [openFilterOrder, setOpenFilterOrder] = useState(false);
  const [moreVoucherLoading, setMoreVoucherLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOption, setFilterOption] = useState("percent");
  const [filterOrder, setFilterOrder] = useState("asc");
  const filterOptionRef = useRef();
  const filterOrderRef = useRef();
  const productPerPageOptionRef = useRef();
  const toast = useToast();

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/admin/voucher-sets?page=${currentPage}&elementsPerPage=7&filter=${filterOption}&sortBy=${filterOrder}`,
        config
      );
      setVouchers(data.data.content);
      setTotalPages(data.data.totalPages);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "An error occurred fetching vouchers",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleScroll = async (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollHeight - scrollTop === clientHeight && currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      try {
        setMoreVoucherLoading(true);
        setTimeout(async () => {
          const { data } = await axios.get(
            `${BACKEND_URL}/api/admin/voucher-sets?page=${
              currentPage + 1
            }&elementsPerPage=7&filter=${filterOption}&sortBy=${filterOrder}`,
            config
          );
          setVouchers((prevVouchers) => [
            ...prevVouchers,
            ...data.data.content,
          ]);
          setMoreVoucherLoading(false);
        }, [1000]);
      } catch (error) {
        toast({
          title: "An error occured while fetching vouchers!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setMoreVoucherLoading(false);
      }
    }
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
    fetchVouchers();
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
    <div className="adminAllVouchers">
      <div className="adminAllVouchersContainer">
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
                    <span>Voucher</span>
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
              <tbody onScroll={(e) => handleScroll(e)}>
                {vouchers.map((voucher) => (
                  <AdminVoucher
                    voucher={voucher}
                    key={voucher.id}
                    setOpenPopup={setOpenPopup}
                    setPopupType={setPopupType}
                    setSelectedVoucher={setSelectedVoucher}
                  />
                ))}
                {moreVoucherLoading && (
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

      <AdminPopup
        open={openPopup}
        setOpen={setOpenPopup}
        popupType={popupType}
        voucher={selectedVoucher}
        refetchVouchers={fetchVouchers}
      />
    </div>
  );
};

export default AdminAllProducts;
