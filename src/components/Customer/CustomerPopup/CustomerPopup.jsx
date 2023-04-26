import React from "react";
import { useRef, useEffect } from "react";
import "./customerPopup.css";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import { formatNumber } from "../../longFunctions";

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
}) => {
  const popup = useRef();
  const toast = useToast();
  const { BACKEND_URL, config, setCurrentUser } = useContext(AuthContext);
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
        </div>
        <div className="deleteBtnContainer">
          <button className="button" onClick={() => handleConfirm(popupType)}>
            Yes
          </button>
          <button className="button" onClick={() => setOpen(false)}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerPopup;
