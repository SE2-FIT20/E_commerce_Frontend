import React, { useContext, useState } from "react";
import "./productReview.css";
import ReactStars from "react-rating-stars-component";
import { AuthContext } from "../../../context/AuthContext";

const ProductReview = () => {
  const { currentUser} = useContext(AuthContext)
  return (
    <li>
      <div className="reviewLeft">
        <img
          src={currentUser? currentUser.avatar : ""}
          alt=""
        />
      </div>
      <div className="reviewRight">
        <div className="customerName">Minh Quan</div>
        <div className="customerVote">
          <ReactStars
            count={5}
            size={24}
            value={4}
            edit={false}
            activeColor="#ffd700"
          />
        </div>
        <div className="customerReview">nhu cut'</div>
        <div className="customerImages"></div>
      </div>
    </li>
  );
};

export default ProductReview;
