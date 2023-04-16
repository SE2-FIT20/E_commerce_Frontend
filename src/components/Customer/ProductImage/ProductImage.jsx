import { useState } from "react";
import "./productImage.css";

const ProductImage = ({ image, setCurrentImage, index, selected }) => {
  return (
    <div
      className={
        selected ? "productOtherImage selectedBorder" : "productOtherImage"
      }
      key={index}
    >
      <img
        src={image}
        alt=""
        key={index}
        onMouseOver={() => {
          setCurrentImage(image);
        }}
        className={selected ? "selectedImage" : "unSelectedImage"}
      />
    </div>
  );
};

export default ProductImage;
