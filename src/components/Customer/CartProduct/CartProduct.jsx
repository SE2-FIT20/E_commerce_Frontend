import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { formatNumber } from "../../longFunctions";
import "./cartProduct.css";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const CartProduct = ({ product, productQuantity, fetchCart, setTotal }) => {
  const { BACKEND_URL, config } = useContext(AuthContext);
  const [quantity, setQuantity] = useState(productQuantity);
  const toast = useToast();
  const history = useHistory();
  const handleClickPlus = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleClickMinus = () => {
    setQuantity((prev) => (prev === 1 ? 1 : prev - 1));
  };

  useEffect(() => {
    setTotal((prev) => prev + (product.price * quantity));
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
  const handleRemoveProduct = async (productId, productPrice, number) => {
    try {
      await axios.post(
        `${BACKEND_URL}/api/customer/remove-from-cart`,
        { productId },
        config
      );
      toast({
        title: "Remove product from cart successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setTotal((prev) => prev - productPrice * number);
      fetchCart();
    } catch (error) {
      toast({
        title: "An error occurred removing product from cart",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <tr>
      <td className="cartProductName">
        <img
          src={product.images[0]}
          alt=""
          onClick={() => history.push(`/product/${product.id}`)}
        />
        <h2>{product.name}</h2>
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
              handleProductQuantity(product.id, product.price, -1);
            }}
          >
            -
          </div>
          <div className="quantity">{quantity < 1 ? 1 : quantity}</div>
          <div
            className="plus"
            onClick={() => {
              handleClickPlus(1);
              handleProductQuantity(product.id, product.price, 1);
            }}
          >
            +
          </div>
        </div>
      </td>
      <td className="cartProductTotal">
        <span className="price-symbol">₫</span>
        {formatNumber(product.price * quantity)}
      </td>
      <td
        className="cartProductDelete"
        onClick={() => handleRemoveProduct(product.id, product.price, quantity)}
      >
        <FontAwesomeIcon icon={faTrash} />
      </td>
    </tr>
  );
};

export default CartProduct;