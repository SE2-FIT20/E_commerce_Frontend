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
import { useHistory } from "react-router-dom";

const AdminVoucher = ({
  voucher,
  setOpenPopup,
  setPopupType,
  setSelectedVoucher,
}) => {
  const { BACKEND_URL, config } = useContext(AuthContext);
  const toast = useToast();
  const history = useHistory();
  const [quantity, setQuantity] = useState(voucher.quantityAvailable);

  const handleClickPlus = async (voucherId) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/admin/voucher-sets/${voucherId}/add?quantity=1`,
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

  const handleClickMinus = async (voucherId) => {
    if (quantity === 1) return;
    try {
      await axios.put(
        `${BACKEND_URL}/api/admin/voucher-sets/${voucherId}/subtract?quantity=1`,
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
    setOpenPopup(true);
    setPopupType("deleteVoucher");
    setSelectedVoucher(voucher);
  };
  return (
    <tr>
      <th style={{ flex: "4" }}>
        <div className="voucher" style={{ textAlign: "left" }}>
          <div className="voucherLeft">
            <div className="voucherImage">
              <img src={BazaarBayIcon} alt="" />
              <span>BazaarBay</span>
            </div>
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
      <th>
        <div className="voucherQuantityContainer">
          <div
            className="voucherMinus"
            onClick={() => handleClickMinus(voucher.id)}
            style={{ cursor: quantity === 1 ? "not-allowed" : "pointer" }}
          >
            <FontAwesomeIcon icon={faMinus} />
          </div>
          <div className="voucherQuantity">{quantity}</div>
          <div
            className="voucherPlus"
            onClick={() => handleClickPlus(voucher.id)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
      </th>
      <th>
        <div className="voucherDeleteIcon" onClick={() => history.push(`/admin/vouchers/update/${voucher.id}`)}>
          <FontAwesomeIcon icon={faPen} />
        </div>
        <div className="voucherDeleteIcon" onClick={handleClickDelete}>
          <FontAwesomeIcon icon={faTrash} />
        </div>
      </th>
    </tr>
  );
};

export default AdminVoucher;
