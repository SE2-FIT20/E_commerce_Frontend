import React, { useContext, useEffect, useRef, useState } from "react";
import "./storeAllProducts.css";
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

const Storepage = () => {
  const history = useHistory();
  const location = useLocation();
  const { BACKEND_URL, config } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [stockType, setStockType] = useState(
    useHistory().location.pathname.split("/")[3]
  );
  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [productToDelete, setProductToDelete] = useState(0);
  const pageIndex = Math.floor(useHistory().location.search.split("=")[1]);
  const [currentPage, setCurrentPage] = useState(pageIndex);
  const [productPerPage, setProductPerPage] = useState(10);
  const numOfPages = Math.ceil(products.length / productPerPage);
  const productIndexStart = (currentPage - 1) * productPerPage;
  const productIndexEnd = productIndexStart + productPerPage - 1;
  const handleChangeProductPerPage = (e) => {
    setProductPerPage(Math.floor(e.target.value));
  };
  const confirmDelete = useRef();

  const toast = useToast();

  const handleChangeStockType = (e) => {
    setStockType(e.currentTarget.id);
    history.push(`/store/product/${e.currentTarget.id}?pages=${currentPage}`);
  };
  const handleClickNext = () => {
    setCurrentPage((prev) => (prev === numOfPages ? prev : prev + 1));
  };

  const handleClickPrev = () => {
    setCurrentPage((prev) => (prev === 1 ? prev : prev - 1));
  };

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
  useEffect(() => {
    history.push(`/store/product/${stockType}?pages=${currentPage}`);
  }, [currentPage]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/store/products`,
        config
      );
      setProducts(data.data);
    } catch (error) {
      toast({
        title: "An error occurred fetching products",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const deleteProduct = async () => {
    try {
      await axios.delete(
        `${BACKEND_URL}/api/store/products/${productToDelete.toString()}`,
        config
      );
      toast({
        title: "Delete product successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setOpenConfirmDelete(false);
      fetchProducts();
    } catch (error) {
      toast({
        title: "An error occurred deleting products",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="storeAllProducts">
      <div className="storeAllProductsContainer">
        <div className="storeProductsFilter">
          <ul>
            <li
              className={stockType === "all" ? "all active" : "all"}
              id="all"
              onClick={handleChangeStockType}
            >
              All
            </li>
            <li
              className={stockType === "active" ? "inStock active" : "inStock"}
              id="active"
              onClick={handleChangeStockType}
            >
              In stock
            </li>
            <li
              className={
                stockType === "soldout" ? "outOfStock active" : "outOfStock"
              }
              id="soldout"
              onClick={handleChangeStockType}
            >
              Out of stock
            </li>
          </ul>
        </div>
        <div className="storeProducts">
          <table>
            <thead>
              <tr>
                <th
                  style={{
                    flex: "4",
                    justifyContent: "flex-start",
                    paddingLeft: "10px",
                  }}
                >
                  Product name
                </th>
                <th style={{ flex: "2" }}>Product category</th>
                <th style={{ flex: "2" }}>Price</th>
                <th>In stock</th>
                <th>Sales</th>
                <th>Operation</th>
              </tr>
            </thead>
            <tbody>
              {products
                .slice(productIndexStart, productIndexEnd + 1)
                .map((product, i) => (
                  <tr key={i}>
                    <th
                      style={{
                        display: "flex",
                        flex: "4",
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
                    <th style={{ flex: "2" }}>
                      <div className="container"> {product.category}</div>
                    </th>
                    <th style={{ flex: "2" }}>
                      <div className="container">
                        <span className="price-symbol">₫</span>
                        {formatNumber(product.price)}
                      </div>
                    </th>
                    <th>
                      <div className="container"> {product.quantity}</div>
                    </th>
                    <th>
                      <div className="container">2</div>
                    </th>
                    <th>
                      <div className="container productButtons">
                        <FontAwesomeIcon
                          icon={faPen}
                          onClick={() =>
                            history.push(`/store/product/update/${product.id}`)
                          }
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          onClick={() => {
                            setOpenConfirmDelete(true);
                            setProductToDelete(product.id);
                          }}
                        />
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
                  padding: "15px 0",
                }}
              >
                <td className="productNav">
                  <div className="productNavBtn">
                    <div className="prevBtn" onClick={handleClickPrev}>
                      <FontAwesomeIcon icon={faChevronLeft} />
                    </div>
                    <span>{`${currentPage}/${
                      numOfPages !== 1 / 0 ? numOfPages : 1
                    }`}</span>
                    <div className="nextBtn" onClick={handleClickNext}>
                      <FontAwesomeIcon icon={faChevronRight} />
                    </div>
                  </div>
                  <div className="productPerPage">
                    <div className="productPerPageContainer">
                      <input
                        type="number"
                        value={productPerPage}
                        onChange={handleChangeProductPerPage}
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
              onClick={() => {
                deleteProduct();
              }}
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
