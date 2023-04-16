import React, { useContext, useEffect, useRef, useState } from "react";
import "./adminAllProducts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import {
  handleChangeProductPerPage,
  handleClickPrev,
  handleClickNext,
} from "./adminAllProductsLogic";
import StarRatings from "react-star-ratings";

import { formatNumber, capitalize } from "../../longFunctions";
import { StoreContext } from "../../../context/StoreContext";
import AdminSeeDetail from "../AdminSeeDetail/AdminSeeDetail";
import AdminPopup from "../AdminPopup/AdminPopup";

const AdminAllProducts = () => {
  const history = useHistory();
  const { BACKEND_URL, config } = useContext(AuthContext);
  const { option } = useContext(StoreContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [popupType, setPopupType] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openAdminSeeDetail, setOpenAdminSeeDetail] = useState(false);
  const [openFilterCategory, setOpenFilterCategory] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const [openFilterOptions, setOpenFilterOptions] = useState(false);
  const [openFilterOrder, setOpenFilterOrder] = useState(false);
  const pageIndex = Math.floor(useHistory().location.search.split("=")[1]);
  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [openProductPerPageOptions, setOpenProductPerPageOptions] =
    useState(false);
  const [productPerPage, setProductPerPage] = useState(20);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOption, setFilterOption] = useState("id");
  const [filterOrder, setFilterOrder] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("all");
  const productRef = useRef();
  const deleteIcon = useRef();
  const filterOptionRef = useRef();
  const filterOrderRef = useRef();
  const filterCategoryRef = useRef();
  const productPerPageOptionRef = useRef();
  const toast = useToast();

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/product-categories`);
      setCategories(data.data);
    } catch (error) {}
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/products?page=${
          currentPage - 1
        }&elementsPerPage=${productPerPage}&role=${option.toUpperCase()}&sortBy=${filterOrder}&filter=${filterOption}&status=UNLOCKED&category=${filterCategory.toLowerCase()}`,
        config
      );
      setProducts(data.data.content);
      setTotalPages(data.data.totalPages);

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

  const handleChooseCategoryFilter = (category) => {
    setFilterCategory(category);
    setOpenFilterCategory(false);
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

  const handleSeeDetail = (product) => {
    setSelectedProduct(product);
    setOpenAdminSeeDetail(true);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}-${padNumber(month)}-${padNumber(day)}`;
    return formattedDate;
  };

  const padNumber = (number) => {
    return number.toString().padStart(2, "0");
  };

  useEffect(() => {
    fetchProducts();
  }, [
    productPerPage,
    currentPage,
    filterOption,
    filterOrder,
    option,
    filterCategory,
  ]);

  useEffect(() => {
    history.push(`/admin/products?pages=${currentPage}`);
  }, [currentPage]);

  useEffect(() => {
    fetchCategories();
  }, []);
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
        productPerPageOptionRef.current &&
        !productPerPageOptionRef.current.contains(event.target)
      ) {
        setOpenProductPerPageOptions(false);
      }
      if (
        filterCategoryRef.current &&
        !filterCategoryRef.current.contains(event.target)
      ) {
        setOpenFilterCategory(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    filterOptionRef,
    filterOrderRef,
    productPerPageOptionRef,
    filterCategoryRef,
  ]);

  return (
    <div className="adminAllProducts">
      <div className="adminAllProductsContainer">
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
            <div className="filterSelect">
              <h2>Category</h2>
              <div
                className="filterSelectItem"
                onClick={() => setOpenFilterCategory(!openFilterCategory)}
                ref={filterCategoryRef}
              >
                <span>{capitalize(filterCategory.toLowerCase())}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={
                    openFilterCategory ? "openOption rotate" : "openOption"
                  }
                />
                <ul
                  className={
                    openFilterCategory ? "filterOptions open" : "filterOptions"
                  }
                  style={{
                    border: openFilterCategory ? "1px solid #ccc" : "none",
                  }}
                >
                  <li
                    onClick={() =>
                      handleChooseCategoryFilter(capitalize("all"))
                    }
                    className={filterCategory === `All` ? "selected" : ""}
                  >
                    All
                  </li>
                  {categories.map((category, i) => (
                    <li
                      key={i}
                      onClick={() =>
                        handleChooseCategoryFilter(
                          capitalize(category.toLowerCase())
                        )
                      }
                      className={
                        filterCategory ===
                        `${capitalize(category.toLowerCase())}`
                          ? "selected"
                          : ""
                      }
                    >
                      {capitalize(category.toLowerCase())}
                    </li>
                  ))}
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
          <div className="adminProducts">
            <table>
              <thead>
                <tr>
                  <th style={{ flex: "0.4" }}>ID</th>
                  <th
                    style={{
                      flex: "2.8",
                      justifyContent: "flex-start",
                    }}
                  >
                    <span style={{ paddingLeft: "70px" }}>Product Name</span>
                  </th>
                  <th
                    style={{
                      justifyContent: "flex-start",
                      display: "flex",
                    }}
                  >
                    <span style={{ paddingLeft: "30px" }}>Price</span>
                  </th>

                  <th
                    style={{
                      flex: "2",
                      justifyContent: "flex-start",
                      display: "flex",
                    }}
                  >
                    <span style={{ paddingLeft: "70px" }}>Store</span>
                  </th>
                  <th style={{ flex: "1.2" }}>Category</th>
                  <th style={{ flex: "1.2" }}>Created At</th>
                  <th>Rating</th>
                  <th style={{ flex: "0.5"}}></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <th
                      style={{ flex: "0.4" }}
                      onClick={() => handleSeeDetail(product)}
                    >
                      {product.id}
                    </th>
                    <th
                      style={{
                        flex: "2.8",
                      }}
                      onClick={() => handleSeeDetail(product)}
                    >
                      <div
                        className="container"
                        style={{
                          justifyContent: "flex-start",
                          display: "flex",
                          gap: "10px",
                        }}
                      >
                        <img
                          src={product.images[0]}
                          className="productImage"
                          alt=""
                        />
                        <span>{product.name}</span>
                      </div>
                    </th>
                    <th onClick={() => handleSeeDetail(product)}>
                      <div
                        className="container"
                        style={{
                          justifyContent: "flex-start",
                          display: "flex",
                        }}
                      >
                        <span className="price-symbol">₫</span>
                        {formatNumber(product.price)}
                      </div>
                    </th>

                    <th
                      style={{
                        flex: "2",
                      }}
                      onClick={() => handleSeeDetail(product)}
                    >
                      <div
                        className="container"
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          gap: "10px",
                        }}
                      >
                        <img src={product.store.avatar} alt="" />
                        <span>{product.store.name}</span>
                      </div>
                    </th>
                    <th
                      style={{ flex: "1.2" }}
                      onClick={() => handleSeeDetail(product)}
                    >
                      {capitalize(product.category)}
                    </th>
                    <th
                      style={{ flex: "1.2" }}
                      onClick={() => handleSeeDetail(product)}
                    >
                      <div className="container">
                        {formatDate(product.createdAt)}
                      </div>
                    </th>
                    <th onClick={() => handleSeeDetail(product)}>
                      <div className="container">
                        <StarRatings
                          rating={product.rating}
                          starRatedColor="#ffd700"
                          numberOfStars={5}
                          name="rating"
                          starDimension="15px"
                          starSpacing="0px"
                        />
                      </div>
                    </th>

                    <th style={{ flex: "0.2"}}>
                      <div className="container">
                        <div
                          className="productOperationIcon"
                          onClick={() => {
                            setSelectedProduct(product);
                            setPopupType("deleteProduct");
                            setOpenPopup(true);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </div>
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
                className="adminPrevButton"
                onClick={() => handleClickPrev(setCurrentPage, totalPages)}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
              <span>{`${currentPage}/${
                totalPages !== 0 ? totalPages : 1
              }`}</span>
              <div
                className="adminNextButton"
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
                  <span>{`${productPerPage}/page`}</span>
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
                          setProductPerPage,
                          setOpenProductPerPageOptions,
                          setCurrentPage
                        )
                      }
                      className={productPerPage === 10 ? "selected" : ""}
                    >
                      10
                    </li>
                    <li
                      onClick={() =>
                        handleChangeProductPerPage(
                          20,
                          setProductPerPage,
                          setOpenProductPerPageOptions,
                          setCurrentPage
                        )
                      }
                      className={productPerPage === 20 ? "selected" : ""}
                    >
                      20
                    </li>
                    <li
                      onClick={() =>
                        handleChangeProductPerPage(
                          30,
                          setProductPerPage,
                          setOpenProductPerPageOptions,
                          setCurrentPage
                        )
                      }
                      className={productPerPage === 30 ? "selected" : ""}
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
        product={selectedProduct}
        refetchProducts={fetchProducts}
      />
      <AdminSeeDetail
        product={selectedProduct}
        open={openAdminSeeDetail}
        setOpen={setOpenAdminSeeDetail}
      />
    </div>
  );
};

export default AdminAllProducts;
