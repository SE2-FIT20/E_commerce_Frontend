import { useToast } from "@chakra-ui/react";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import AddProductImage from "../AddProductImage/AddProductImage";
import "./updateProduct.css";
import { handleUpdateProduct } from "./updateProductLogic";
import ChooseCategory from "../ChooseCategory/ChooseCategory";

const UpdateProduct = () => {
  const { BACKEND_URL, config } = useContext(AuthContext);
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    quantity: "",
    description: "",
    images: [],
    newImages: [],
  });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const location = useLocation();
  const productId = location.pathname.split("/")[4];
  const [openChooseCategory, setOpenChooseCategory] = useState(false);
  console.log(product)
  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/product/${productId}`
      );
      const product = data.data;
      setProduct({
        name: product.name,
        price: product.price,
        category: product.category,
        quantity: product.quantity,
        description: product.description,
        images: product.images,
        newImages: [],
      });
    } catch (error) {}
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setProduct((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  console.log(product);

  return (
    <div className="updateProduct">
      <div className="updateProductContainer">
        <div className="productInfo">
          <h2>Product Infomation</h2>
          <table>
            <tbody>
              <tr>
                <td className="productHeading">Name</td>
                <td style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    className="inputField"
                    style={{
                      justifyContent: "space-between",
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Your product name"
                      maxLength="100"
                      value={product.name}
                      id="name"
                      onChange={handleChange}
                    />
                    <span className="inputCharacter">{`${product.name.length}/100`}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="productHeading">Price</td>
                <td>
                  <div
                    className="inputField"
                    style={{
                      gap: "5px",
                    }}
                  >
                    <span className="currencyCharacter">$</span>
                    <input
                      type="number"
                      placeholder="Your product price"
                      id="price"
                      value={product.price}
                      onChange={handleChange}
                      style={{ paddingLeft: "5px" }}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="productHeading">Category</td>
                <td>
                  <div className="inputField">
                    <input
                      type="text"
                      placeholder="Choose product category"
                      id="category"
                      value={product.category}
                      onClick={() => setOpenChooseCategory(true)}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td className="productHeading">In stock</td>
                <td>
                  <div
                    className="inputField"
                    style={{
                      gap: "5px",
                    }}
                  >
                    <input
                      type="number"
                      placeholder="Your product quantity in stock"
                      id="quantity"
                      value={product.quantity}
                      onChange={handleChange}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td
                  className="productHeading"
                  style={{
                    alignItems: "flex-start",
                  }}
                >
                  Description
                </td>
                <td>
                  <div
                    className="inputField"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <textarea
                      type="text"
                      wrap="soft"
                      placeholder="Your product description"
                      id="description"
                      maxLength={10000}
                      onChange={handleChange}
                      value={product.description}
                    />
                    {/* <ReactQuill
                      value={product.description}
                      onChange={handleChange}
                      id="description"

                    /> */}

                    <span className="textareaCharacter">{`${product.description.length}/10000`}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td className="productHeading">Product Image</td>
                <td style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {product.images.map((image, i) => (
                    <AddProductImage
                      image={image}
                      product={product}
                      setProduct={setProduct}
                      index={i}
                      productImage={true}
                    />
                  ))}
                  {product.newImages.map((image, i) => (
                    <AddProductImage
                      image={image}
                      product={product}
                      setProduct={setProduct}
                      index={i}
                      productImage={false}
                    />
                  ))}
                  <label htmlFor="file">
                    <div className="addImage">
                      <FontAwesomeIcon
                        icon={faImage}
                        className="addImageIcon"
                      />
                      <span>{`Add image (${
                        product.images.length + product.newImages.length > 10
                          ? 10
                          : product.images.length + product.newImages.length
                      }/10)`}</span>
                    </div>
                    <input
                      type="file"
                      name=""
                      id="file"
                      multiple
                      accept="image/png, image/jpeg, image/webp"
                      style={{ display: "none" }}
                      disabled={
                        product.images.length + product.newImages.length >= 10
                      }
                      onChange={(event) =>
                        setProduct((prev) => ({
                          ...prev,
                          newImages: [
                            ...product.newImages,
                            ...event.target.files,
                          ],
                        }))
                      }
                    />
                  </label>
                </td>
              </tr>
              <tr style={{ paddingTop: "15px", paddingBottom: "15px" }}>
                <td
                  className="productHeading"
                  style={{
                    alignItems: "flex-start",
                  }}
                ></td>
                <td style={{ justifySelf: "flex-start" }}>
                  <button
                    className="addBtn"
                    style={{ padding: loading ? "11px 80px" : "13px 40px" }}
                    onClick={() =>
                      handleUpdateProduct(
                        product,
                        productId,
                        BACKEND_URL,
                        setLoading,
                        config,
                        toast,
                        history
                      )
                    }
                  >
                    {loading ? (
                      <div className="loginLoading">
                        <div class="lds-ring">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    ) : (
                      "Update Product"
                    )}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <ChooseCategory
        open={openChooseCategory}
        setOpen={setOpenChooseCategory}
        setProduct={setProduct}
      />
    </div>
  );
};

export default UpdateProduct;
