import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faMinus,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import {
  revertTimeStamp,
  formatDaysToStart,
  formatDaysLeft,
} from "../../longFunctions";
import { useHistory } from "react-router-dom";
import "./storeCoupon.css"

const StoreCoupon = ({
  coupon,
  setSelectedVoucher,
}) => {
  const { BACKEND_URL, config, currentUser } = useContext(AuthContext);
  const toast = useToast();
  const history = useHistory();
  const [quantity, setQuantity] = useState(coupon.quantityAvailable);

  const handleClickPlus = async (couponId) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/store/coupon-sets/${couponId}/add?quantity=1`,
        {},
        config
      );
      setQuantity((prev) => prev + 1);
    } catch (error) {
      toast({
        title: "An error adding voucher to set",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleClickMinus = async (couponId) => {
    if (quantity === 1) return;
    try {
      await axios.put(
        `${BACKEND_URL}/api/store/coupon-sets/${couponId}/subtract?quantity=1`,
        {},
        config
      );
      setQuantity((prev) => (prev === 1 ? prev : prev - 1));
    } catch (error) {
      toast({
        title: "An error adding voucher to set",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleClickDelete = async () => {
    
  };
  return (
    <tr>
      <th style={{ flex: "4" }}>
        <div className="voucher" style={{ textAlign: "left" }}>
          <div className="voucherLeft">
            <div className="voucherImage">
              <img src={currentUser.avatar} alt="" />
              <span>{currentUser.name}</span>
            </div>
            <div className="voucherInfo">
              <div className="voucherBasicInfo">
                <h2 className="voucherPercent">
                  {`Discount ${coupon.percent}%`}
                </h2>
                <span className="voucherDescription">
                  {`${coupon.description.substring(0, 60)}${
                    coupon.description.length > 60 ? "..." : ""
                  }`}
                </span>
              </div>
              {/* {revertTimeStamp(coupon.startAt) >=
                revertTimeStamp(new Date()) && (
                <span className="voucherExpired">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{formatDaysToStart(coupon.startAt)}</span>
                </span>
              )} */}
              {/* {revertTimeStamp(coupon.startAt) <
                revertTimeStamp(new Date()) && ( */}
                <span className="voucherExpired">
                  <FontAwesomeIcon icon={faClock} />
                  <span>{formatDaysLeft(coupon.expiredAt)}</span>
                </span>
              {/* )} */}
            </div>
          </div>
        </div>
      </th>
      <th>
        <div className="voucherQuantityContainer">
          <div
            className="voucherMinus"
            onClick={() => handleClickMinus(coupon.id)}
            style={{ cursor: quantity === 1 ? "not-allowed" : "pointer" }}
          >
            <FontAwesomeIcon icon={faMinus} />
          </div>
          <div className="voucherQuantity">100</div>
          <div
            className="voucherPlus"
            onClick={() => handleClickPlus(coupon.id)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
      </th>
      <th>
        <div className="voucherDeleteIcon" onClick={() => history.push(`/admin/vouchers/update/${coupon.id}`)}>
          <FontAwesomeIcon icon={faPen} />
        </div>
        <div className="voucherDeleteIcon" onClick={handleClickDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </th>
    </tr>
  );
};

export default StoreCoupon;
