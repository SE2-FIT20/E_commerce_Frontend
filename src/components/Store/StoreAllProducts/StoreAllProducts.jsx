import React, { useContext, useEffect, useRef, useState } from "react";
import "./storeAllProducts.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faPen,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import NoItem from "../../../images/no-product.webp";

import { formatNumber, capitalize } from "../../longFunctions";
import { useToast } from "@chakra-ui/react";
import {
  handleChangeProductPerPage,
  handleChangeStockType,
  handleClickPrev,
  handleClickNext,
  handleDisplayFilterOption,
  deleteProduct,
} from "./storeAllProductsLogic";

const Storepage = () => {
  const history = useHistory();
  const { BACKEND_URL, config, currentUser } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [stockType, setStockType] = useState(
    useHistory().location.pathname.split("/")[3]
  );
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [openFilterOptions, setOpenFilterOptions] = useState(false);
  const [openFilterOrder, setOpenFilterOrder] = useState(false);
  const [openFilterCategory, setOpenFilterCategory] = useState(false);
  const [productToDelete, setProductToDelete] = useState(0);
  const pageIndex = Math.floor(useHistory().location.search.split("=")[1]);
  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [openProductPerPageOptions, setOpenProductPerPageOptions] =
    useState(false);
  const [productPerPage, setProductPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [filterOption, setFilterOption] = useState("createdAt");
  const [filterOrder, setFilterOrder] = useState("desc");
  const [filterCategory, setFilterCategory] = useState("all");
  const confirmDelete = useRef();
  const filterOptionRef = useRef();
  const filterOrderRef = useRef();
  const productPerPageOptionRef = useRef();
  const toast = useToast();
  const fetchProducts = async () => {
    try {
      setLoading(true);
      if (stockType === "all") {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/products?storeId=${
            currentUser.id
          }&elementsPerPage=${productPerPage}&page=${
            currentPage - 1
          }&filter=${filterOption}&sortBy=${filterOrder}&status=ALL&category=${filterCategory.toLowerCase()}`,
          config
        );
        setProducts(data.data.content);
        setTotalPages(data.data.totalPages);
      } else if (stockType === "active") {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/products?&storeId=${
            currentUser.id
          }&status=available&elementsPerPage=${productPerPage}&page=${
            currentPage - 1
          }&filter=${filterOption}&sortBy=${filterOrder}&category=${filterCategory.toLowerCase()}`,
          config
        );
        setProducts(data.data.content);
        setTotalPages(data.data.totalPages);
      } else {
        const { data } = await axios.get(
          `${BACKEND_URL}/api/products?&storeId=${
            currentUser.id
          }&status=sold_out&elementsPerPage=${productPerPage}&page=${
            currentPage - 1
          }&filter=${filterOption}&sortBy=${filterOrder}&category=${filterCategory.toLowerCase()}`,
          config
        );
        setProducts(data.data.content);
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
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/product-categories`);
      setCategories(data.data);
    } catch (error) {}
  };

  const handleChooseFilterOption = (option) => {
    setFilterOption(option);
    setOpenFilterOptions(false);
  };

  const handleChooseCategoryFilter = (category) => {
    setFilterCategory(category);
    setOpenFilterCategory(false);
  };

  useEffect(() => {
    fetchProducts();
  }, [
    productPerPage,
    currentPage,
    filterOption,
    filterOrder,
    stockType,
    filterCategory,
  ]);

  useEffect(() => {
    history.push(`/store/product/${stockType}?pages=${currentPage}`);
  }, [currentPage, stockType, history]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
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
        filterOptionRef.current &&
        !filterOptionRef.current.contains(event.target)
      ) {
        setOpenFilterOptions(false);
      }
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
  }, [filterOptionRef, filterOrderRef, productPerPageOptionRef, confirmDelete]);

  return (
    <div className="storeAllProducts">
      <div className="storeAllProductsContainer">
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
                    onClick={() => handleChooseFilterOption("name")}
                    className={filterOption === "name" ? "selected" : ""}
                  >
                    Name
                  </li>
                  <li
                    onClick={() => handleChooseFilterOption("price")}
                    className={filterOption === "price" ? "selected" : ""}
                  >
                    Price
                  </li>
                  <li
                    onClick={() => handleChooseFilterOption("quantity")}
                    className={filterOption === "quantity" ? "selected" : ""}
                  >
                    Quantity
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
                ref={filterOptionRef}
              >
                <span>{capitalize(filterCategory.toLowerCase())}</span>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={
                    openFilterOptions ? "openOption rotate" : "openOption"
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
                  {categories.map((category) => (
                    <li
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
        <div className="storeProductsFilter">
          <ul>
            <li
              className={stockType === "all" ? "all active" : "all"}
              id="all"
              onClick={(e) =>
                handleChangeStockType(e, currentPage, setStockType, history)
              }
            >
              All
            </li>
            <li
              className={stockType === "active" ? "inStock active" : "inStock"}
              id="active"
              onClick={(e) =>
                handleChangeStockType(e, currentPage, setStockType, history)
              }
            >
              In stock
            </li>
            <li
              className={
                stockType === "soldout" ? "outOfStock active" : "outOfStock"
              }
              id="soldout"
              onClick={(e) =>
                handleChangeStockType(e, currentPage, setStockType, history)
              }
            >
              Out of stock
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
          <div className="storeProducts">
            <table>
              <thead>
                <tr>
                  <th
                    style={{
                      flex: "3.5",
                      justifyContent: "flex-start",
                      paddingLeft: "10px",
                    }}
                  >
                    Name
                  </th>
                  <th style={{ flex: "2" }}>Category</th>
                  <th style={{ flex: "1.5" }}>Price</th>
                  <th style={{ flex: "1.2" }}>In stock</th>
                  <th style={{ flex: "1.2" }}>Sales</th>
                  <th style={{ flex: "1.2" }}>Operation</th>
                </tr>
              </thead>
              {products.length > 0 && (
                <tbody>
                  {products.map((product, i) => (
                    <tr key={i}>
                      <th
                        style={{
                          display: "flex",
                          flex: "3.5",
                          gap: "15px",
                          alignItems: "flex-start",
                          justifyContent: "flex-start",
                          paddingLeft: "10px",
                        }}
                      >
                        <img
                          src={product.images[0]}
                          alt=""
                          className="productImage"
                        />
                        <span
                          className="productName"
                          onClick={() =>
                            history.push(`/store/product/${product.id}`)
                          }
                        >
                          {product.name}
                        </span>
                      </th>
                      <th style={{ flex: "2", textAlign: "center" }}>
                        <div className="container">
                          {product.category === "CARS_MOTORBIKES"
                            ? "CARS & MOTORBIKES"
                            : product.category}
                        </div>
                      </th>
                      <th style={{ flex: "1.5" }}>
                        <div className="container">
                          <span className="price-symbol">₫</span>
                          {formatNumber(product.price)}
                        </div>
                      </th>
                      <th style={{ flex: "1.2" }}>
                        <div
                          className="container"
                          style={{
                            color: product.quantity === 0 ? "red" : "#000",
                            fontWeight:
                              product.quantity === 0 ? "600" : "normal",
                          }}
                        >
                          {product.quantity === 0
                            ? "Soldout"
                            : product.quantity}
                        </div>
                      </th>
                      <th style={{ flex: "1.2" }}>
                        <div className="container">{product.sold}</div>
                      </th>
                      <th style={{ flex: "1.2" }}>
                        <div className="container productButtons">
                          <div
                            className="productButtonContainer"
                            onClick={() =>
                              history.push(
                                `/store/product/update/${product.id}`
                              )
                            }
                          >
                            <FontAwesomeIcon icon={faPen} />
                          </div>
                          <div
                            className="productButtonContainer"
                            onClick={() => {
                              setOpenConfirmDelete(true);
                              setProductToDelete(product.id);
                            }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </div>
                        </div>
                      </th>
                    </tr>
                  ))}
                </tbody>
              )}
              {products.length === 0 && (
                <tbody
                  style={{
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <tr
                    className="noItem"
                    style={{ width: "100%", border: "none" }}
                  >
                    <th>
                      <img src={NoItem} alt="" className="noItem" />

                      <div className="noItemText">
                        <h2>No Items Found!</h2>
                        <span>Sorry... No items found inside your card</span>
                      </div>
                    </th>
                  </tr>
                </tbody>
              )}
            </table>
          </div>
        )}
        <div className="productNav">
          <div className="productNavContainer">
            <div className="productNavBtn">
              <div
                className="productPrevButton"
                onClick={() => handleClickPrev(setCurrentPage, totalPages)}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
              <span>{`${currentPage}/${
                totalPages !== 0 ? totalPages : 1
              }`}</span>
              <div
                className="productNextButton"
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
                  <span>{`${productPerPage} products/page`}</span>
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
                      onClick={() => {
                        console.log(20);

                        handleChangeProductPerPage(
                          20,
                          setProductPerPage,
                          setOpenProductPerPageOptions,
                          setCurrentPage
                        );
                      }}
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

      <div
        className={openConfirmDelete ? "confirmDelete" : "confirmDelete hide"}
      >
        <div className="confirmDeleteContainer" ref={confirmDelete}>
          <div className="deleteTitle">
            <span>Are you sure you want to delete this product?</span>
          </div>
          <div className="deleteBtnContainer">
            <button
              className="button"
              onClick={() =>
                deleteProduct(
                  productToDelete,
                  fetchProducts,
                  setOpenConfirmDelete,
                  BACKEND_URL,
                  config,
                  toast
                )
              }
            >
              Yes
            </button>
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

export default Storepage;
