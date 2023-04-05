import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { formatNumber } from "../../components/longFunctions";
import axios from "axios";

import BreadCrumb from "../../components/Customer/BreadCrumb/BreadCrumb";
import "./checkout.css";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const Checkout = () => {
  const { BACKEND_URL, config, currentUser } = useContext(AuthContext);
  const [storeProducts, setStoreProducts] = useState([]);
  const [address, setAddress] = useState(
    currentUser.addresses[currentUser.addresses.length - 1]
  );
  const [selectedAddress, setSelectedAddress] = useState(address);
  const [openChooseAddress, setOpenChooseAddress] = useState(false);
  const toast = useToast();
  const history = useHistory();
  const subTotalPrice = storeProducts.reduce((accumulator, currentValue) => {
    const itemTotal = currentValue.items.reduce((itemAccumulator, item) => {
      return itemAccumulator + item.product.price * item.quantity;
    }, 0);
    return accumulator + itemTotal;
  }, 0);
  const fetchCart = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/customer/cart`,
        config
      );
      setStoreProducts(data.data);
    } catch (error) {}
  };

  const handleCheckout = async () => {
    try {
      await axios.post(`${BACKEND_URL}/api/customer/checkout`, {}, config);
      toast({
        title: "Checkout successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      history.push("/");
    } catch (error) {
      toast({
        title: "An error occurred checking out",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  useEffect(() => {
    fetchCart();
    document.title = "Checkout | BazaarBay";
  }, []);

  console.log(storeProducts);
  return (
    <div
      className="checkout"
      style={{ overflow: openChooseAddress ? "hidden" : "scroll" }}
    >
      <BreadCrumb title="Cart / Checkout" />
      <div className="checkoutContainer">
        <div className="deliveryLocation">
          <div className="deliveryTitle">
            <FontAwesomeIcon icon={faLocationDot} className="locationIcon" />
            <h2>Delivery Location</h2>
          </div>
          <div className="customerLocationInfo">
            <span className="customerName">{currentUser.name}</span>
            <span className="customerPhone">{currentUser.phoneNumber}</span>
            <span className="customerLocation">{address}</span>
            <button
              className="button"
              onClick={() => setOpenChooseAddress(true)}
            >
              Change
            </button>
          </div>
        </div>
        {storeProducts.map((product) => (
          <div className="checkoutProducts" key={product.id}>
            <div className="shopInfo">
              <img src={product.store.avatar} alt="" className="shopAvatar" />
              <span className="shopName">{product.store.name}</span>
            </div>
            <table>
              <thead>
                <tr style={{ display: "flex", paddingBottom: "15px" }}>
                  <th
                    style={{
                      flex: "6",
                      color: "#222",
                      fontSize: "18px",
                      fontWeight: "600",
                    }}
                  >
                    Product
                  </th>
                  <th style={{ flex: "1.5" }}>Price</th>
                  <th style={{ flex: "1.5", textAlign: "center" }}>Quantity</th>
                  <th style={{ flex: "2.5", textAlign: "right" }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {product.items.map((item) => (
                  <tr style={{ display: "flex" }}>
                    <td
                      style={{
                        flex: "6",
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      <img src={item.product.images[0]} alt="" />
                      <span>{item.product.name}</span>
                    </td>
                    <td style={{ flex: "1.5" }}>
                      {" "}
                      <span className="price-symbol">₫</span>
                      {formatNumber(item.product.price)}
                    </td>
                    <td style={{ flex: "1.5", justifyContent: "center" }}>
                      {item.quantity}
                    </td>
                    <td style={{ flex: "2.5", justifyContent: "flex-end" }}>
                      <span className="price-symbol">₫</span>
                      {formatNumber(item.product.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="deliveryOption">
              <div className="deliveryPartner">
                <span className="deliveryHeading">Delivery Partner: </span>
                <span className="deliveryPartnerName">Giao hang nhanh vcl</span>
                <span className="deliveryChangeText">Change</span>
              </div>
              <div className="deliveryPrice">50k</div>
            </div>
            <div className="totalProductPrice">
              <span>{`Total price (2 products): `}</span>
              <span>
                <span className="price-symbol">₫</span>

                {formatNumber(
                  product.items.reduce((accumulator, item) => {
                    return accumulator + item.product.price * item.quantity;
                  }, 0) + 50000
                )}
              </span>
            </div>
          </div>
        ))}

        <div className="cartTotal">
          <div className="cartTotalContainer">
            <div className="paymentMethod">
              <span>Payment method</span>
            </div>
            <div className="cartTotalPrice">
              <div className="cartTotalPriceContainer">
                <table>
                  <tbody>
                    <tr>
                      <td className="priceHeading">Product Price</td>
                      <td className="price">
                        <span className="price-symbol">₫</span>
                        {formatNumber(subTotalPrice)}
                      </td>
                    </tr>
                    <tr>
                      <td className="priceHeading">Shipment Fee</td>
                      <td className="price">
                        <span className="price-symbol">₫</span>
                        {formatNumber(50000)}
                      </td>
                    </tr>
                    <tr>
                      <td className="priceHeading">Total Price:</td>
                      <td className="price totalPrice">
                        <span className="price-symbol">₫</span>
                        {formatNumber(subTotalPrice + 50000)}
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* <div className="productPrice">
                  <h2>Product price</h2>
                  <span>
                    <span className="price-symbol">₫</span>
                    {formatNumber(subTotalPrice)}
                  </span>
                </div>
                <div className="shipmentFee">
                  <h2>Shipment fee</h2>
                  <span>{formatNumber(50000)}</span>
                </div>
                <div className="totalPrice">
                  <h2>Total price:</h2>
                  <span style={{ fontSize: "25px" }}>
                    {formatNumber(subTotalPrice + 50000)}
                  </span>
                </div> */}
                <button className="checkoutButton" onClick={handleCheckout}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          openChooseAddress ? "chooseAddress open" : "chooseAddress close"
        }
      >
        <div className="chooseAddressContainer">
          <h2>My Address</h2>
          <ul>
            {currentUser.addresses.map((a, i) => (
              <li
                key={i}
                className={a === selectedAddress ? "selected" : ""}
                onClick={() => setSelectedAddress(a)}
              >
                {a}
              </li>
            ))}
          </ul>
          <div className="chooseAddressButtons">
            <button
              className="button"
              onClick={() => setOpenChooseAddress(false)}
            >
              Cancel
            </button>
            <button
              className="button"
              onClick={() => {
                setAddress(selectedAddress);
                setOpenChooseAddress(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
