import React, { useContext, useState } from "react";
import "./productReview.css";
import ReactStars from "react-rating-stars-component";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import Image1 from "../../../images/arknova3.jpg"
import Image2 from "../../../images/arknova4.webp"


const ProductReview = ({ review }) => {
  const { currentUser, BACKEND_URL } = useContext(AuthContext);
  const toast = useToast();
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedDate = `${year}-${padNumber(month)}-${padNumber(
      day
    )} | ${padNumber(hours)}:${padNumber(minutes)}`;
    return formattedDate;
  }

  function padNumber(number) {
    return number.toString().padStart(2, "0");
  }

  return (
    <li>
      <div className="reviewLeft">
        <img src={currentUser ? currentUser.avatar : ""} alt="" />
      </div>
      <div className="reviewRight">
        <div className="customerName">Minh Quan</div>
        <div className="customerVote">
          <ReactStars
            count={5}
            size={24}
            value={review.rating}
            edit={false}
            activeColor="#ffd700"
          />
        </div>
        <div className="reviewDate">{formatDate(review.createdAt)}</div>
        <div className="customerReview">{review.comment}</div>
        <div className="customerImages">
          <img src={Image1} alt="" />
          <img src={Image2} alt="" />

        </div>
      </div>
    </li>
  );
};

export default ProductReview;
