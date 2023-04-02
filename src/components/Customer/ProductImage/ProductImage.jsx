import { useState } from "react";
import "./productImage.css";

const ProductImage = ({ image, setCurrentImage, index, selected }) => {
  const [selectedImage, setSelectedImage] = useState(false);
  return (
    <div
      className={
        (selected) ? "productOtherImage selectedBorder" : "productOtherImage"
      }
      key={index}
    >
      <img
        src={image}
        alt=""
        key={index}
        // style={{
        //   maxWidth: `${imageSize}px`,
        //   maxHeight: `${imageSize}px`,
        //   minWidth: `${imageSize}px`,
        //   minHeight: `${imageSize}px`,
        // }}
        onMouseOver={() => {
          setCurrentImage(image);
        }}
        className={selected ? "selectedImage" : "unSelectedImage"}
      />
    </div>
  );
};

export default ProductImage;
