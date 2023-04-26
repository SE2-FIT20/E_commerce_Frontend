import { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCartPlus,
  faChevronLeft,
  faChevronRight,
  faMessage,
  faMinus,
  faPlus,
  faShop,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import "./productDetail.css";
import ProductImage from "../ProductImage/ProductImage";
import { useHistory } from "react-router-dom";
import axios from "axios";
import StarRatings from "react-star-ratings";
import { useToast } from "@chakra-ui/react";
import { AuthContext } from "../../../context/AuthContext";
import {
  capitalize,
  formatDaysAgo,
  formatDaysLeft,
  formatDaysToStart,
  formatNumber,
  revertTimeStamp,
} from "../../longFunctions";
import { faClock } from "@fortawesome/free-regular-svg-icons";

const ProductDetail = ({ product, fetchPreviewCart }) => {
  const { BACKEND_URL, config, currentUser } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(1);
  const [storeCoupons, setStoreCoupons] = useState([]);
  const [currentImage, setCurrentImage] = useState(product.images[0]);
  const [currentDisplayImage, setCurrentDisplayImage] = useState(currentImage);
  const [otherImageIndex, setOtherImageIndex] = useState(0);
  const [openImage, setOpenImage] = useState(false);
  const [readMoreDesc, setReadMoreDesc] = useState(false);
  const [openStoreCoupons, setOpenStoreCoupons] = useState(false);

  const mainImage = useRef();
  const imageDisplay = useRef();
  const history = useHistory();
  const toast = useToast();
  const storeCouponsRef = useRef();
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
  const handleClickBuyNow = (productId) => {
    handleAddToCart(productId);
    history.push(`/checkout`);
  };
  const fetchStoreCoupons = async (storeId) => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/coupon-sets/store/${storeId}`
      );
      setStoreCoupons(data.data.content);
    } catch (error) {}
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

  const handleSaveCoupon = async (couponId) => {
    console.log(couponId);
    try {
      await axios.put(
        `${BACKEND_URL}/api/customer/vouchers-coupons/${couponId}`,
        {},
        config
      );
      toast({
        title: "Save coupon successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "You already saved this coupon!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchStoreCoupons(product.store.id);
    setCurrentDisplayImage(currentImage);
    setCurrentImage(product.images[0]);
    document.title = `${product.name} | BazaarBay`;
  }, [product]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        imageDisplay.current &&
        !imageDisplay.current.contains(event.target)
      ) {
        setOpenImage(false);
      }
      if (
        storeCouponsRef.current &&
        !storeCouponsRef.current.contains(event.target)
      ) {
        setOpenStoreCoupons(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [imageDisplay, storeCouponsRef]);
  return (
    <div className="productDetail">
      <div className="productBody">
        <div className="productLeft">
          <div className="productLeftContainer">
            <div
              className="productCurrentImage"
              ref={mainImage}
              onClick={() => setOpenImage(true)}
            >
              <img src={currentImage} alt="" />
              {product.quantity === 0 && (
                <div className="soldoutImage">
                  <div className="soldoutImageContainer">
                    <span>Out Of Stock</span>
                  </div>
                </div>
              )}
            </div>
            <div className="productOtherImages">
              {product.images
                .slice(otherImageIndex, otherImageIndex + 5)
                .map((image, i) => (
                  <ProductImage
                    image={image}
                    setCurrentImage={setCurrentImage}
                    key={i}
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
              <div className="productReviewInfo">
                <div className="productStar">
                  {product.reviews.length > 0 && (
                    <>
                      <span className="productRating">
                        {product.rating.toFixed(1)}
                      </span>
                      <StarRatings
                        rating={product.rating}
                        starRatedColor="#ffd700"
                        numberOfStars={5}
                        name="rating"
                        starDimension="20px"
                        starSpacing="0px"
                      />
                      <span className="reviewCount">{`(${product.reviews.length})`}</span>
                      <span className="sold">{`${product.sold} sold`}</span>
                    </>
                  )}
                  {product.reviews.length === 0 && (
                    <span style={{ textDecoration: "none" }}>No review</span>
                  )}
                </div>
              </div>
            </div>

            <div className="productPrice">
              <div className="productPriceContainer">
                <div className="initialPrice">
                  <span className="price-symbol">₫</span>
                  {formatNumber((product.price * 1.1).toFixed(0))}
                </div>
                <div className="price">{"₫" + formatNumber(product.price)}</div>
              </div>
            </div>
            <div className="productDescription">
              <table>
                <tbody>
                  <tr>
                    <th className="productHeading">Vouchers</th>
                    <th className="productContent productVouchers">
                      <div className="productVoucher">Discount 5%</div>
                      <div className="productVoucher">Discount 5%</div>
                      <div className="productVoucher">Discount 5%</div>
                      <div className="productVoucher">Discount 5%</div>
                      <div className="productVoucher">Discount 5%</div>
                      <div className="productVoucher">Discount 5%</div>
                      <div className="productVoucher">Discount 5%</div>
                    </th>
                  </tr>

                  <tr>
                    <th className="productHeading">Store Coupons</th>
                    <th
                      className="productContent productVouchers"
                      onMouseOver={() => setOpenStoreCoupons(true)}
                      onMouseLeave={() => setOpenStoreCoupons(false)}
                    >
                      {storeCoupons.map((coupon) => (
                        <div
                          className="productCoupon"
                          key={coupon.id}
                        >{`Discount ${coupon.percent}%`}</div>
                      ))}
                      {openStoreCoupons && (
                        <div className="storeCoupons" ref={storeCouponsRef}>
                          <div className="storeCouponsContainer">
                            <h2>Store Coupons</h2>
                            <div className="storeCouponsList">
                              {storeCoupons.map((coupon) => (
                                <div className="voucher" key={coupon.id}>
                                  <div className="voucherLeft">
                                    <div className="voucherImage">
                                      <img src={coupon.store.avatar} alt="" />
                                      <span>{coupon.store.name}</span>
                                    </div>
                                    <div className="voucherInfo">
                                      <div className="voucherBasicInfo">
                                        <h2 className="voucherPercent">{`Discount ${coupon.percent}%`}</h2>
                                        <span className="voucherDescription">
                                          {`${coupon.description.substring(
                                            0,
                                            40
                                          )}${
                                            coupon.description.length > 40
                                              ? "..."
                                              : ""
                                          }`}
                                        </span>
                                      </div>
                                      {revertTimeStamp(coupon.startAt) >=
                                        revertTimeStamp(new Date()) && (
                                        <span className="voucherExpired">
                                          <FontAwesomeIcon icon={faClock} />
                                          <span>
                                            {formatDaysToStart(coupon.startAt)}
                                          </span>
                                        </span>
                                      )}
                                      {revertTimeStamp(coupon.startAt) <
                                        revertTimeStamp(new Date()) && (
                                        <span className="voucherExpired">
                                          <FontAwesomeIcon icon={faClock} />
                                          <span>
                                            {formatDaysLeft(coupon.expiredAt)}
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="voucherRight">
                                    <span>{`${coupon.quantityAvailable} remaining`}</span>
                                    <button
                                      className="button"
                                      onClick={() => {
                                        currentUser
                                          ? handleSaveCoupon(coupon.id)
                                          : history.push("/login");
                                      }}
                                    >
                                      Get
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </th>
                  </tr>
                  <tr>
                    <th className="productHeading">Category</th>
                    <th className="productContent productContentBox">
                      {capitalize(product.category.toLowerCase())}
                    </th>
                  </tr>

                  <tr>
                    <th className="productHeading">In stock </th>
                    <th
                      className="productContent productContentBox"
                      style={{ width: "70px" }}
                    >
                      {product.quantity}
                    </th>
                  </tr>
                  <tr>
                    <th className="productHeading">Quantity </th>
                    <th className="productContent">
                      <div
                        className="productQuantity"
                        style={{
                          cursor: product.quantity === 0 && "not-allowed",
                        }}
                      >
                        <div
                          className="minus"
                          onClick={() =>
                            product.quantity > 0 ? handleClickMinus() : null
                          }
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </div>
                        <div className="quantity">
                          {product.quantity > 0 ? quantity : 0}
                        </div>
                        <div
                          className="plus"
                          onClick={() =>
                            product.quantity > 0 ? handleClickPlus() : null
                          }
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </div>
                      </div>
                      {product.quantity === 0 && (
                        <span className="soldoutText">Out of stock</span>
                      )}
                    </th>
                  </tr>
                  {product.quantity > 0 && (
                    <tr
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <th className="productHeading"></th>
                      <th className="productContent productButtons">
                        <button
                          className="addToCartBtn"
                          onClick={() => {
                            currentUser
                              ? handleAddToCart(product.id)
                              : history.push("/login");
                          }}
                        >
                          <FontAwesomeIcon icon={faCartPlus} />
                          <span>Add to cart</span>
                        </button>
                        <button
                          className="buyNowBtn"
                          onClick={() => {
                            currentUser
                              ? handleClickBuyNow(product.id)
                              : history.push("/login");
                          }}
                        >
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
                  )}
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
          <div className="storeBasicInfo">
            <div className="storeLeft">
              <img src={product.store.avatar} alt="" />
            </div>
            <div className="storeRight">
              <h3 className="storeName">{product.store.name}</h3>
              <div className="storeButtons">
                <button
                  className="button"
                  onClick={() => history.push(`/store/${product.store.id}`)}
                >
                  <FontAwesomeIcon icon={faShop} />
                  <span>Visit store</span>
                </button>
                {/* <button className="button">
                  <FontAwesomeIcon icon={faMessage} />
                  <span>Message</span>
                </button> */}
              </div>
            </div>
          </div>
          <div className="storeMoreInfo">
            <div className="storeMoreInfoCol">
              <div className="storeMoreInfoItem">
                <h2>Rating: </h2>
                <span>{product.store.averageRating}</span>
              </div>
              <div className="storeMoreInfoItem">
                <h2>Products: </h2>
                <span>{product.store.numberOfProducts}</span>
              </div>
            </div>
            <div className="storeMoreInfoCol">
              <div className="storeMoreInfoItem">
                <h2>Reviews: </h2>
                <span>{product.store.numbersOfReviews}</span>
              </div>
              <div className="storeMoreInfoItem">
                <h2>Created At: </h2>
                <span>{formatDaysAgo(product.store.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="productDesc">
        <span className="descText">Description</span>
        <div
          className="productDescContainer"
          style={{ whiteSpace: "pre-wrap" }}
        >
          {!readMoreDesc
            ? `${product.description.substring(0, 1000)}${
                product.description.length > 1000 ? "..." : ""
              }\n`
            : `${product.description}\n`}
          {product.description.length > 1000 && (
            <span onClick={() => setReadMoreDesc(!readMoreDesc)}>
              {readMoreDesc ? "Show less" : "Read more"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
