import { useState } from "react";
import "./footer.css";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useEffect } from "react";
import Visa from "../../../images/credit-card-logo.jpg";
import MasterCard from "../../../images/master-card-logo.png";

const Footer = () => {
  const { BACKEND_URL } = useContext(AuthContext);
  const [deliveryPartners, setDeliveryPartners] = useState([]);

  const fetchDeliveryPartners = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/delivery-partners`);
      setDeliveryPartners(data.data.content);
    } catch (error) {}
  };

  useEffect(() => {
    fetchDeliveryPartners();
  }, []);
  return (
    <div className="footer">
      <div className="footerContainer">
        <div className="groupInfo">
          <h1>About Us</h1>
          <ul>
            <li>{`Nguyen Quang Nam (4C20)`}</li>
            <li>{`Do Minh Quan (3C20)`}</li>
            <li>{`Tran Viet Hoa (3C20)`}</li>
            <li>{`Tran Khac Linh (6C20)`}</li>
            <li>{`Tran Nhu Lam (3C20)`}</li>
          </ul>
        </div>
        <div className="contactUs">
          <h1>Contact Us</h1>
          <ul>
            <li className="gmail">Email: quandm11022002@gmail.com</li>
            <li className="phone">Phone Number: 0825134034</li>
            <li className="university">University: Hanoi University</li>
            <li className="link">
              Link: <a href="https://github.com" target="_blank">github.com</a>
            </li>
          </ul>
        </div>
        <div className="payment-delivery">
          <div className="payment">
            <h1>Payment</h1>
            <div className="paymentContainer">
              <img src={Visa} alt="" />
              <img src={MasterCard} alt="" />
            </div>
          </div>
          <div className="delivery">
            <h1>Delivery Partners</h1>
            <div className="deliveryPartnerContainer">
              {deliveryPartners.map((deliveryPartner) => (
                <img
                  src={deliveryPartner.avatar}
                  alt=""
                  key={deliveryPartner.id}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="finalText">© 2023; Powered by Developer's Corner</div>
    </div>
  );
};

export default Footer;
