import React, { useContext, useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faClock,
  faMinus,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import BazaarBayIcon from "../../../images/bazaarbay-icon.ico";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import {
  revertTimeStamp,
  formatDaysToStart,
  formatDaysLeft,
} from "../../longFunctions";
import "./promotion.css";
import { useHistory } from "react-router-dom";

const Promotion = ({
  voucher,
  setOpenPopup,
  setPopupType,
  setSelectedVoucher,
}) => {
  const { BACKEND_URL, config } = useContext(AuthContext);
  const toast = useToast();
  const history = useHistory();

  const handleClickDelete = async () => {
    setOpenPopup(true);
    setPopupType("deleteVoucher");
    setSelectedVoucher(voucher);
  };
  return (
    <tr>
      <th style={{ flex: "4" }}>
        <div className="voucher" style={{ textAlign: "left" }}>
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
        </div>
      </th>
    </tr>
  );
};

export default Promotion;
