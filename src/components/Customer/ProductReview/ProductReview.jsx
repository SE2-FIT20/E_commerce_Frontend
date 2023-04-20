import React, { useContext, useState, useEffect, useRef } from "react";
import "./productReview.css";
import ReactStars from "react-rating-stars-component";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

const ProductReview = ({ review }) => {
  const { currentUser, BACKEND_URL } = useContext(AuthContext);
  const toast = useToast();
  console.log(review);
  const isOwnReview = currentUser ? currentUser.id === review.customer.id : false;
  const [openReviewButton, setOpenReviewButton] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const reviewRef = useRef();
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
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (reviewRef.current && !reviewRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [reviewRef]);
  function padNumber(number) {
    return number.toString().padStart(2, "0");
  }

  return (
    <li
      ref={reviewRef}
      onMouseOver={() => (isOwnReview ? setOpenReviewButton(true) : null)}
      onMouseLeave={() => isOwnReview ? setOpenReviewButton(false): null}
    >
      <div className="reviewInfo">
        <div className="reviewLeft">
          <img src={review.customer.avatar} alt="" />
        </div>
        <div className="reviewRight">
          <div className="customerName">{review.customer.name}</div>
          <div className="customerVote">
            {isEditing && (
              <ReactStars
                count={5}
                size={24}
                value={review.rating}
                edit={true}
                activeColor="#ffd700"
              />
            )}
            {!isEditing && (
              <ReactStars
                count={5}
                size={24}
                value={review.rating}
                edit={false}
                activeColor="#ffd700"
              />
            )}
          </div>
          <div className="reviewDate">{formatDate(review.createdAt)}</div>
          {isEditing && (
            <input
              type="text"
              value={review.comment}
              className="editReviewInput"
            />
          )}
          {!isEditing && <div className="customerReview">{review.comment}</div>}
          <div className="customerImages">
            {review.images.map((image, i) => (
              <img src={image} key={i} />
            ))}
          </div>
        </div>
      </div>
      {openReviewButton && (
        <div className="reviewOptions">
          <div
            className="reviewButton"
            onClick={() => setIsEditing(!isEditing)}
          >
            <FontAwesomeIcon icon={faPen} />
          </div>
          <div className="reviewButton">
            <FontAwesomeIcon icon={faTrash} />
          </div>
        </div>
      )}
    </li>
  );
};

export default ProductReview;
