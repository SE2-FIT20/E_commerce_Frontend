  import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import BreadCrumb from "../../components/Customer/BreadCrumb/BreadCrumb";
import CartProduct from "../../components/Customer/CartProduct/CartProduct";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { formatNumber } from "../../components/longFunctions";
import "./cart.css";
import EmptyCart from "../../images/cart-empty.webp";
import { useRef } from "react";
import { useToast } from "@chakra-ui/react";
import CustomerPopup from "../../components/Customer/CustomerPopup/CustomerPopup";

const Cart = () => {
  const { BACKEND_URL, config } = useContext(AuthContext);
  const [storeProducts, setStoreProducts] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openCustomerPopup, setOpenCustomerPopup] = useState(false)
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductQuantity, setSelectedProductQuantity] = useState(0);
  const history = useHistory();
  const popup = useRef();
  const toast = useToast();
  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BACKEND_URL}/api/customer/cart`,
        config
      );

      setStoreProducts(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (
        error.response.data.message ===
        "Your account is locked! Please contact admin to unlock your account!"
      ) {
        setOpenCustomerPopup(true);
        return;
      }
      toast({
        title: "An error occurred adding product to cart",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleConfirm = async (productId, productPrice, number) => {
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
      window.location.reload();
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

  useEffect(() => {
    function handleClickOutside(event) {
      if (popup.current && !popup.current.contains(event.target)) {
        setOpenPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popup]);
  useEffect(() => {
    fetchCart();
    document.title = "Cart | BazaarBay ";
  }, []);

  return (
    <div
      className="cart"
      style={{ backgroundColor: storeProducts.length === 0 && "#fff" }}
    >
      <BreadCrumb title="Cart" />
      {loading && (
        <div className="fullLoading">
          <div className="lds-ellipsis">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {storeProducts.length > 0 && !loading && (
        <div className="cartContainer">
          <div className="cartBody">
            {storeProducts &&
              storeProducts.map((store) => (
                <div className="cartStore" key={store.id}>
                  <div className="storeInfo">
                    <img
                      src={store.store.avatar}
                      alt=""
                      onClick={() => history.push(`/store/${store.store.id}`)}
                    />
                    <div>
                      <h2
                        onClick={() => history.push(`/store/${store.store.id}`)}
                      >
                        {store.store.name}
                      </h2>
                      <span>{store.store.city}</span>
                    </div>
                  </div>
                  <table>
                    <thead>
                      <tr className="cartProductTitle">
                        <td className="cartProductName">Product</td>
                        <td className="cartProductPrice">Price</td>
                        <td className="cartProductQuantity">Quantity</td>
                        <td className="cartProductTotal">Total</td>
                        <td className="cartProductDelete"></td>
                      </tr>
                    </thead>
                    <tbody>
                      {store.items.map((product, i) => (
                        <>
                          <CartProduct
                            product={product.product}
                            productQuantity={product.quantity}
                            key={i}
                            fetchCart={fetchCart}
                            setTotal={setTotal}
                            setOpenPopup={setOpenPopup}
                            setSelectedProduct={setSelectedProduct}
                            setSelectedProductQuantity={
                              setSelectedProductQuantity
                            }
                          />
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
          </div>
          {storeProducts && (
            <div className="cartTotalPrice">
              <div className="cartTotalPriceContainer">
                <h2 className="subtotal">{`Subtotal: ₫${formatNumber(
                  total
                )}`}</h2>
                <span>Taxes and shipping calculated at checkout</span>
                <Link to="/checkout">
                  <button className="checkoutBtn">Checkout</button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      {storeProducts.length === 0 && !loading && (
        <div className="cartContainer">
          <div className="emptyCart">
            <img src={EmptyCart} alt="" className="emptyCartImage" />
            <div className="emptyCartText">
              <h2>Your cart is currently empty</h2>
              <span>
                Before proceed to checkout, you must add some products to your
                cart. You will find a lot of interesting products on our page.
              </span>
              <button
                className="button"
                onClick={() => {
                  history.push(`/`);
                }}
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      )}
      <div className={openPopup ? "popup open" : "popup"}>
        <div className="popupContainer" ref={popup}>
          <div className="deleteTitle">
            <span>{`Are you sure you want to remove product "${selectedProduct?.name}" from cart?`}</span>
          </div>
          <div className="deleteBtnContainer">
            <button
              className="button"
              onClick={() =>
                handleConfirm(
                  selectedProduct.id,
                  selectedProduct.price,
                  selectedProductQuantity
                )
              }
            >
              Yes
            </button>
            <button className="button" onClick={() => setOpenPopup(false)}>
              No
            </button>
          </div>
        </div>
      </div>
      <CustomerPopup open={openCustomerPopup} setOpen={setOpenCustomerPopup} popupType="account-locked" />
    </div>
  );
};

export default Cart;
