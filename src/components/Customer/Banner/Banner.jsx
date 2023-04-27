import React, { useEffect } from "react";
import "./banner.css";
import Banner1 from "../../../images/banner-1.png";
import Banner2 from "../../../images/banner-2.png";
import Banner3 from "../../../images/banner-3.png";
import Banner4 from "../../../images/banner-4.png";
import Banner5 from "../../../images/banner-5.png";
import Banner6 from "../../../images/banner-6.png";
import Banner7 from "../../../images/banner-7.png";
import Banner8 from "../../../images/banner-8.png";
import StaticBanner from "../../../images/static-banner.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const Banner = () => {
  const history = useHistory();
  const bannerImages = [
    Banner1,
    Banner2,
    Banner3,
    Banner4,
    Banner5,
    Banner6,
    Banner7,
    Banner8,
  ];
  const [currentImage, setCurrentImage] = useState(0);
  const handleClickNext = () => {
    setCurrentImage((prev) =>
      prev === bannerImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleClickPrev = () => {
    setCurrentImage((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    let slider = setInterval(() => {
      setCurrentImage((prev) =>
        prev === bannerImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);
    return () => {
      clearInterval(slider);
    };
  }, [currentImage]);
  return (
    <div className="banner">
      <div className="bannerContainer">
        <div className="bannerLeft">
          <div
            className="bannerImagesContainer"
            style={{ transform: `translateX(-${currentImage * 100}%)` }}
          >
            {bannerImages.map((image, i) => (
              <img src={image} key={i} className="bannerImage" />
            ))}
          </div>
          <div className="bannerPrevBtn" onClick={handleClickPrev}>
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <div className="bannerNextBtn" onClick={handleClickNext}>
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
          <div className="navBannerContainer">
            {bannerImages.map((banner, i) => (
              <div
                className={
                  currentImage === i ? "navBanner selected" : "navBanner"
                }
                onClick={() => setCurrentImage(i)}
              ></div>
            ))}
          </div>
        </div>
        <div
          className="bannerRight"
          onClick={() => {
            window.scrollTo({
              top: document.querySelector(".minigame").offsetTop,
              behavior: "smooth",
            });
          }}
        >
          <img
            src={StaticBanner}
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Banner;
