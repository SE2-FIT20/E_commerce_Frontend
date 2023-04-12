import { useState, useEffect, useContext } from "react";
import BreadCrumb from "../../components/Customer/BreadCrumb/BreadCrumb";
import ReactStars from "react-rating-stars-component";
import { AuthContext } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import "./product.css";
import NoReview from "../../images/no-review.webp";
import ProductDetail from "../../components/Customer/ProductDetail/ProductDetail";
import ProductReview from "../../components/Customer/ProductReview/ProductReview";
import OtherProducts from "../../components/Customer/OtherProducts/OtherProducts";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AddReviewImage from "../../components/Customer/AddReviewImage/AddReviewImage";

const Product = ({ fetchPreviewCart }) => {
  const { BACKEND_URL, currentUser, config } = useContext(AuthContext);
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [writeReview, setWriteReview] = useState({
    rating: 5,
    comment: "",
    productId,
    images: [],
  });

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
  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/reviews/${productId}`
      );
      setReviews(data.data.content);
    } catch (error) {
      toast({
        title: "An error occurred fetching product reviews",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSubmitReview = async () => {
    let images = [];
    if (writeReview.images.length > 0) {
      const promises = writeReview.images.map(async (pic) => {
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
        await axios.post(
          `${BACKEND_URL}/api/customer/review`,
          {
            ...writeReview,
            images,
          },
          config
        );
        toast({
          title: "Submit review with images successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        window.location.reload();
      } catch (error) {
        toast({
          title: "Error submitting reviews with images!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
    } else {
      try {
        await axios.post(
          `${BACKEND_URL}/api/customer/review`,
          {
            ...writeReview,
            images: [],
          },
          config
        );
        toast({
          title: "Submit review without images successfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        window.location.reload();
      } catch (error) {
        toast({
          title: "Error submitting reviews without images!",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
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
            {reviews.length > 0 && (
              <div className="customerReviews">
                <ul>
                  {reviews.map((review) => (
                    <ProductReview review={review} key={review.id}/>
                  ))}
                </ul>
              </div>
            )}

            {/* write review */}
            {currentUser && (
              <div className="writeReview">
                <div className="writeReviewText">Write your review</div>
                <div className="reviewVote">
                  <ReactStars
                    count={5}
                    size={24}
                    value={writeReview.rating}
                    edit={true}
                    activeColor="#ffd700"
                    onChange={(rating) =>
                      setWriteReview((prev) => ({
                        ...prev,
                        rating,
                      }))
                    }
                  />
                </div>
                <textarea
                  name="review"
                  wrap="soft"
                  id=""
                  cols="30"
                  rows="10"
                  placeholder="Comment..."
                  value={writeReview.comment}
                  onChange={(e) =>
                    setWriteReview((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                ></textarea>
                <div className="reviewImages">
                  {writeReview.images.slice(0, 10).map((image, i) => (
                    <AddReviewImage
                      image={image}
                      index={i}
                      writeReview={writeReview}
                      setWriteReview={setWriteReview}
                    />
                  ))}
                  <label htmlFor="file">
                    <div className="addImage">
                      <FontAwesomeIcon
                        icon={faImage}
                        className="addImageIcon"
                      />
                      <span>{`Add image (${
                        writeReview.images.length > 10
                          ? 10
                          : writeReview.images.length
                      }/10)`}</span>
                    </div>
                    <input
                      type="file"
                      name=""
                      id="file"
                      multiple
                      accept="image/png, image/jpeg, image/webp"
                      style={{ display: "none" }}
                      disabled={writeReview.images.length >= 10}
                      onChange={(event) =>
                        setWriteReview((prev) => ({
                          ...prev,
                          images: [
                            ...writeReview.images,
                            ...event.target.files,
                          ],
                        }))
                      }
                    />
                  </label>
                </div>

                <div className="submitReview">
                  <button
                    className="submitReviewBtn"
                    onClick={() => handleSubmitReview()}
                  >
                    Submit review
                  </button>
                </div>
              </div>
            )}
          </div>

          {product && product.reviews.length === 0 && (
            <div className="noReviews">
              {/* <img src={NoReview} alt="" /> */}
            </div>
          )}

          {/* store other product */}
          <OtherProducts product={product} />

          {/* {product && (
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
          )} */}
          {/* related products */}
        </div>
      </div>
    </div>
  );
};

export default Product;
