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
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [filterOption, setFilterOption] = useState("sold");
  const [filterOrder, setFilterOrder] = useState("desc");
  const [openFilterOrder, setOpenFilterOrder] = useState(false);
  const storeId = location.pathname.split("/")[2];
  const fetchStoreProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/products?storeId=${storeId.toString()}&filter=${filterOption}&sortBy=${filterOrder}`
      );
      setProducts(data.data.content);
      setTotalPages(data.data.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  console.log(products);
  useEffect(() => {
    fetchStoreProducts();
  }, [storeId, filterOption, filterOrder]);

  return (
    <div className="store">
      <div className="storeContainer">
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
                  onClick={() =>
                    setOpenFilterOrder(!openFilterOrder)
                  }
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
            {loading && (
              <div className="partialLoading">
                <div className="lds-ellipsis">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
            )}
            {!loading && (
              <ul>
                {products.map((product) => (
                  <SingleProduct product={product} />
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
