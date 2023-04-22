import { useState } from "react";
import "./addReviewImage.css";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AddReviewImage = ({
  image,
  writeReview,
  setWriteReview,
  uploadedImage,
  newImage,
  newImages,
  setNewImages,
}) => {
  const [openDeleteImg, setOpenDeleteImg] = useState(false);
  return (
    <div
      className="addProductImage"
      onMouseOver={() => setOpenDeleteImg(true)}
      onMouseLeave={() => setOpenDeleteImg(false)}
    >
      {image && (
        <>
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
        </>
      )}
      {uploadedImage && (
        <>
          <img src={uploadedImage} alt="" className="productImg" />
          {openDeleteImg && (
            <div
              className="deleteImgContainer"
              onClick={() =>
                setWriteReview((prev) => ({
                  ...prev,
                  images: writeReview.images.filter((img) => img !== uploadedImage),
                }))
              }
            >
              <FontAwesomeIcon icon={faTrash} className="deleteIcon" />
            </div>
          )}
        </>
      )}
      {newImage && (
        <>
          <img src={URL.createObjectURL(newImage)} alt="" className="productImg" />
          {openDeleteImg && (
            <div
              className="deleteImgContainer"
              onClick={() =>
                setNewImages(newImages.filter(image => image !== newImage))
              }
            >
              <FontAwesomeIcon icon={faTrash} className="deleteIcon" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AddReviewImage;
