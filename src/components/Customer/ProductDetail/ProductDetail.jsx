import { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCartPlus,
  faChevronLeft,
  faChevronRight,
  faMessage,
  faShop,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import "./productDetail.css";
import ProductImage from "../ProductImage/ProductImage";
import { useHistory } from "react-router-dom";
import { formatNumber } from "../../longFunctions";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "../../../context/AuthContext";

const ProductDetail = ({ product, fetchPreviewCart }) => {
  const { BACKEND_URL, config } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const [mainImageWidth, setMainImageWidth] = useState(0);

  const [currentImage, setCurrentImage] = useState(product.images[0]);
  const [currentDisplayImage, setCurrentDisplayImage] = useState(currentImage);
  const [otherImageIndex, setOtherImageIndex] = useState(0);
  const [openImage, setOpenImage] = useState(false);
  const mainImage = useRef();
  const imageDisplay = useRef();
  const history = useHistory();
  const toast = useToast();
  const handleClickMinus = () => {
    setQuantity((prev) => (prev === 1 ? prev : prev - 1));
  };
  const handleClickPlus = () => {
    setQuantity((prev) => (prev === product.quantity ? prev : prev + 1));
  };

  const handleClickPrev = () => {
    setOtherImageIndex((prev) => (prev === 0 ? prev : prev - 1));
  };

  const handleClickNext = () => {
    setOtherImageIndex((prev) =>
      prev === product.images.length - 5 ? product.images.length - 5 : prev + 1
    );
  };


  const handleAddToCart = async (productId) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/customer/add-to-cart`,
        {
          item: {
            productId,
            quantity,
          },
        },
        config
      );
      toast({
        title: "Add to cart successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      fetchPreviewCart();
    } catch (error) {
      toast({
        title: "An error occurred adding product to cart",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    const handleResize = () => {
      setMainImageWidth(mainImage?.current.offsetWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setCurrentDisplayImage(currentImage);
    setCurrentImage(product.images[0]);
  }, [product]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        imageDisplay.current &&
        !imageDisplay.current.contains(event.target)
      ) {
        setOpenImage(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [imageDisplay]);
  return (
    <div className="productDetail">
      <div className="productBody">
        <div className="productLeft">
          <div className="productLeftContainer">
            {/* <div className="productImage">
                <ReactImageZoom {...props}/>
              </div> */}
            <div
              className="productCurrentImage"
              ref={mainImage}
              onClick={() => setOpenImage(true)}
            >
              <img src={currentImage} alt="" />
            </div>
            <div className="productOtherImages">
              {product.images
                .slice(otherImageIndex, otherImageIndex + 5)
                .map((image, i) => (
                  <ProductImage
                    image={image}
                    setCurrentImage={setCurrentImage}
                    index={i}
                    selected={currentImage === image}
                  />
                ))}
              {product.images.length > 5 && (
                <div className="prevBtn" onClick={handleClickPrev}>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </div>
              )}
              {product.images.length > 5 && (
                <div className="nextBtn" onClick={handleClickNext}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="productRight">
          <div className="productRightContainer">
            <div className="productName">
              <h2>{product.name}</h2>
            </div>
            <div className="productPrice">
              <div className="price">
                <span className="price-symbol">₫</span>
                {formatNumber(product.price)}
              </div>
              <span className="writeReviewText">Write a review</span>
            </div>
            <div className="productDescription">
              <table>
                <tbody>
                  <tr>
                    <th className="productHeading">Category</th>
                    <th className="productContent">{product.category}</th>
                  </tr>
                  <tr>
                    <th className="productHeading">In stock </th>
                    <th className="productContent">{product.quantity}</th>
                  </tr>
                  <tr>
                    <th className="productHeading">Size </th>
                    <th className="productContent">XL</th>
                  </tr>
                  <tr>
                    <th className="productHeading">Quantity </th>
                    <th className="productContent">
                      <div className="productQuantity">
                        <div
                          className="minus"
                          onClick={() => handleClickMinus()}
                        >
                          -
                        </div>
                        <div className="quantity">{quantity}</div>
                        <div className="plus" onClick={() => handleClickPlus()}>
                          +
                        </div>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th className="productHeading"></th>
                    <th className="productContent productButtons">
                      <button
                        className="addToCartBtn"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <FontAwesomeIcon icon={faCartPlus} />
                        <span>Add to cart</span>
                      </button>
                      <button className="buyNowBtn">
                        <span>Buy Now</span>
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="alternativeBuyNowIcon"
                        />
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="buyNowIcon"
                        />
                      </button>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className={openImage ? "imageDisplay" : "imageDisplay hide"}>
        <div className="imageDisplayContainer" ref={imageDisplay}>
          <div className="imageDisplayLeft">
            <img src={currentDisplayImage} alt="" />
          </div>
          <div className="imageDisplayRight">
            <h2>{product.name}</h2>
            <ul>
              {product.images.map((image, i) => (
                <li
                  key={i}
                  className={
                    currentDisplayImage === image ? "selectedBorder" : ""
                  }
                  onClick={() => setCurrentDisplayImage(image)}
                >
                  <img
                    src={image}
                    alt=""
                    // className={
                    //   currentImage === image
                    //     ? "selectedImage"
                    //     : "unSelectedImage"
                    // }
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="storeInfo">
        <div className="storeInfoContainer">
          <div className="storeLeft">
            <img src={product.store.avatar} alt="" />
          </div>
          <div className="storeRight">
            <h3 className="storeName">{product.store.name}</h3>
            <div className="storeButtons">
              <button className="visitStore">
                <FontAwesomeIcon icon={faShop} />
                <span>Visit store</span>
              </button>
              <button className="messageStore">
                <FontAwesomeIcon icon={faMessage} />
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="productDesc">
        <span className="descText">Description</span>
        <div className="productDescContainer">{product.description}</div>
      </div>
    </div>
  );
};

export default ProductDetail;
