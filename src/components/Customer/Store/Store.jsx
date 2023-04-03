import React, { useContext, useState, useEffect } from "react";
import "./store.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { useLocation } from "react-router-dom";
import SingleProduct from "../SingleProduct/SingleProduct";

const Store = () => {
  const { BACKEND_URL } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const location = useLocation();
  const storeId = location.pathname.split("/")[2];
  const fetchStoreProducts = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/products/${storeId.toString()}`
      );
      setProducts(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (error) {}
  };
  console.log(products);
  useEffect(() => {
    fetchStoreProducts();
  }, [storeId]);
  return (
    <div className="store">
      <div className="storeContainer">
        <div className="storeProducts">
          <div className="filterSection">
            <span>Filtered by</span>
            <ul>
              <li>
                <button className="selected">Popularity</button>
              </li>
              <li>
                <button>Latest</button>
              </li>
              <li>
                <button>Price</button>
              </li>
            </ul>
          </div>
          <div className="storeProductsDisplay">
            <ul>
              {products.map((product) => (
                <SingleProduct product={product}/>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Store;
