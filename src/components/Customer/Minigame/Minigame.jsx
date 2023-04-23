import React, { useContext, useEffect, useState } from "react";
import "./minigame.css";
import axios from "axios";
import { AuthContext } from "../../../context/AuthContext";
import { Layer, Stage, Wedge } from "react-konva";

const Minigame = () => {
  const { BACKEND_URL, config } = useContext(AuthContext);
  const [vouchers, setVouchers] = useState([]);

  const fetchVouchers = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/customer/mini-game-vouchers`,
        config
      );
      setVouchers(data.data);
    } catch (error) {}
  };



  useEffect(() => {
    fetchVouchers();
  }, []);
  return (
    <div className="minigame">
      <div className="minigameContainer">
        <h2>Minigame</h2>
        <div className="wheelContainer">
          
          <button className="button">
            Spin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Minigame;
