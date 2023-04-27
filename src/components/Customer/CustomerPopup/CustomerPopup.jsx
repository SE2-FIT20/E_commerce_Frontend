import React from "react";
import { useRef, useEffect } from "react";
import "./customerPopup.css";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import { formatNumber } from "../../longFunctions";
import { useHistory } from "react-router-dom";

const CustomerPopup = ({
  open,
  setOpen,
  popupType,
  creditCard,
  fetchCreditCards,
  amount,
  order,
  fetchOrders,
  fetchOrderTypeCount,
  review,
  fetchReviews,
}) => {
  const history = useHistory();
  const popup = useRef();
  const toast = useToast();
  const { BACKEND_URL, config, setCurrentUser, token } =
    useContext(AuthContext);
  const handleConfirm = async (popupType) => {
    if (popupType === "delete-credit-card") {
      await axios.delete(
        `${BACKEND_URL}/api/customer/payment-information/${creditCard.id}`,
        config
      );
      setOpen(false);
      fetchCreditCards();
      toast({
        title: "Delete credit card successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } else if (popupType === "top-up-balance") {
      await axios.put(
        `${BACKEND_URL}/api/customer/top-up-balance`,
        {
          paymentInformationId: creditCard.id,
          amount,
        },
        config
      );
      toast({
        title: `Recharge ₫${formatNumber(amount)} successful!`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      const { data } = await axios.get(
        `${BACKEND_URL}/api/customer/account`,
        config
      );
      setCurrentUser(data.data);
      window.location.reload();
    } else if (popupType === "customer-cancel-order") {
      await axios.put(
        `${BACKEND_URL}/api/customer/update-status-order`,
        {
          orderId: order.id,
          status: "CANCELLED_BY_CUSTOMER",
        },
        config
      );
      toast({
        title: `Cancel order successful!`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setOpen(false);
      fetchOrders();
      fetchOrderTypeCount();
      const { data } = await axios.get(`${BACKEND_URL}/api/customer/account`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(data.data);
    } else if (popupType === "delete-review") {
      await axios.delete(
        `${BACKEND_URL}/api/customer/review/${review.id}`,

        config
      );
      toast({
        title: `Delete review successful!`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setOpen(false);
      fetchReviews();
      const { data } = await axios.get(`${BACKEND_URL}/api/customer/account`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setCurrentUser(data.data);
    } else if (popupType === "nav-credit-card") {
      history.push("/account/wallet")
    }
  };
  useEffect(() => {
    function handleClickOutside(event) {
      if (popup.current && !popup.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popup]);
  return (
    <div className={open ? "popup open" : "popup"}>
      <div className="popupContainer" ref={popup}>
        <div className="deleteTitle">
          {popupType === "delete-credit-card" && (
            <span>{`Are you sure you want to delete this credit card?`}</span>
          )}
          {popupType === "top-up-balance" && (
            <span>{`Are you sure you want to recharge ₫${formatNumber(
              amount
            )}?`}</span>
          )}
          {popupType === "customer-cancel-order" && (
            <span>{`Are you sure you want to cancel this order?`}</span>
          )}
          {popupType === "delete-review" && (
            <span>{`Are you sure you want to delete this review?`}</span>
          )}
          {popupType === "nav-credit-card" && (
            <span>{`Your account is not linked to any credit card. Do you want to add a new one?`}</span>
          )}
        </div>
        {popupType !== "nav-credit-card" && (
          <div className="deleteBtnContainer">
            <button className="button" onClick={() => handleConfirm(popupType)}>
              Yes
            </button>
            <button className="button" onClick={() => setOpen(false)}>
              No
            </button>
          </div>
        )}
        {popupType == "nav-credit-card" && (
          <div className="deleteBtnContainer">
            <button className="button" onClick={() => handleConfirm(popupType)}>
              OK
            </button>
            <button
              className="button cancelButton"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPopup;
