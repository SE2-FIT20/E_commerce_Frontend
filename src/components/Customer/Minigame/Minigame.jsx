import React, { useContext, useEffect, useState, useRef } from "react";
import "./minigame.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faClock } from "@fortawesome/free-solid-svg-icons";
import BazaarBayIcon from "../../../images/bazaarbay-icon.ico";
import {
  formatDaysLeft,
  formatDaysToStart,
  revertTimeStamp,
} from "../../longFunctions";
import { useToast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

const Minigame = () => {
  const toast = useToast();
  const history = useHistory();
  const { BACKEND_URL, config, currentUser } = useContext(AuthContext);
  const [vouchers, setVouchers] = useState([]);
  const [wheelItems, setWheelItems] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [openVoucherPopup, setOpenVoucherPopup] = useState(false);
  const [spinnable, setSpinnable] = useState(true);
  const [timeLeft, setTimeLeft] = useState("");
  const box = useRef();
  const element = useRef();
  const voucherPopupRef = useRef();
  const handleShuffle = (array) => {
    let currentIndex = array.length;
    let randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[currentIndex],
        array[currentIndex],
      ];
    }
    return array;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const timeLeft = midnight - now;

      const hoursLeft = Math.floor(timeLeft / 1000 / 60 / 60)
        .toString()
        .padStart(2, "0");
      const minutesLeft = Math.floor((timeLeft / 1000 / 60) % 60)
        .toString()
        .padStart(2, "0");
      const secondsLeft = Math.floor((timeLeft / 1000) % 60)
        .toString()
        .padStart(2, "0");

      const timeLeftFormatted =
        hoursLeft + ":" + minutesLeft + ":" + secondsLeft;

      setTimeLeft(timeLeftFormatted);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const fetchSpinnable = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/customer/check-eligible-to-play-mini-game`,
        config
      );
      setSpinnable(data.data.eligible);
    } catch (error) {}
  };

  const handleSaveVoucher = async (voucherId) => {
    try {
      await axios.put(
        `${BACKEND_URL}/api/customer/vouchers-coupons/${voucherId}`,
        {},
        config
      );
      toast({
        title: "Save voucher successful",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {}
  };
  const handleSpin = () => {
    if (!currentUser) {
      history.push("/login");
      return;
    }
    let firstItem = handleShuffle([1890, 2250, 2610]);
    let secondItem = handleShuffle([1860, 2210, 2570]);
    let thirdItem = handleShuffle([1810, 2170, 2530]);
    let forthItem = handleShuffle([1780, 2140, 2500]);
    let fifthItem = handleShuffle([1740, 2100, 2460]);
    let sixthItem = handleShuffle([1710, 2070, 2430]);
    let seventhItem = handleShuffle([1680, 2040, 2400]);
    let eightthItem = handleShuffle([1640, 2000, 2360]);
    let ninethItem = handleShuffle([1610, 1970, 2330]);
    let tenthItem = handleShuffle([1580, 1940, 2300]);

    let results = handleShuffle([
      firstItem[0],
      secondItem[0],
      thirdItem[0],
      forthItem[0],
      fifthItem[0],
      sixthItem[0],
      seventhItem[0],
      eightthItem[0],
      ninethItem[0],
      tenthItem[0],
    ]);
    if (firstItem.includes(results[0])) setSelectedVoucher(wheelItems[0]);
    if (secondItem.includes(results[0])) setSelectedVoucher(wheelItems[1]);
    if (thirdItem.includes(results[0])) setSelectedVoucher(wheelItems[2]);
    if (forthItem.includes(results[0])) setSelectedVoucher(wheelItems[3]);
    if (fifthItem.includes(results[0])) setSelectedVoucher(wheelItems[4]);
    if (sixthItem.includes(results[0])) setSelectedVoucher(wheelItems[5]);
    if (seventhItem.includes(results[0])) setSelectedVoucher(wheelItems[6]);
    if (eightthItem.includes(results[0])) setSelectedVoucher(wheelItems[7]);
    if (ninethItem.includes(results[0])) setSelectedVoucher(wheelItems[8]);
    if (tenthItem.includes(results[0])) setSelectedVoucher("");
    if (box.current && element.current) {
      box.current.style.transition = "all ease 5s";
      box.current.style.transform = `rotate(${results[0]}deg)`;
      element.current.classList.remove("animate");

      setTimeout(() => {
        element.current.classList.add("animate");
        setOpenVoucherPopup(true);
      }, 5000);
      setTimeout(() => {
        box.current.style.transition = "initial";
        box.current.style.transform = `rotate(90deg)`;
        setSpinnable(false);
      }, 6000);
    }
  };
  const fetchVouchers = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/mini-game-vouchers`);
      setVouchers(data.data.slice(0, 9));
    } catch (error) {}
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        voucherPopupRef.current &&
        !voucherPopupRef.current.contains(event.target)
      ) {
        setOpenVoucherPopup(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [voucherPopupRef]);

  useEffect(() => {
    if (currentUser) fetchSpinnable();
    fetchVouchers();
  }, []);

  useEffect(() => {
    if (vouchers.length === 1) {
      setWheelItems([
        ...vouchers,
        vouchers[0],
        vouchers[0],
        vouchers[0],
        vouchers[0],
        vouchers[0],
        vouchers[0],
        vouchers[0],
        vouchers[0],
        vouchers[0],
        "",
      ]);
    } else if (vouchers.length === 2) {
      setWheelItems([
        ...vouchers,
        vouchers[0],
        vouchers[1],
        vouchers[0],
        vouchers[1],
        vouchers[0],
        vouchers[1],
        vouchers[0],
        "",
      ]);
    } else if (vouchers.length === 3) {
      setWheelItems([
        ...vouchers,
        vouchers[0],
        vouchers[1],
        vouchers[2],
        vouchers[0],
        vouchers[1],
        vouchers[2],
        "",
      ]);
    } else if (vouchers.length === 4) {
      setWheelItems([
        ...vouchers,
        vouchers[0],
        vouchers[1],
        vouchers[2],
        vouchers[0],
        vouchers[1],
        "",
      ]);
    } else if (vouchers.length === 5) {
      setWheelItems([
        ...vouchers,
        vouchers[0],
        vouchers[1],
        vouchers[2],
        vouchers[0],
        "",
      ]);
    } else if (vouchers.length === 6) {
      setWheelItems([...vouchers, vouchers[0], vouchers[1], vouchers[0], ""]);
    } else if (vouchers.length === 7) {
      setWheelItems([...vouchers, vouchers[0], vouchers[1], ""]);
    } else if (vouchers.length === 8) {
      setWheelItems([...vouchers, vouchers[0], ""]);
    } else {
      setWheelItems([...vouchers, ""]);
    }
  }, [vouchers]);


  return (
    <div className="minigame">
      <div className="minigameContainer">
        <h2>Minigame</h2>
        <span>{`Get ready to spin and win! Our wheel of fortune minigame is packed with vouchers for all kinds of products. Give it a spin and see what you can win - prizes range from 5% to 80%!`}</span>
        {wheelItems.length === 10 && (
          <div className="vouchersContainer">
            <div className="mainbox" id="mainbox" ref={element}>
              <div className="box" id="box" ref={box}>
                <div className="box1">
                  <span className="font span1">
                    <h5>{`${wheelItems[8].percent}%`}</h5>
                  </span>
                  <span className="font span2">
                    <h5>0%</h5>
                  </span>
                  <span className="font span3">
                    <h5>{`${wheelItems[0].percent}%`}</h5>
                  </span>
                  <span className="font span4">
                    <h5>{`${wheelItems[1].percent}%`}</h5>
                  </span>
                  <span className="font span5">
                    <h5>{`${wheelItems[2].percent}%`}</h5>
                  </span>
                </div>
                <div className="box2">
                  <span className="font span1">
                    <h5>{`${wheelItems[3].percent}%`}</h5>
                  </span>
                  <span className="font span2">
                    <h5>{`${wheelItems[4].percent}%`}</h5>
                  </span>

                  <span className="font span3">
                    <h5>{`${wheelItems[5].percent}%`}</h5>
                  </span>

                  <span className="font span4">
                    <h5>{`${wheelItems[6].percent}%`}</h5>
                  </span>

                  <span className="font span5">
                    <h5>{`${wheelItems[7].percent}%`}</h5>
                  </span>
                </div>
              </div>
              <button
                className="spin"
                onClick={() => spinnable ? handleSpin(vouchers) : null}
                style={{ fontSize: !spinnable && "12px" }}
              >
                {spinnable ? "SPIN" : `Time left: ${timeLeft}`}
              </button>
            </div>
          </div>
        )}
      </div>
      {selectedVoucher && (
        <div
          className={openVoucherPopup ? "voucherPopup open" : "voucherPopup"}
        >
          <div className="voucherPopupContainer" ref={voucherPopupRef}>
            <h2>Congratulations!</h2>
            <span>{`You have won a ${selectedVoucher.percent}% discount voucher!!`}</span>
            <div className="voucher">
              <div className="voucherLeft">
                <div className="voucherImage">
                  <img src={BazaarBayIcon} alt="" />
                  <span>BazaarBay</span>
                </div>
                <div className="voucherInfo">
                  <div className="voucherBasicInfo">
                    <h2 className="voucherPercent">{`Discount ${selectedVoucher.percent}%`}</h2>
                    <span className="voucherDescription">
                      {`${selectedVoucher.description.substring(0, 60)}${
                        selectedVoucher.description.length > 60 ? "..." : ""
                      }`}
                    </span>
                  </div>
                  {revertTimeStamp(selectedVoucher.startAt) >=
                    revertTimeStamp(new Date()) && (
                    <span className="voucherExpired">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{formatDaysToStart(selectedVoucher.startAt)}</span>
                    </span>
                  )}
                  {revertTimeStamp(selectedVoucher.startAt) <
                    revertTimeStamp(new Date()) && (
                    <span className="voucherExpired">
                      <FontAwesomeIcon icon={faClock} />
                      <span>{formatDaysLeft(selectedVoucher.expiredAt)}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              className="button"
              onClick={() => {
                setOpenVoucherPopup(false);
                handleSaveVoucher(selectedVoucher.id);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {!selectedVoucher && (
        <div
          className={openVoucherPopup ? "voucherPopup open" : "voucherPopup"}
        >
          <div className="voucherPopupContainer" ref={voucherPopupRef}>
            <h2>Better luck next time!</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Minigame;
