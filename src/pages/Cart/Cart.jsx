import { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import BreadCrumb from "../../components/Customer/BreadCrumb/BreadCrumb";
import CartProduct from "../../components/Customer/CartProduct/CartProduct";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { formatNumber } from "../../components/longFunctions";
import "./cart.css";
import EmptyCart from "../../images/cart-empty.webp";

const Cart = () => {
  const { BACKEND_URL, config } = useContext(AuthContext);
  const [storeProducts, setStoreProducts] = useState([]);

  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const history = useHistory();
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
    }
  };
  useEffect(() => {
    fetchCart();
    // handleQuantityChange();
  }, []);

  useEffect(() => {}, []);

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
                    <img src={store.store.avatar} alt="" />
                    <h2>{store.store.name}</h2>
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
                      {store.items.map((product) => (
                        <CartProduct
                          product={product.product}
                          productQuantity={product.quantity}
                          key={product.id}
                          fetchCart={fetchCart}
                          setTotal={setTotal}
                          // handleQuantityChange={handleQuantityChange}
                        />
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
              <h2>Your cart is currently</h2>
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
    </div>
  );
};

export default Cart;
