import React, { useContext, useState, useEffect } from "react";
import "./store.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useLocation } from "react-router-dom";
import SingleProduct from "../SingleProduct/SingleProduct";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronCircleDown,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";

const Store = () => {
  const { BACKEND_URL } = useContext(AuthContext);
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [productLoading, setProductLoading] = useState(false);
  const [filterOption, setFilterOption] = useState("sold");
  const [filterOrder, setFilterOrder] = useState("desc");
  const [openFilterOrder, setOpenFilterOrder] = useState(false);
  const storeId = location.pathname.split("/")[2];

  const fetchStore = async () => {
    try {
      setLoading(true);
      const response1 = await axios.get(
        `${BACKEND_URL}/api/store-information/${storeId}`
      );
      setStore(response1.data.data);
      const response2 = await axios.get(
        `${BACKEND_URL}/api/products?storeId=${storeId.toString()}&filter=${filterOption}&sortBy=${filterOrder}`
      );
      setProducts(response2.data.data.content);
      setTotalPages(response2.data.data.totalPages);

      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setProductLoading(true);

      const response = await axios.get(
        `${BACKEND_URL}/api/products?storeId=${storeId.toString()}&filter=${filterOption}&sortBy=${filterOrder}`
      );
      setProducts(response.data.data.content);
      setTotalPages(response.data.data.totalPages);

      setProductLoading(false);
    } catch (error) {
      setProductLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filterOption, filterOrder]);
  useEffect(() => {
    fetchStore();
  }, [storeId]);

  return (
    <div className="store">
      {!loading && (
        <div className="storeContainer">
          {store && (
            <div className="storeInfo">
              <div className="storeInfoLeft">
                <img src={store.avatar} alt="" />
                <div className="storeName">
                  <h2>{store.name}</h2>
                  <span>{store.description ? store.description : "Store description.."}</span>
                </div>
              </div>
            </div>
          )}
          <div className="storeProducts">
            <div className="filterSection">
              <span>Filtered by</span>
              <ul>
                <li>
                  <button
                    className={filterOption === "sold" ? "selected" : ""}
                    onClick={() => setFilterOption("sold")}
                  >
                    Popularity
                  </button>
                </li>
                <li>
                  <button
                    className={filterOption === "createdAt" ? "selected" : ""}
                    onClick={() => setFilterOption("createdAt")}
                  >
                    Latest
                  </button>
                </li>
                <li>
                  <button
                    className={filterOption === "price" ? "selected" : ""}
                    onClick={() => setFilterOption("price")}
                  >
                    Price
                  </button>
                </li>
                <li>
                  <button
                    className="filterOrder"
                    onClick={() => setOpenFilterOrder(!openFilterOrder)}
                    style={{ position: "relative" }}
                  >
                    <span>{filterOrder === "asc" ? "A-Z" : "Z-A"}</span>
                    <FontAwesomeIcon icon={faChevronDown} />
                    <ul
                      className={
                        openFilterOrder ? "filterOptions open" : "filterOptions"
                      }
                      style={{
                        border: openFilterOrder ? "1px solid #ccc" : "none",
                      }}
                    >
                      <li onClick={() => setFilterOrder("asc")}>A-Z</li>
                      <li onClick={() => setFilterOrder("desc")}>Z-A</li>
                    </ul>
                  </button>
                </li>
              </ul>
            </div>
            <div className="storeProductsDisplay">
              {!productLoading && (
                <ul>
                  {products.map((product) => (
                    <SingleProduct product={product} />
                  ))}
                </ul>
              )}
              {productLoading && (
                <div className="partialLoading">
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
  );
};

export default Store;
