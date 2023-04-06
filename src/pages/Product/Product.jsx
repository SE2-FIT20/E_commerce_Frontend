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
import { useToast } from "@chakra-ui/react";
import "./product.css";
import ProductDetail from "../../components/Customer/ProductDetail/ProductDetail";
import ProductReview from "../../components/Customer/ProductReview/ProductReview";
import SingleProduct from "../../components/Customer/SingleProduct/SingleProduct";

const Product = ({ fetchPreviewCart }) => {
  const { token, BACKEND_URL } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [shopOtherProducts, setShopOtherProducts] = useState([
    1, 2, 3, 4, 5, 6, 7, 8,
  ]);
  const [relatedProducts, setRelatedProducts] = useState([1, 2, 3, 4]);
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
      });
    }
  };
  console.log(product);

  useEffect(() => {
    fetchProduct();
  }, [location]);

 

  return (
    <div className="product">
      <BreadCrumb title="Product" />

      <div className="productContainer">
        {product && (
          <ProductDetail
            product={product}
            fetchPreviewCart={fetchPreviewCart}
          />
        )}

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
                  value={2}
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
          {product && (
            <div className="storeOtherProduct">
              <div className="otherProductText">MQShop's other products</div>
              <div className="storeOtherProductContainer">
                <ul>
                  {shopOtherProducts.map((p) => (
                    <SingleProduct product={product} />
                  ))}
                </ul>
              </div>
            </div>
          )}

          {product && (
            <div className="storeOtherProduct">
              <div className="otherProductText">Related Products</div>
              <div className="storeOtherProductContainer">
                <ul>
                  {shopOtherProducts.map((p) => (
                    <SingleProduct product={product} />
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* related products */}
        </div>
      </div>
    </div>
  );
};

export default Product;
