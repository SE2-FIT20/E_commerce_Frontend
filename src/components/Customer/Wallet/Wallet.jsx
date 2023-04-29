import { useContext, useEffect, useState } from "react";
import "./wallet.css";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { capitalize, formatNumber } from "../../longFunctions";
import { border, useToast } from "@chakra-ui/react";
import VisaLogo from "../../../images/credit-card-logo.jpg";
import MasterCardLogo from "../../../images/master-card-logo.png";
import TopUpBalance from "../../../images/top-up-balance-icon.png";
import Transaction from "../../../images/transaction-icon.png";
import CreditCard from "../../../images/credit-cards-icon.png";
import Footer from "../Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import CustomerPopup from "../CustomerPopup/CustomerPopup";

const Wallet = () => {
  const { currentUser, setCurrentUser, BACKEND_URL, config, role } =
    useContext(AuthContext);
  const [creditCards, setCreditCards] = useState([]);
  const [walletOption, setWalletOption] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [selectedCreditCard, setSelectedCreditCard] = useState(null);
  const [openAddCreditCard, setOpenAddCreditCard] = useState(false);
  const [openTopUpBalance, setOpenTopUpBalance] = useState(false);
  const [amount, setAmount] = useState(0);
  const [chosenCreditCardIndex, setChosenCreditCardIndex] = useState(0);
  const [newCreditCard, setNewCreditCard] = useState({
    nameOnCard: "",
    cardNumber: "",
    cvv: "",
    expiredDate: "",
  });
  const handleChangeCreditCard = (e) => {
    setNewCreditCard((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const toast = useToast();
  const addCreditCard = useRef();
  const topUpBalance = useRef();

  const isValidCardNumberFormat = (str) => {
    return /^\d{16}$/.test(str);
  };
  const isValidExpiryDateFormat = (str) => {
    if (/^\d{2}\/\d{2}$/.test(str)) {
      const [month, year] = str.split("/");
      if (parseInt(month, 10) >= 1 && parseInt(month, 10) <= 12) {
        if (parseInt(year, 10) >= 0 && parseInt(year, 10) <= 99) {
          return true;
        }
      }
    }
    return false;
  };
  const handleCreditCardIndex = (index) => {
    if (index === chosenCreditCardIndex) {
      return 100;
    } else if (index < chosenCreditCardIndex) {
      return index;
    } else return 100 - index;
  };

  const fetchCreditCards = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/customer/payment-information`,
        config
      );
      setCreditCards(data.data);
    } catch (error) {
      if (
        error.response.data.message ===
        "Your account is locked! Please contact admin to unlock your account!"
      ) {
        setPopupType("account-locked")
        setOpenPopup(true);
        return;
      }
      toast({
        title: "An error occured while fetching credit cards!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleAddNewCreditCard = async () => {
    if (
      !newCreditCard.nameOnCard ||
      !newCreditCard.cardNumber ||
      !newCreditCard.cvv ||
      !newCreditCard.expiredDate
    ) {
      return toast({
        title: "Please fill all the required fields!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
    if (!isValidCardNumberFormat(newCreditCard.cardNumber)) {
      return toast({
        title: "Wrong card number format!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
    if (!isValidExpiryDateFormat(newCreditCard.expiredDate)) {
      return toast({
        title: "Wrong expiry date format!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
    try {
      await axios.post(
        `${BACKEND_URL}/api/customer/payment-information`,
        newCreditCard,
        config
      );
      setOpenAddCreditCard(false);
      fetchCreditCards();
      return toast({
        title: "Add credit card successful!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      if (
        error.response.data.message ===
        "Your account is locked! Please contact admin to unlock your account!"
      ) {
        setPopupType("account-locked")
        setOpenPopup(true);
        return;
      }
      return toast({
        title: "Wrong card number!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        addCreditCard.current &&
        !addCreditCard.current.contains(event.target)
      ) {
        setOpenAddCreditCard(false);
        setWalletOption("");
      }
      if (
        topUpBalance.current &&
        !topUpBalance.current.contains(event.target)
      ) {
        setOpenAddCreditCard(false);
        setWalletOption("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [addCreditCard, topUpBalance]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    document.title = "My Wallet | BazaarBay";
    fetchCreditCards();
  }, []);

  useEffect(() => {
    setSelectedCreditCard(creditCards[0]);
  }, [creditCards]);

  return (
    <div className="wallet">
      <div
        className="walletContainer"
        style={{
          overflow:
            (openAddCreditCard || openPopup || openTopUpBalance) && "hidden",
        }}
      >
        <div className="walletTitle">My Wallet</div>
        <div className="walletBody">
          <div className="walletCurrentBalance">
            <h5>Wallet Balance</h5>
            <h2>
              <span className="price-symbol">₫</span>
              {formatNumber(currentUser.balance)}
            </h2>
          </div>
          <div className="creditCards">
            <h1>My Credit Cards</h1>
            {creditCards.map((creditCard) => (
              <div className="creditCard" key={creditCard.id}>
                <div className="creditCardContainer">
                  <div className="creditCardLeft">
                    <div className="creditCardImage">
                      <img
                        src={
                          creditCard.cardType === "MASTERCARD"
                            ? MasterCardLogo
                            : VisaLogo
                        }
                        alt=""
                      />
                    </div>
                    <div className="creditCardInfo">
                      <h1>{capitalize(creditCard.cardType.toLowerCase())}</h1>
                      <div className="creditCardOwner">
                        <span>{`Full Name: ${creditCard.nameOnCard}`}</span>
                        <span>{`Card Number: ${creditCard.cardNumber}`}</span>
                      </div>
                    </div>
                  </div>
                  <div
                    className="creditCardRight"
                    onClick={() => {
                      setSelectedCreditCard(creditCard);
                      setOpenPopup(true);
                      setPopupType("delete-credit-card");
                    }}
                  >
                    <div className="deleteCreditCard">
                      <FontAwesomeIcon icon={faTrash} />
                    </div>
                  </div>
                  <div className="bazaarbayText">BAZAARBAY</div>
                </div>
              </div>
            ))}
          </div>
          <div className="walletButtons">
            <div
              className={
                walletOption === "add-credit-card"
                  ? "walletButton selectedOption"
                  : "walletButton"
              }
              onClick={() => {
                setWalletOption("add-credit-card");
                setOpenAddCreditCard(true);
              }}
            >
              <img src={CreditCard} alt="" />
              <span>Add Credit Card</span>
            </div>
            <div
              className={
                walletOption === "top-up-balance"
                  ? "walletButton selectedOption"
                  : "walletButton"
              }
              onClick={() => {
                setWalletOption("top-up-balance");
                setOpenTopUpBalance(true);
              }}
            >
              <img src={TopUpBalance} alt="" />
              <span>Top Up Balance</span>
            </div>
            <div
              className={
                walletOption === "transactions"
                  ? "walletButton selectedOption"
                  : "walletButton"
              }
              onClick={() => setWalletOption("transactions")}
            >
              <img src={Transaction} alt="" />
              <span>Transactions</span>
            </div>
          </div>
          {walletOption === "add-credit-card" && (
            <div
              className={
                openAddCreditCard ? "addCreditCard open" : "addCreditCard"
              }
            >
              <div className="addCreditCardContainer" ref={addCreditCard}>
                <h1>Add new credit card</h1>
                <div className="creditCardItem">
                  <span>Name</span>
                  <input
                    type="text"
                    placeholder="Name on card"
                    id="nameOnCard"
                    onChange={handleChangeCreditCard}
                  />
                </div>
                <div className="creditCardItem">
                  <span>Card Number</span>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    id="cardNumber"
                    onChange={handleChangeCreditCard}
                  />
                </div>
                <div className="creditCardSmallItemContainer">
                  <div className="creditCardSmallItem">
                    <span>Expiry Date</span>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      id="expiredDate"
                      onChange={handleChangeCreditCard}
                    />
                  </div>
                  <div className="creditCardSmallItem">
                    <span>CVC/CVV</span>
                    <input
                      type="number"
                      placeholder="CVC"
                      id="cvv"
                      onChange={handleChangeCreditCard}
                    />
                  </div>
                </div>
                <button className="button" onClick={handleAddNewCreditCard}>
                  Save
                </button>
              </div>
            </div>
          )}
          {walletOption === "top-up-balance" && (
            <div
              className={
                openTopUpBalance ? "topUpBalance open" : "topUpBalance"
              }
            >
              <div className="topUpBalanceContainer">
                <h1>Top up balance</h1>
                <div className="creditCardItem">
                  <span>Amount</span>
                  <input
                    type="number"
                    placeholder="Enter amount..."
                    id="nameOnCard"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="creditCardItem">
                  <span>Choose your credit card</span>
                  <div className="chooseCreditCards">
                    {creditCards.map((creditCard, i) => (
                      <div
                        className="creditCard"
                        key={creditCard.id}
                        onClick={() => {
                          setChosenCreditCardIndex(i);
                          setSelectedCreditCard(creditCard);
                        }}
                        style={{
                          zIndex: handleCreditCardIndex(i),
                          height: i !== chosenCreditCardIndex && "50px",
                        }}
                      >
                        <div
                          className="creditCardContainer"
                          style={{
                            border:
                              i === chosenCreditCardIndex && "1px solid red",
                            marginTop:
                              i > chosenCreditCardIndex && `-${50 + i * 5}px`,
                          }}
                        >
                          <div className="creditCardLeft">
                            <div
                              className="creditCardImage"
                              style={{
                                marginBottom:
                                  i !== chosenCreditCardIndex && "90px",
                                width: i !== chosenCreditCardIndex && "40px",
                                height: i !== chosenCreditCardIndex && "40px",
                              }}
                            >
                              <img
                                src={
                                  creditCard.cardType === "MASTERCARD"
                                    ? MasterCardLogo
                                    : VisaLogo
                                }
                                alt=""
                              />
                            </div>
                            <div className="creditCardInfo">
                              <h1
                                style={{
                                  marginBottom:
                                    i !== chosenCreditCardIndex && "25px",
                                }}
                              >
                                {capitalize(creditCard.cardType.toLowerCase())}
                              </h1>
                              <div className="creditCardOwner">
                                <span>{`Full Name: ${creditCard.nameOnCard}`}</span>
                                <span>{`Card Number: ${creditCard.cardNumber}`}</span>
                              </div>
                            </div>
                          </div>
                          <div className="bazaarbayText">BAZAARBAY</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="topUpBalanceButtons">
                  <button
                    className="button"
                    onClick={() => {
                      setOpenPopup(true);
                      setPopupType("top-up-balance");
                    }}
                  >
                    Save
                  </button>
                  <button
                    className="button"
                    onClick={() => {
                      setOpenTopUpBalance(false);
                      setWalletOption("")
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <CustomerPopup
        open={openPopup}
        setOpen={setOpenPopup}
        popupType={popupType}
        creditCard={selectedCreditCard}
        fetchCreditCards={fetchCreditCards}
        amount={amount}
      />
      { role === "CUSTOMER" && <Footer />}
    </div>
  );
};

export default Wallet;
