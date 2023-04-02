import { useState, useEffect, useContext } from "react";
import BreadCrumb from "../../components/Customer/BreadCrumb/BreadCrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faMessage,
  faShop,
  faStar,
  faStarHalfStroke,
} from "@fortawesome/free-solid-svg-icons";
import ReactImageZoom from "react-image-zoom";
import ReactStars from "react-rating-stars-component";
import { AuthContext } from "../../context/AuthContext";
import { Link, useHistory, useLocation } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react"
import "./product.css";
import ProductDetail from "../../components/Customer/ProductDetail/ProductDetail";
import ProductReview from "../../components/Customer/ProductReview/ProductReview";

const Product = ({ fetchPreviewCart }) => {
  const { token, BACKEND_URL } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const props = {
    width: 600,
    height: 660,
    zoomWidth: 600,
    img: "https://cf.shopee.vn/file/sg-11134201-22110-5co0i2evafkve8",
  };
  const toast = useToast();

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/product/${productId}`,
        {
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      setProduct(response.data.data);
    } catch (error) {
      toast({
        title: "An error occurred fetching product",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      })
    }
  };
  console.log(product)

  useEffect(() => {
    fetchProduct();
  }, [location]);

  return (
    <div className="product">
      <BreadCrumb title="Product" />

      <div className="productContainer">
        {product && <ProductDetail product={product} fetchPreviewCart={fetchPreviewCart}/>}

        {/* store Infomation */}

        {/* product description */}

        <div className="productReview">
          <span className="reviewText">Review</span>
          <div className="productReviewContainer">
            <div className="customerReviews">
              <ul>
                <ProductReview />
              </ul>
            </div>

            {/* write review */}
            <div className="writeReview">
              <div className="writeReviewText">Write your review</div>
              <div className="reviewVote">
                <ReactStars
                  count={5}
                  size={24}
                  value={0}
                  edit={true}
                  activeColor="#ffd700"
                />
              </div>
              <textarea
                name="review"
                id=""
                cols="30"
                rows="10"
                placeholder="Comment..."
              ></textarea>
              <div className="submitReview">
                <button className="submitReviewBtn">Submit review</button>
              </div>
            </div>
          </div>

          {/* store other product */}
          <div className="storeOtherProduct">
            <div className="otherProductText">MQShop's other products</div>
            <div className="storeOtherProductContainer">
              <ul>
                <li>
                  <Link to="/product/1" className="singleProduct">
                    <img
                      src="https://cf.shopee.vn/file/sg-11134201-22110-5co0i2evafkve8"
                      alt="product"
                      className="productImage"
                    />
                    <div className="productTitle">
                      <h2 className="productName">Sục siêu vip</h2>
                      <span className="productCategory">Dép</span>
                    </div>
                    <span className="productPrice">20k</span>
                  </Link>
                </li>

                <li>
                  <img
                    src="https://cf.shopee.vn/file/sg-11134201-22110-5co0i2evafkve8"
                    alt="product"
                    className="productImage"
                  />
                  <div className="productTitle">
                    <h2 className="productName">Sục siêu vip</h2>
                    <span className="productCategory">Dép</span>
                  </div>
                  <span className="productPrice">20k</span>
                </li>
                <li>
                  <img
                    src="https://cf.shopee.vn/file/sg-11134201-22110-5co0i2evafkve8"
                    alt="product"
                    className="productImage"
                  />
                  <div className="productTitle">
                    <h2 className="productName">Sục siêu vip</h2>
                    <span className="productCategory">Dép</span>
                  </div>
                  <span className="productPrice">20k</span>
                </li>
                <li>
                  <img
                    src="https://cf.shopee.vn/file/sg-11134201-22110-5co0i2evafkve8"
                    alt="product"
                    className="productImage"
                  />
                  <div className="productTitle">
                    <h2 className="productName">Sục siêu vip</h2>
                    <span className="productCategory">Dép</span>
                  </div>
                  <span className="productPrice">20k</span>
                </li>
              </ul>
            </div>
          </div>

          {/* related products */}
          <div className="storeOtherProduct">
            <div className="otherProductText">Related Products</div>
            <div className="storeOtherProductContainer">
              <ul>
                <li>
                  <Link to="/product/1" className="singleProduct">
                    <img
                      src="https://cf.shopee.vn/file/sg-11134201-22110-5co0i2evafkve8"
                      alt="product"
                      className="productImage"
                    />
                    <div className="productTitle">
                      <h2 className="productName">Sục siêu vip</h2>
                      <span className="productCategory">Dép</span>
                    </div>
                    <span className="productPrice">20k</span>
                  </Link>
                </li>

                <li>
                  <img
                    src="https://cf.shopee.vn/file/sg-11134201-22110-5co0i2evafkve8"
                    alt="product"
                    className="productImage"
                  />
                  <div className="productTitle">
                    <h2 className="productName">Sục siêu vip</h2>
                    <span className="productCategory">Dép</span>
                  </div>
                  <span className="productPrice">20k</span>
                </li>
                <li>
                  <img
                    src="https://cf.shopee.vn/file/sg-11134201-22110-5co0i2evafkve8"
                    alt="product"
                    className="productImage"
                  />
                  <div className="productTitle">
                    <h2 className="productName">Sục siêu vip</h2>
                    <span className="productCategory">Dép</span>
                  </div>
                  <span className="productPrice">20k</span>
                </li>
                <li>
                  <img
                    src="https://cf.shopee.vn/file/sg-11134201-22110-5co0i2evafkve8"
                    alt="product"
                    className="productImage"
                  />
                  <div className="productTitle">
                    <h2 className="productName">Sục siêu vip</h2>
                    <span className="productCategory">Dép</span>
                  </div>
                  <span className="productPrice">20k</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
