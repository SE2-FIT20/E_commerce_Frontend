import React from "react";
import { useRef, useEffect } from "react";
import "./storePopup.css";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import { formatNumber } from "../../longFunctions";

const StorePopup = ({ open, setOpen, popupType, coupon, fetchCoupons }) => {
  const popup = useRef();
  const toast = useToast();
  const { BACKEND_URL, config, setCurrentUser } = useContext(AuthContext);
  const handleConfirm = async (popupType) => {
    if (popupType === "delete-coupon") {
      try {
        await axios.delete(
          `${BACKEND_URL}/api/store/coupon-sets/${coupon.id}`,
          config
        );
        toast({
          title: "Delete coupon successful!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });

        setOpen(false);
        fetchCoupons();
      } catch (error) {
        toast({
          title: "An error occurred while deleting coupon!",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
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
          {popupType === "delete-coupon" && (
            <span>{`Are you sure you want to delete this coupon?`}</span>
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

export default StorePopup;
