import { useState } from "react";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./addProductImage.css";

const AddProductImage = ({
  image,
  product,
  setProduct,
  index,
  productImage,
}) => {
  const [openDeleteImg, setOpenDeleteImg] = useState(false);
  return (
    <div
      className="addProductImage"
      onMouseOver={() => setOpenDeleteImg(true)}
      onMouseLeave={() => setOpenDeleteImg(false)}
      key={index}
    >
      {productImage && (
        <img src={image} alt="" className="productImg" />
      )}
      {!productImage && (
        <img src={URL.createObjectURL(image)} alt="" className="productImg" />
      )}
      {productImage && openDeleteImg && (
        <div
          className="deleteImgContainer"
          onClick={() =>
            setProduct((prev) => ({
              ...prev,
              images: product.images.filter((img) => img !== image),
            }))
          }
        >
          <FontAwesomeIcon icon={faTrash} className="deleteIcon" />
        </div>
      )}
      {!productImage && openDeleteImg && (
        <div
          className="deleteImgContainer"
          onClick={() =>
            setProduct((prev) => ({
              ...prev,
              newImages: product.newImages.filter((img) => img !== image),
            }))
          }
        >
          <FontAwesomeIcon icon={faTrash} className="deleteIcon" />
        </div>
      )}
    </div>
  );
};

export default AddProductImage;
