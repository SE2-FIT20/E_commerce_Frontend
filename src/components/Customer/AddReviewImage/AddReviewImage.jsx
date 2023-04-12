import { useState } from "react";
import "./addReviewImage.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddReviewImage = ({ image, index, writeReview, setWriteReview }) => {
  const [openDeleteImg, setOpenDeleteImg] = useState(false);
  return (
    <div
      className="addProductImage"
      onMouseOver={() => setOpenDeleteImg(true)}
      onMouseLeave={() => setOpenDeleteImg(false)}
      key={index}
    >
      <img src={URL.createObjectURL(image)} alt="" className="productImg" />
      {openDeleteImg && (
        <div
          className="deleteImgContainer"
          onClick={() =>
            setWriteReview((prev) => ({
              ...prev,
              images: writeReview.images.filter((img) => img !== image),
            }))
          }
        >
          <FontAwesomeIcon icon={faTrash} className="deleteIcon" />
        </div>
      )}
    </div>
  );
};

export default AddReviewImage;
