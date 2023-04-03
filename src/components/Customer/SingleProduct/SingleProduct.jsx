import React from "react";
import { useHistory } from "react-router-dom";
import { formatNumber } from "../../longFunctions";
import "./singleProduct.css";

const SingleProduct = ({ product }) => {
  const history = useHistory();
  return (
    <li
      className="singleProduct"
      key={product.id}
      onClick={() => {history.push(`/product/${product.id}`); window.scrollTo(0, 0)}}
    >
      <img src={product.images[0]} alt="singleProduct" className="singleProductImage" />
      <div className="singleProductInfo">
        <div className="singleProductTitle">
          <h2 className="singleProductName">{`${product.name.substring(0, 35)} ${
            product.name.length > 35 ? "..." : ""
          }`}</h2>
        </div>
        <span className="singleProductPrice">{`đ${formatNumber(
          product.price
        )}`}</span>

        <span className="singleProductDesc">
          {`${product.description.substring(0, 60)}${
            product.description.length > 60 ? "..." : ""
          }`}
        </span>
      </div>
    </li>
  );
};

export default SingleProduct;
