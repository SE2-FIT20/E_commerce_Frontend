import React from "react";
import { useRef, useEffect } from "react";
import "./customerPopup.css";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useToast } from "@chakra-ui/react";

const CustomerPopup = ({
  open,
  setOpen,
  popupType,
  creditCard,
  fetchCreditCards,
}) => {
  const popup = useRef();
  const toast = useToast();
  const { BACKEND_URL, config } = useContext(AuthContext);
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
