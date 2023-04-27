import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "./cartPreview.css";
import { formatNumber } from "../../longFunctions";
import { Link, useHistory } from "react-router-dom";
import EmptyCart from "../../../images/emptycart.jpg";

const CartPreview = ({ open, setOpen, products }) => {
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  return (
    <div
      className={open ? "cartPreview" : "cartPreview"}
      onMouseOver={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {currentUser && products.length > 0 && (
        <div className="cartPreviewContainer">
          <div className="cartPreviewHeader">Recently added products</div>
          <div className="cartPreviewProducts">
            <ul>
              {products.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  onClick={() => {
                    history.push(`/product/${item.product.id}`);
                    setOpen(false);
                  }}
                >
                  {/* <Link to={`/product/${item.product.id}`}> */}
                  <div className="cartProductLeft">
                    <img src={item.product.images[0]} alt="" />
                    <span>{`${item.product.name.substring(0, 50)}${
                      item.product.name.length > 50 ? "..." : ""
                    }`}</span>
                  </div>
                  <div className="cartProductRight">
                    <span className="price-symbol">₫</span>
                    {formatNumber(item.product.price)}
                  </div>
                  {/* </Link> */}
                </li>
              ))}
            </ul>
          </div>
          <div className="seeCartBtn">
            <button
              className="button"
              onClick={() => {
                history.push("/cart");
                setOpen(false);
              }}
            >
              View your cart
            </button>
          </div>
        </div>
      )}
      {((currentUser && products.length === 0) || !currentUser) && (
        <div className="cartPreviewContainer">
          <img src={EmptyCart} alt="" className="emptyCart" />
          <div className="emptyCartText">
            <h2>Your cart is empty</h2>
            <span>
              Looks like you have not added anything to your cart. Go ahead &
              explore top categories
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPreview;
