import React, { useContext, useEffect, useRef, useState } from "react";
import "./adminAllUsers.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faEye,
  faLock,
  faLockOpen,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import {
  handleChangeUserPerPage,
  handleChangeUserType,
  handleClickPrev,
  handleClickNext,
} from "./adminAllUsersLogic";
import { StoreContext } from "../../../context/StoreContext";
import AdminSeeDetail from "../AdminSeeDetail/AdminSeeDetail";
import { formatDate } from "../../longFunctions";
import AdminPopup from "../AdminPopup/AdminPopup";

const AdminAllUsers = () => {
  const history = useHistory();
  const { BACKEND_URL, config } = useContext(AuthContext);
  const { option, setOption } = useContext(StoreContext);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [popupType, setPopupType] = useState(null);
  const [openPopup, setOpenPopup] = useState(false);
  const [openFilterOptions, setOpenFilterOptions] = useState(false);
  const [openFilterOrder, setOpenFilterOrder] = useState(false);
  const [openAdminSeeDetail, setOpenAdminSeeDetail] = useState(false);
  const pageIndex = Math.floor(useHistory().location.search.split("=")[1]);
  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [openUserPerPageOptions, setOpenUserPerPageOptions] = useState(false);
  const [userPerPage, setUserPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOption, setFilterOption] = useState("id");
  const [filterOrder, setFilterOrder] = useState("asc");
  const filterOptionRef = useRef();
  const filterOrderRef = useRef();
  const userPerPageOptionRef = useRef();
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/admin/manage-accounts?page=${
          currentPage - 1
        }&elementsPerPage=${userPerPage}&role=${option.toUpperCase()}&sortBy=${filterOrder}&filter=${filterOption}&status=UNLOCKED`,
        config
      );
      setUsers(data.data.content);
      setTotalPages(data.data.totalPages);

      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "An error occurred fetching users",
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
      case "id":
        return "ID";
      case "name":
        return "Name";
      case "createdAt":
        return "Date";
    }
  };

  const handleSeeDetail = (user) => {
    setSelectedUser(user);
    setOpenAdminSeeDetail(true);
  };

  useEffect(() => {
    fetchUsers();
  }, [userPerPage, currentPage, filterOption, filterOrder, option]);

  useEffect(() => {
    history.push(`/admin/users/${option}?pages=${currentPage}`);
  }, [currentPage]);
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
      if (
        userPerPageOptionRef.current &&
        !userPerPageOptionRef.current.contains(event.target)
      ) {
        setOpenUserPerPageOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterOptionRef, filterOrderRef, userPerPageOptionRef]);

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
                    onClick={() => handleChooseFilterOption("id")}
                    className={filterOption === "id" ? "selected" : ""}
                  >
                    ID
                  </li>
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
          </div>
        </div>
        <div className="adminUsersFilter">
          <ul>
            <li
              className={option === "all" ? "all active" : "all"}
              id="all"
              onClick={(e) =>
                handleChangeUserType(e, currentPage, setOption, history)
              }
            >
              All
            </li>
            <li
              className={option === "customer" ? "inStock active" : "inStock"}
              id="customer"
              onClick={(e) =>
                handleChangeUserType(e, currentPage, setOption, history)
              }
            >
              Customer
            </li>
            <li
              className={
                option === "store" ? "outOfStock active" : "outOfStock"
              }
              id="store"
              onClick={(e) =>
                handleChangeUserType(e, currentPage, setOption, history)
              }
            >
              Store
            </li>
            <li
              className={
                option === "delivery-partner"
                  ? "outOfStock active"
                  : "outOfStock"
              }
              id="delivery-partner"
              onClick={(e) =>
                handleChangeUserType(e, currentPage, setOption, history)
              }
            >
              Delivery Partner
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
                      flex: "2",
                      justifyContent: "flex-start",
                    }}
                  >
                    <span style={{ paddingLeft: "80px" }}>Name</span>
                  </th>
                  <th
                    style={{
                      flex: "2",
                      justifyContent: "flex-start",
                    }}
                  >
                    <span style={{ paddingLeft: "10px" }}>Email</span>
                  </th>

                  <th
                    style={{
                      flex: "2",
                    }}
                  >
                    Addresses
                  </th>
                  <th style={{ flex: "1.2" }}>Created At</th>
                  <th>Role</th>
                  <th>Locked</th>
                  <th style={{ flex: "0.5"}}></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <th
                      style={{ flex: "0.4" }}
                      onClick={() => handleSeeDetail(user)}
                    >
                      {user.id}
                    </th>
                    <th
                      style={{
                        flex: "2",
                      }}
                      onClick={() => handleSeeDetail(user)}
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
                        <img src={user.avatar} className="userImage" alt="" />
                        <span>{user.name}</span>
                      </div>
                    </th>
                    <th
                      style={{
                        flex: "2",
                      }}
                      onClick={() => handleSeeDetail(user)}
                    >
                      <div
                        className="container"
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        {user.email}
                      </div>
                    </th>

                    <th
                      style={{
                        flex: "2",
                      }}
                      onClick={() => handleSeeDetail(user)}
                    >
                      <div className="container">
                        {user.addresses?.length > 0
                          ? user.addresses[0]
                          : "No address"}
                      </div>
                    </th>
                    <th
                      style={{ flex: "1.2" }}
                      onClick={() => handleSeeDetail(user)}
                    >
                      <div className="container">
                        {formatDate(user.createdAt)}
                      </div>
                    </th>
                    <th onClick={() => handleSeeDetail(user)}>
                      <div className="container">
                        {user.role === "DELIVERY_PARTNER" ||
                        user.role === "DELIVERY-PARTNER"
                          ? "DELIVERY"
                          : user.role}
                      </div>
                    </th>
                    <th onClick={() => handleSeeDetail(user)}>
                      <div className="container">
                        {user.locked ? "True" : "False"}
                      </div>
                    </th>
                    <th style={{ flex: "0.5"}}>
                      <div className="container">
                        {user.locked ? (
                          <div
                            className="userOperationIcon"
                            onClick={() => {
                              setSelectedUser(user);
                              setPopupType("unlockUser");
                              setOpenPopup(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faLockOpen} />
                          </div>
                        ) : (
                          <div
                            className="userOperationIcon"
                            onClick={() => {
                              setSelectedUser(user);

                              setPopupType("lockUser");
                              setOpenPopup(true);
                            }}
                          >
                            <FontAwesomeIcon icon={faLock} />
                          </div>
                        )}
                      </div>
                    </th>
                  </tr>
                ))}
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
                    setOpenUserPerPageOptions(!openUserPerPageOptions)
                  }
                  ref={userPerPageOptionRef}
                >
                  <span>{`${userPerPage}/page`}</span>
                  <FontAwesomeIcon
                    icon={faChevronUp}
                    className={
                      openUserPerPageOptions
                        ? "openOption rotate"
                        : "openOption"
                    }
                  />
                </div>

                <div
                  className={"productPerPageOptions"}
                  style={{
                    border: openUserPerPageOptions ? "1px solid #ccc" : "none",
                  }}
                >
                  <ul className={openUserPerPageOptions ? "open" : ""}>
                    <li
                      onClick={() =>
                        handleChangeUserPerPage(
                          10,
                          setUserPerPage,
                          setOpenUserPerPageOptions,
                          setCurrentPage
                        )
                      }
                      className={userPerPage === 10 ? "selected" : ""}
                    >
                      10
                    </li>
                    <li
                      onClick={() =>
                        handleChangeUserPerPage(
                          20,
                          setUserPerPage,
                          setOpenUserPerPageOptions,
                          setCurrentPage
                        )
                      }
                      className={userPerPage === 20 ? "selected" : ""}
                    >
                      20
                    </li>
                    <li
                      onClick={() =>
                        handleChangeUserPerPage(
                          30,
                          setUserPerPage,
                          setOpenUserPerPageOptions,
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

      <AdminPopup
        open={openPopup}
        setOpen={setOpenPopup}
        popupType={popupType}
        user={selectedUser}
        refetchUsers={fetchUsers}
      />

      <AdminSeeDetail
        user={selectedUser}
        open={openAdminSeeDetail}
        setOpen={setOpenAdminSeeDetail}
      />
    </div>
  );
};

export default AdminAllUsers;
