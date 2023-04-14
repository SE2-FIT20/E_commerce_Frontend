import React from "react";
import { useHistory } from "react-router-dom";
import { formatNumber } from "../../longFunctions";
import StarRatings from "react-star-ratings";

import "./singleProduct.css";

const SingleProduct = ({ product, search }) => {
  const history = useHistory();
  return (
    <li
      className="singleProduct"
      key={product.id}
      onClick={() => {
        history.push(`/product/${product.id}`);
        window.scrollTo(0, 0);
      }}
    >
      <div className="singleProductImageContainer">
        <img
          src={product.images[0]}
          alt="singleProduct"
          className="singleProductImage"
        />
      </div>

      <div className="singleProductInfo">
        <div className="singleProductTitle">
          <h2 className="singleProductName">{`${product.name.substring(
            0,
            50
          )} ${product.name.length > 50 ? "..." : ""}`}</h2>
        </div>
        <span className="singleProductPrice">{`đ${formatNumber(
          product.price
        )}`}</span>
        {!search && (
          <span className="singleProductDesc">
            {`${product.description.substring(0, 55)}${
              product.description.length > 55 ? "..." : ""
            }`}
          </span>
        )}
        {search && <span className="singleProductCity">Ha Noi</span>}
        <div className="singleProductRating" style={{ bottom: search ? "30px" : "0"}}>
          <div className="singleProductStar">
            <StarRatings
              rating={product.rating}
              starRatedColor="#ffd700"
              numberOfStars={5}
              name="rating"
              starDimension="14px"
              starSpacing="0px"
            />
            <span>{`(${product.reviewNum})`}</span>
          </div>

          <span>{`${product.sold} sold`}</span>
        </div>
      </div>
      <div className="favoriteText">
        <span>Favourite</span>
      </div>
    </li>
  );
};

export default SingleProduct;
