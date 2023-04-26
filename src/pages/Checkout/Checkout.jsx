import {
  faLocationDot,
  faCheck,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  formatDaysLeft,
  formatDaysToStart,
  formatNumber,
  revertTimeStamp,
} from "../../components/longFunctions";
import axios from "axios";
import CashOnDelivery from "../../images/cash-on-delivery-icon.png";
import WalletBanking from "../../images/wallet-banking-icon.png";
import WarningIcon from "../../images/warning-icon.png";
import ConfirmCheckout from "../../images/confirm-checkout.png";
import BreadCrumb from "../../components/Customer/BreadCrumb/BreadCrumb";
import "./checkout.css";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import Footer from "../../components/Customer/Footer/Footer";
import BazaarBayIcon from "../../images/bazaarbay-icon.ico";
import { faClock } from "@fortawesome/free-regular-svg-icons";

const Checkout = () => {
  const { BACKEND_URL, config, currentUser, setCurrentUser } =
    useContext(AuthContext);
  const [storeProducts, setStoreProducts] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [address, setAddress] = useState(
    currentUser.addresses[currentUser.addresses.length - 1]
  );
  const [vouchers, setVouchers] = useState([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState("CASH_ON_DELIVERY");
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(address);
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [chosenVouchers, setChosenVouchers] = useState([]);
  const [selectedDeliveryPartnerId, setSelectedDeliveryPartnerId] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [totalDiscount, setTotalDiscount] = useState(0);
  const [openProvideInfo, setOpenProvideInfo] = useState(false);
  const [openChooseAddress, setOpenChooseAddress] = useState(false);
  const [openConfirmCheckout, setOpenConfirmCheckout] = useState(false);
  const [openChooseVoucher, setOpenChooseVoucher] = useState(false);
  const [openChooseDeliveryPartner, setOpenChooseDeliveryPartner] =
    useState(false);
  const provideInfo = useRef();
  const chooseAddressRef = useRef();
  const chooseDeliveryPartnerRef = useRef();
  const chooseVoucherRef = useRef();
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

  const fetchVoucher = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/customer/vouchers-coupons-to-add-to-cart`,
        config
      );
      setVouchers(data.data.usable);
    } catch (error) {}
  };

  const fetchDeliveryPartners = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/delivery-partners`);
      setDeliveryPartners(data.data.content);
      setSelectedDeliveryPartnerId(8);
    } catch (error) {}
  };

  const handleAddVoucherToCart = async (voucher) => {
    try {
      // await axios.put(
      //   `${BACKEND_URL}/api/customer/add-voucher-coupon-to-cart/${voucher.id}`,
      //   {},
      //   config
      // );
      toast({
        title: "Add voucher successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setSelectedVouchers(chosenVouchers);
      setOpenChooseVoucher(false);
    } catch (error) {
      toast({
        title: "You can add only 1 voucher and/or 1 coupon!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleChooseVoucher = (voucher) => {
    if (chosenVouchers.some((v) => v.id === voucher.id)) {
      setChosenVouchers(chosenVouchers.filter((v) => v.id !== voucher.id));
    } else {
      setChosenVouchers([...chosenVouchers, voucher]);
    }
  };

  const handleRemoveVoucherFromCart = async (voucher) => {
    try {
      // await axios.put(
      //   `${BACKEND_URL}/api/customer/remove-voucher-coupon-to-cart/${voucher.id}`,
      //   {},
      //   config
      // );
      setSelectedVouchers(chosenVouchers.filter((v) => v.id !== voucher.id));
      setChosenVouchers(chosenVouchers.filter((v) => v.id !== voucher.id));
    } catch (error) {}
  };
  const handleCheckout = async () => {
    if (currentUser.addresses.length === 0 || !currentUser.phoneNumber) {
      setOpenProvideInfo(true);
      return;
    } else {
      setLoading(true);
      try {
        await axios.post(
          `${BACKEND_URL}/api/customer/checkout`,
          {
            deliveryPartnerId: selectedDeliveryPartnerId,
            destinationAddress: selectedAddress,
            paymentMethod: selectedPaymentMethod,
          },
          config
        );
        toast({
          title: "Checkout successful",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });

        setLoading(false);
        setOpenConfirmCheckout(true);
        const { data } = await axios.get(
          `${BACKEND_URL}/api/customer/account`,
          config
        );
        setCurrentUser(data.data);
      } catch (error) {
        toast({
          title: "An error occurred checking out",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    fetchCart();
    fetchVoucher();
    fetchDeliveryPartners();
    document.title = "Checkout | BazaarBay";
  }, []);

  useEffect(() => {
    if (deliveryPartners.length > 0) {
      setShippingFee(
        deliveryPartners.filter(
          (deliveryPartner) => deliveryPartner.id === selectedDeliveryPartnerId
        )[0].shippingFee
      );
    }
  }, [selectedDeliveryPartnerId]);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        chooseAddressRef.current &&
        !chooseAddressRef.current.contains(event.target)
      ) {
        setOpenChooseAddress(false);
      }
      if (
        chooseDeliveryPartnerRef.current &&
        !chooseDeliveryPartnerRef.current.contains(event.target)
      ) {
        setOpenChooseDeliveryPartner(false);
      }
      if (provideInfo.current && !provideInfo.current.contains(event.target)) {
        setOpenProvideInfo(false);
      }
      if (
        chooseVoucherRef.current &&
        !chooseVoucherRef.current.contains(event.target)
      ) {
        setOpenChooseVoucher(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [
    chooseAddressRef,
    chooseDeliveryPartnerRef,
    provideInfo,
    chooseVoucherRef,
  ]);

  useEffect(() => {
    setTotalDiscount(
      selectedVouchers.reduce(
        (accumulator, currentValue) => accumulator + currentValue.percent,
        0
      ) < 100
        ? selectedVouchers.reduce(
            (accumulator, currentValue) => accumulator + currentValue.percent,
            0
          )
        : 99
    );
  }, [selectedVouchers]);

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
                      paddingRight: "15px",
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
                        paddingRight: "15px",
                      }}
                    >
                      <img src={item.product.images[0]} alt="" />
                      <span>{item.product.name}</span>
                    </td>
                    <td style={{ flex: "1.5" }}>
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

            <div className="totalProductPrice">
              <span>{`Total price (${product.items.reduce(
                (accumulator, item) => {
                  return accumulator + item.quantity;
                },
                0
              )} product${
                product.items.reduce((accumulator, item) => {
                  return accumulator + item.quantity;
                }, 0) > 1
                  ? "s"
                  : ""
              }): `}</span>
              <span>
                <span className="price-symbol">₫</span>

                {formatNumber(
                  product.items.reduce((accumulator, item) => {
                    return accumulator + item.product.price * item.quantity;
                  }, 0)
                )}
              </span>
            </div>
          </div>
        ))}

        <div className="deliveryOption">
          <div className="deliveryPartner">
            <span className="deliveryHeading">Delivery Partner: </span>
            <span className="deliveryPartnerName">
              {deliveryPartners.length > 0 &&
                deliveryPartners.filter(
                  (deliveryPartner) =>
                    deliveryPartner.id === selectedDeliveryPartnerId
                )[0].name}
            </span>
            <button
              className="button"
              onClick={() => setOpenChooseDeliveryPartner(true)}
            >
              Change
            </button>
          </div>
        </div>

        <div className="voucherOption">
          <div className="voucherOptionContainer">
            <h2>Voucher / Coupon</h2>
            <div className="chosenVouchers">
              {selectedVouchers.map((voucher) => (
                <div className="voucher" key={voucher.id}>
                  <div className="voucherLeft">
                    {voucher.store && (
                      <div className="voucherOptionImage voucherStore">
                        <img src={voucher.store.avatar} alt="" />
                        <span>{voucher.store.name}</span>
                      </div>
                    )}
                    {!voucher.store && (
                      <div className="voucherOptionImage">
                        <img src={BazaarBayIcon} alt="" />
                        <span>BazaarBay</span>
                      </div>
                    )}

                    <div className="voucherInfo">
                      <div className="voucherBasicInfo">
                        <h2 className="voucherPercent">{`Discount ${voucher.percent}%`}</h2>
                      </div>
                    </div>
                  </div>
                  <div
                    className="voucherRemove"
                    onClick={() => handleRemoveVoucherFromCart(voucher)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </div>
                </div>
              ))}
            </div>
            <button
              className="button"
              onClick={() => {
                setOpenChooseVoucher(true);
                setChosenVouchers(selectedVouchers);
              }}
            >
              Choose
            </button>
          </div>
        </div>

        <div className="cartTotal">
          <div className="cartTotalContainer">
            <div className="paymentMethod">
              <span>Payment method</span>
              <div
                className={
                  selectedPaymentMethod === "CASH_ON_DELIVERY"
                    ? "paymentItem selectedPaymentMethod"
                    : "paymentItem"
                }
                onClick={() => setSelectedPaymentMethod("CASH_ON_DELIVERY")}
              >
                <img src={CashOnDelivery} alt="" />
                <span>Cash On Delivery</span>
              </div>
              <div
                className={
                  selectedPaymentMethod === "ONLINE_PAYMENT"
                    ? "paymentItem selectedPaymentMethod"
                    : "paymentItem"
                }
                onClick={() => setSelectedPaymentMethod("ONLINE_PAYMENT")}
              >
                <img src={WalletBanking} alt="" />
                <span>Bazaar Wallet</span>
              </div>
            </div>
            <div className="cartTotalPrice">
              <div className="cartTotalPriceContainer">
                <table>
                  <tbody>
                    <tr>
                      <td className="priceHeading">Product Price:</td>
                      <td className="price">
                        <span className="price-symbol">₫</span>
                        {formatNumber(subTotalPrice)}
                      </td>
                    </tr>
                    {totalDiscount > 0 && (
                      <tr>
                        <td className="priceHeading">Voucher Discount:</td>
                        <td className="price">
                          <span className="price-symbol"></span>
                          {`${totalDiscount}%`}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td className="priceHeading">Shipment Fee:</td>
                      <td className="price">
                        <span className="price-symbol">₫</span>
                        {formatNumber(shippingFee)}
                      </td>
                    </tr>

                    <tr style={{ paddingTop: "20px" }}>
                      <td className="priceHeading">Total Price:</td>
                      <td className="priceTotalContainer">
                        <div className="price initialPrice">
                          <span className="price-symbol"></span>
                          {"₫" + formatNumber(subTotalPrice + shippingFee)}
                        </div>
                        <div className="price totalPrice">
                          {"₫" +
                            formatNumber(
                              subTotalPrice * ((100 - totalDiscount) / 100) +
                                shippingFee
                            )}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <button
                  className="checkoutButton"
                  onClick={handleCheckout}
                  style={{
                    padding: loading ? "15px 55px 15px 63px" : "15px 40px",
                  }}
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
                    "Checkout"
                  )}
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
        <div className="chooseAddressContainer" ref={chooseAddressRef}>
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
      <div
        className={
          openChooseDeliveryPartner
            ? "chooseDeliveryPartner open"
            : "chooseDeliveryPartner close"
        }
      >
        <div
          className="chooseDeliveryPartnerContainer"
          ref={chooseDeliveryPartnerRef}
        >
          <h2 className="chooseDeliveryPartnerHeading">
            Choose Delivery Partner
          </h2>
          <ul>
            {deliveryPartners.map((deliveryPartner) => (
              <li
                key={deliveryPartner.id}
                onClick={() => {
                  setSelectedDeliveryPartnerId(deliveryPartner.id);
                  setOpenChooseDeliveryPartner(false);
                }}
              >
                <div className="deliveryPartnerLeft">
                  <div className="deliveryPartnerAvatar">
                    <img src={deliveryPartner.avatar} alt="" />
                  </div>
                  <div className="deliveryPartnerInfo">
                    <h2>{deliveryPartner.name}</h2>
                    <span>{deliveryPartner.description}</span>
                  </div>
                </div>
                <div className="deliveryPartnerRight">
                  <span>
                    <span className="price-symbol">₫</span>
                    {formatNumber(deliveryPartner.shippingFee)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div
        className={openProvideInfo ? "provideInfo popup" : "provideInfo hide"}
      >
        <div className="provideInfoContainer" ref={provideInfo}>
          <img src={WarningIcon} alt="" />
          <h2>Your account does not have phone number or address!</h2>
          <span>Please provide phone number and address</span>
          <button
            className="button"
            onClick={() => {
              if (!currentUser.phoneNumber) history.push("/account/profile");
              else if (currentUser.addresses.length === 0)
                history.push("/account/address");
            }}
          >
            OK
          </button>
        </div>
      </div>
      <div
        className={
          openConfirmCheckout ? "confirmCheckout open" : "confirmCheckout close"
        }
      >
        <div className="confirmCheckoutContainer">
          <h2 className="confirmTitle">Your order has been received</h2>
          <div className="confirmImage">
            <img src={ConfirmCheckout} alt="" />
            <div className="confirmText">
              <h2>{`Hey ${currentUser.name},`}</h2>
              <span className="thankText">Thanks for your purchase!</span>
            </div>
          </div>
          <button className="confirmButton" onClick={() => history.push("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
      <div
        className={
          openChooseVoucher ? "chooseVoucher open" : "chooseVoucher close"
        }
      >
        <div className="chooseVoucherContainer" ref={chooseVoucherRef}>
          <h2>Choose your voucher/coupon</h2>
          <div className="vouchersToAdd">
            {vouchers.map((voucher) => (
              <div
                className="voucher"
                style={{ textAlign: "left" }}
                onClick={() => handleChooseVoucher(voucher)}
              >
                <div className="voucherLeft">
                  {voucher.store && (
                    <div className="voucherImage storeCoupon">
                      <img src={voucher.store.avatar} alt="" />
                      <span>{voucher.store.name}</span>
                    </div>
                  )}
                  {!voucher.store && (
                    <div className="voucherImage">
                      <img src={BazaarBayIcon} alt="" />
                      <span>BazaarBay</span>
                    </div>
                  )}

                  <div className="voucherInfo">
                    <div className="voucherBasicInfo">
                      <h2 className="voucherPercent">
                        {`Discount ${voucher.percent}%`}
                      </h2>
                      <span className="voucherDescription">
                        {`${voucher.description.substring(0, 60)}${
                          voucher.description.length > 60 ? "..." : ""
                        }`}
                      </span>
                    </div>
                    {revertTimeStamp(voucher.startAt) >=
                      revertTimeStamp(new Date()) && (
                      <span className="voucherExpired">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{formatDaysToStart(voucher.startAt)}</span>
                      </span>
                    )}
                    {revertTimeStamp(voucher.startAt) <
                      revertTimeStamp(new Date()) && (
                      <span className="voucherExpired">
                        <FontAwesomeIcon icon={faClock} />
                        <span>{formatDaysLeft(voucher.expiredAt)}</span>
                      </span>
                    )}
                  </div>
                </div>
                <div className="voucherCheck">
                  <div className="voucherCheckContainer">
                    {chosenVouchers.some((v) => v.id === voucher.id) && (
                      <FontAwesomeIcon icon={faCheck} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="chooseVoucherButtons">
            <button className="button" onClick={() => handleAddVoucherToCart()}>
              OK
            </button>
            <button
              className="button cancel"
              onClick={() => {
                setOpenChooseVoucher(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;
