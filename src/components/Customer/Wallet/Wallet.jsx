import { useContext, useEffect, useState } from "react";
import "./wallet.css";
import { AuthContext } from "../../../context/AuthContext";
import axios from "axios";
import { formatNumber } from "../../longFunctions";
import { useToast } from "@chakra-ui/react";
import TopUpBalance from "../../../images/top-up-balance-icon.png";
import Transaction from "../../../images/transaction-icon.png";
import Footer from "../Footer/Footer";

const Wallet = () => {
  const { currentUser, setCurrentUser, BACKEND_URL, config, role } =
    useContext(AuthContext);
  console.log(currentUser);
  const toast = useToast();

  useEffect(() => {
    document.title = "My Wallet | BazaarBay";
  }, []);
  return (
    <div className="wallet">
      <div className="walletContainer">
        <div className="walletTitle">My Wallet</div>
        <div className="walletBody">
          <div className="walletCurrentBalance">
            <h5>Wallet Balance</h5>
            <h2>
              <span className="price-symbol">₫</span>
              {formatNumber(currentUser.balance)}
            </h2>
          </div>
          <div className="walletButtons">
            <div className="walletButton">
              <img src={TopUpBalance} alt="" />
              <span>Top Up Balance</span>
            </div>
            <div className="walletButton">
              <img src={Transaction} alt="" />
              <span>Transactions</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Wallet;
