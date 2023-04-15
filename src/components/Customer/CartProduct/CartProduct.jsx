import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { formatNumber } from "../../longFunctions";
import "./cartProduct.css";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const CartProduct = ({
  product,
  productQuantity,
  fetchCart,
  setTotal,
  setOpenPopup,
  setSelectedProduct,
  setSelectedProductQuantity,
}) => {
  const { BACKEND_URL, config } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(productQuantity);
  const toast = useToast();
  const history = useHistory();

  useEffect(() => {
    setTotal((prev) => prev + product.price * quantity);
  }, []);
  const handleProductQuantity = async (productId, productPrice, number) => {
    if (quantity + number === 0) number = 0;
    try {
      await axios.post(
        `${BACKEND_URL}/api/customer/add-to-cart`,
        {
          item: {
            productId,
            quantity: number,
          },
        },
        config
      );
      setTotal((prev) => prev + productPrice * number);
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

  const handleClickPlus = () => {
    setQuantity((prev) => {
      if (prev === product.quantity) {
        toast({
          title: "You have reached the limit number of this product",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        return prev;
      } else {
        handleProductQuantity(product.id, product.price, 1);

        return prev + 1;
      }
    });
  };

  const handleClickMinus = () => {
    setQuantity((prev) => {
      if (prev === 1) {
        return 1;
      } else {
        handleProductQuantity(product.id, product.price, -1);
        return prev - 1;
      }
    });
  };

  return (
    <tr>
      <td className="cartProductName">
        <img
          src={product.images[0]}
          alt=""
          onClick={() => history.push(`/product/${product.id}`)}
        />
        <h2 onClick={() => history.push(`/product/${product.id}`)}>
          {product.name}
        </h2>
      </td>
      <td className="cartProductPrice">
        <span className="price-symbol">₫</span>
        {formatNumber(product.price)}
      </td>
      <td className="cartProductQuantity">
        <div className="productQuantityContainer">
          <div
            className="minus"
            onClick={() => {
              handleClickMinus(-1);
            }}
          >
            <FontAwesomeIcon icon={faMinus} />
          </div>
          <div className="quantity">{quantity < 1 ? 1 : quantity}</div>
          <div
            className="plus"
            onClick={() => {
              handleClickPlus(1);
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
      </td>
      <td className="cartProductTotal">
        <span className="price-symbol">₫</span>
        {formatNumber(product.price * quantity)}
      </td>
      <td className="cartProductDeleteContainer">
        <div
          className="cartProductDelete"
          onClick={() => {
            setOpenPopup(true);
            setSelectedProduct(product);
            setSelectedProductQuantity(productQuantity);
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </td>
    </tr>
  );
};

export default CartProduct;
