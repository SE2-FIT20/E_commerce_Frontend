import React, { useContext, useEffect, useRef, useState } from "react";
import "./adminAllUsers.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faLock,
  faLockOpen,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { formatNumber } from "../../longFunctions";
import { useToast } from "@chakra-ui/react";
import {
  handleChangeProductPerPage,
  handleChangeUserType,
  handleClickPrev,
  handleClickNext,
  deleteProduct,
} from "./adminAllUsersLogic";

const AdminAllUsers = () => {
  const history = useHistory();
  const { BACKEND_URL, config, currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [userType, setUserType] = useState(
    useHistory().location.pathname.split("/")[3]
  );
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openFilterOptions, setOpenFilterOptions] = useState(false);
  const [openFilterOrder, setOpenFilterOrder] = useState(false);
  const [productToDelete, setProductToDelete] = useState(0);
  const pageIndex = Math.floor(useHistory().location.search.split("=")[1]);
  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [openProductPerPageOptions, setOpenProductPerPageOptions] =
    useState(false);
  const [userPerPage, setUserPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOption, setFilterOption] = useState("createdAt");
  const [filterOrder, setFilterOrder] = useState("desc");
  const confirmDelete = useRef();
  const filterOptionRef = useRef();
  const filterOrderRef = useRef();
  const productPerPageOptionRef = useRef();
  const toast = useToast();
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        confirmDelete.current &&
        !confirmDelete.current.contains(event.target)
      ) {
        setOpenConfirmDelete(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [confirmDelete]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      if (userType === "all") {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/admin/manage-accounts?page=0&elementPerPage=20&role=CUSTOMER&sortBy=asc&filter=name&status=UNLOCKED`,
          config
        );
        setUsers(data.data.content);
        setTotalPages(data.data.totalPages);
      } else if (userType === "active") {
        const { data } = await axios.get(
          ``,
          config
        );
        setUsers(data.data.content);
        setTotalPages(data.data.totalPages);
      } else {
        const { data } = await axios.get(
          ``,
          config
        );
        setUsers(data.data.content);
        setTotalPages(data.data.totalPages);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "An error occurred fetching products",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleChooseFilterOption = (option) => {
    setFilterOption(option);
    setOpenFilterOptions(false);
  };

  const handleDisplayFilterOption = (option) => {
    switch (option) {
      case "name":
        return "Name";
      case "createdAt":
        return "Date";
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userPerPage, currentPage, filterOption, filterOrder, userType]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterOptionRef.current &&
        !filterOptionRef.current.contains(event.target)
      ) {
        setOpenFilterOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOptionRef]);

  useEffect(() => {
    function handleClickOutside(event) {
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
  }, [filterOrderRef]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        productPerPageOptionRef.current &&
        !productPerPageOptionRef.current.contains(event.target)
      ) {
        setOpenProductPerPageOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [productPerPageOptionRef]);

  return (
    <div className="adminAllUsers">
      <div className="adminAllUsersContainer">
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
                    onClick={() => handleChooseFilterOption("name")}
                    className={filterOption === "name" ? "selected" : ""}
                  >
                    Name
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
        <div className="adminUsersFilter">
          <ul>
            <li
              className={userType === "all" ? "all active" : "all"}
              id="all"
              onClick={(e) =>
                handleChangeUserType(e, currentPage, setUserType, history)
              }
            >
              All
            </li>
            <li
              className={
                userType === "customers" ? "inStock active" : "inStock"
              }
              id="active"
              onClick={(e) =>
                handleChangeUserType(e, currentPage, setUserType, history)
              }
            >
              Customers
            </li>
            <li
              className={
                userType === "stores" ? "outOfStock active" : "outOfStock"
              }
              id="soldout"
              onClick={(e) =>
                handleChangeUserType(e, currentPage, setUserType, history)
              }
            >
              Stores
            </li>
            <li
              className={
                userType === "delivery" ? "outOfStock active" : "outOfStock"
              }
              id="soldout"
              onClick={(e) =>
                handleChangeUserType(e, currentPage, setUserType, history)
              }
            >
              Delivery Partners
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
          <div className="adminProducts">
            <table>
              <thead>
                <tr>
                  <th style={{ flex: "0.4" }}>ID</th>
                  <th
                    style={{
                      flex: "2.5",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      flex: "2.5",
                    }}
                  >
                    Email
                  </th>

                  <th
                    style={{
                      flex: "2",
                    }}
                  >
                    Addresses
                  </th>
                  <th>Role</th>
                  <th>Locked</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th style={{ flex: "0.4" }}>1</th>
                  <th
                    style={{
                      flex: "2.5",
                    }}
                  >
                    <div
                      className="container"
                      style={{
                        justifyContent: "flex-start",
                        paddingLeft: "20px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={currentUser.avatar}
                        className="userImage"
                        alt=""
                      />
                      <span>Do Minhasjdahdj kashdjkashdkajsd</span>
                    </div>
                  </th>
                  <th
                    style={{
                      flex: "2.5",
                    }}
                  >
                    <div className="container">steaky3798213@gmail.com</div>
                  </th>

                  <th
                    style={{
                      flex: "2",
                    }}
                  >
                    <div className="container"> {currentUser.addresses[0]}</div>
                  </th>
                  <th>
                    <div className="container">CUSTOMER</div>
                  </th>
                  <th>
                    <div className="container">1</div>
                  </th>
                  <th>
                    <div className="container">
                      <div className="userOperationIcon">
                        <FontAwesomeIcon icon={faLock} />
                      </div>
                      <div className="userOperationIcon">
                        <FontAwesomeIcon icon={faLockOpen} />
                      </div>
                    </div>
                  </th>
                </tr>
                <tr>
                  <th style={{ flex: "0.4" }}>1</th>
                  <th
                    style={{
                      flex: "2.5",
                    }}
                  >
                    <div
                      className="container"
                      style={{
                        justifyContent: "flex-start",
                        paddingLeft: "20px",
                        display: "flex",
                        gap: "10px",
                      }}
                    >
                      <img
                        src={currentUser.avatar}
                        className="userImage"
                        alt=""
                      />
                      <span>Do Minhasjdahdj kashdjkashdkajsd</span>
                    </div>
                  </th>
                  <th
                    style={{
                      flex: "2.5",
                    }}
                  >
                    <div className="container">steaky3798213@gmail.com</div>
                  </th>

                  <th
                    style={{
                      flex: "2",
                    }}
                  >
                    <div className="container"> {currentUser.addresses[0]}</div>
                  </th>
                  <th>
                    <div className="container">CUSTOMER</div>
                  </th>
                  <th>
                    <div className="container">1</div>
                  </th>
                  <th>
                    <div className="container">
                      <div className="userOperationIcon">
                        <FontAwesomeIcon icon={faLock} />
                      </div>
                      <div className="userOperationIcon">
                        <FontAwesomeIcon icon={faLockOpen} />
                      </div>
                    </div>
                  </th>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div className="productNav">
          <div className="productNavContainer">
            <div className="productNavBtn">
              <div
                className="prevButton"
                onClick={() => handleClickPrev(setCurrentPage, totalPages)}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
              <span>{`${currentPage}/${
                totalPages !== 0 ? totalPages : 1
              }`}</span>
              <div
                className="nextButton"
                onClick={() => handleClickNext(setCurrentPage, totalPages)}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            </div>
            <div className="productPerPage">
              <div className="productPerPageContainer">
                <div
                  className="productPerPageButton"
                  onClick={() =>
                    setOpenProductPerPageOptions(!openProductPerPageOptions)
                  }
                  ref={productPerPageOptionRef}
                >
                  <span>{`${userPerPage}/page`}</span>
                  <FontAwesomeIcon
                    icon={faChevronUp}
                    className={
                      openProductPerPageOptions
                        ? "openOption rotate"
                        : "openOption"
                    }
                  />
                </div>

                <div
                  className={"productPerPageOptions"}
                  style={{
                    border: openProductPerPageOptions
                      ? "1px solid #ccc"
                      : "none",
                  }}
                >
                  <ul className={openProductPerPageOptions ? "open" : ""}>
                    <li
                      onClick={() =>
                        handleChangeProductPerPage(
                          10,
                          setUserPerPage,
                          setOpenProductPerPageOptions,
                          setCurrentPage
                        )
                      }
                      className={userPerPage === 10 ? "selected" : ""}
                    >
                      10
                    </li>
                    <li
                      onClick={() =>
                        handleChangeProductPerPage(
                          20,
                          setUserPerPage,
                          setOpenProductPerPageOptions,
                          setCurrentPage
                        )
                      }
                      className={userPerPage === 20 ? "selected" : ""}
                    >
                      20
                    </li>
                    <li
                      onClick={() =>
                        handleChangeProductPerPage(
                          30,
                          setUserPerPage,
                          setOpenProductPerPageOptions,
                          setCurrentPage
                        )
                      }
                      className={userPerPage === 30 ? "selected" : ""}
                    >
                      30
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={openConfirmDelete ? "confirmDelete" : "confirmDelete hide"}
      >
        <div className="confirmDeleteContainer" ref={confirmDelete}>
          <div className="deleteTitle">
            <span>Are you sure you want to delete this product?</span>
          </div>
          <div className="deleteBtnContainer">
            <button className="button">Yes</button>
            <button
              className="button"
              onClick={() => setOpenConfirmDelete(false)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAllUsers;
