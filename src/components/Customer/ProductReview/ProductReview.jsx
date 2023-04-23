import React, { useContext, useState, useEffect, useRef } from "react";
import "./productReview.css";
import ReactStars from "react-rating-stars-component";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import AddReviewImage from "../AddReviewImage/AddReviewImage";

const ProductReview = ({ review, fetchReviews }) => {
  const { currentUser, BACKEND_URL, config } = useContext(AuthContext);
  const toast = useToast();
  const [updatedReview, setUpdatedReview] = useState({
    comment: review.comment,
    rating: review.rating,
    images: review.images,
  });
  const [newImages, setNewImages] = useState([]);
  const isOwnReview = currentUser
    ? currentUser.id === review.customer.id
    : false;
  const [openReviewButton, setOpenReviewButton] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const reviewRef = useRef();
  const disableUpdateReview =
    updatedReview.comment === review.comment &&
    updatedReview.rating === review.rating &&
    updatedReview.images === review.images &&
    newImages.length === 0;

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

  const handleUpdateReview = async () => {
    if (disableUpdateReview) {
      console.log("unable");
      return;
    }
    if (newImages.length > 0) {
      let images = [];

      const promises = newImages.map(async (pic) => {
        const data = new FormData();
        data.append(`file`, pic);
        data.append("upload_preset", "MQSocial");
        data.append("cloud_name", "dvvyj75uf");
        try {
          const response = await fetch(
            "https://api.cloudinary.com/v1_1/dvvyj75uf/image/upload",
            {
              method: "post",
              body: data,
            }
          );
          const json = await response.json();
          return json.url.toString();
        } catch (error) {
          toast({
            title: "Error uploading images!",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }
      });
      images = await Promise.all(promises);
      try {
        await axios.put(
          `${BACKEND_URL}/api/customer/review/${review.id}`,
          {
            ...updatedReview,
            images: [...updatedReview.images, ...images],
          },
          config
        );
        toast({
          title: "Update review successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setIsEditing(false);
        fetchReviews();
      } catch (error) {}
    } else {
      try {
        await axios.put(
          `${BACKEND_URL}/api/customer/review/${review.id}`,
          {
            ...updatedReview,
          },
          config
        );
        toast({
          title: "Update review successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setIsEditing(false);
        fetchReviews();
      } catch (error) {}
    }
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
      onMouseLeave={() => (isOwnReview ? setOpenReviewButton(false) : null)}
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
                onChange={(rating) =>
                  setUpdatedReview((prev) => ({
                    ...prev,
                    rating,
                  }))
                }
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
              value={updatedReview.comment}
              className="editReviewInput"
              onChange={(e) =>
                setUpdatedReview({ ...updatedReview, comment: e.target.value })
              }
            />
          )}
          {!isEditing && <div className="customerReview">{review.comment}</div>}
          {!isEditing && (
            <div className="customerImages">
              {review.images.map((image, i) => (
                <img src={image} key={i} />
              ))}
            </div>
          )}
          {isEditing && (
            <>
              <div className="customerImages">
                {updatedReview.images.slice(0, 10).map((image, i) => (
                  <AddReviewImage
                    uploadedImage={image}
                    key={i}
                    writeReview={updatedReview}
                    setWriteReview={setUpdatedReview}
                  />
                ))}
                {newImages.slice(0, 10).map((image, i) => (
                  <AddReviewImage
                    newImage={image}
                    key={i}
                    newImages={newImages}
                    setNewImages={setNewImages}
                  />
                ))}
                <label htmlFor="file">
                  <div className="addImage">
                    <FontAwesomeIcon icon={faImage} className="addImageIcon" />
                    <span>{`Add image (${
                      updatedReview.images.length > 10
                        ? 10
                        : updatedReview.images.length
                    }/10)`}</span>
                  </div>
                  <input
                    type="file"
                    name=""
                    id="file"
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    style={{ display: "none" }}
                    disabled={
                      updatedReview.images.length + newImages.length >= 10
                    }
                    onChange={(e) =>
                      setNewImages(() => [...newImages, ...e.target.files])
                    }
                  />
                </label>
              </div>
              <button
                className="button"
                style={{ marginTop: "10px" }}
                onClick={handleUpdateReview}
              >
                Update
              </button>
            </>
          )}
        </div>
      </div>
      {openReviewButton && (
        <div className="reviewOptions">
          <div
            className="reviewButton"
            onClick={() => setIsEditing(!isEditing)}
            style={{ backgroundColor: isEditing && "#f0f2f5" }}
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
