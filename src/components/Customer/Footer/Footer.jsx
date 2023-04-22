import { useState } from "react";
import "./footer.css";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useEffect } from "react";

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
          <h1>Group Information</h1>
          <ul>
            <li>{`Nguyen Quang Nam (Scrum Master)`}</li>
            <li>{`Do Minh Quan (Front-end Developer)`}</li>
            <li>{`Tran Viet Hoa (Front-end Developer)`}</li>
            <li>{`Nguyen Manh Hai (Back-end Developer)`}</li>
            <li>{`Nguyen Hoang Vy (Back-end Developer, Document)`}</li>
            <li>{`Tran Khac Linh (Back-end Developer, Document)`}</li>
            <li>{`Tran Nhu Lam (Document)`}</li>
          </ul>
        </div>
        <div className="contactUs">
          <h1>Contact Us</h1>
          <ul>
            <li className="gmail">Email: </li>
            <li className="phone">Phone Number:</li>
            <li className="university">University: Hanoi University</li>
            <li className="link">Link: github.com</li>
          </ul>
        </div>
        <div className="payment-delivery">
          <div className="payment"></div>
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
