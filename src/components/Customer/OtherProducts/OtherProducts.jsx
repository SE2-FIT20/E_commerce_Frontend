import React from "react";
import SingleProduct from "../../../components/Customer/SingleProduct/SingleProduct";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { useToast } from "@chakra-ui/react";
import "./otherProducts.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import NoProduct from "../../../images/no-product.png";
import { useRef } from "react";

const OtherProducts = ({ product }) => {
  const { BACKEND_URL } = useContext(AuthContext);
  const [storeOtherProducts, setStoreOtherProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [position1, setPosition1] = useState(0);
  const [position2, setPosition2] = useState(0);

  const toast = useToast();
  const [maxWidth1, setMaxWidth1] = useState(0);
  const [maxWidth2, setMaxWidth2] = useState(0);
  const storeOtherProductsRef = useRef(null);
  const relatedProductsRef = useRef(null);
  const fetchStoreOtherProducts = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/products?storeId=${product.store.id}&filter=price&sortBy=desc`
      );
      setStoreOtherProducts(data.data.content);
    } catch (error) {}
  };
  const fetchRelatedProducts = async () => {
    try {
      const { data } = await axios.get(
        `${BACKEND_URL}/api/products?category=${product.category.toLowerCase()}&filter=price&sortBy=asc`
      );
      setRelatedProducts(data.data.content);
    } catch (error) {}
  };

  const handleClickPrev = (type) => {
    if (type === "storeOtherProducts") {
      setPosition1(Math.max(position1 - 250, 0));
    } else {
      setPosition2(Math.max(position2 - 250, 0));
    }
  };

  const handleClickNext = (type) => {
    if (type === "storeOtherProducts") {
      setPosition1(Math.min(position1 + 250, maxWidth1));
    } else {
      setPosition2(Math.min(position2 + 250, maxWidth2));
    }
  };
  useEffect(() => {
    fetchStoreOtherProducts();
    fetchRelatedProducts();
  }, [product]);

  useEffect(() => {
    if (storeOtherProductsRef.current) {
      const maxPos =
        storeOtherProductsRef.current.scrollWidth -
        storeOtherProductsRef.current.clientWidth;
      setMaxWidth1(maxPos);
    }
    if (relatedProductsRef.current) {
      const maxPos =
        relatedProductsRef.current.scrollWidth -
        relatedProductsRef.current.clientWidth;
      setMaxWidth2(maxPos);
    }
  });

  return (
    <div className="otherProducts">
      <div className="storeOtherProduct">
        <div className="otherProductText">{`${
          product && product.store.name
        }'s other products`}</div>
        {storeOtherProducts.length === 1 && (
          <div className="noProduct">
            <img src={NoProduct} alt="" />
            <span>No Product Found</span>
          </div>
        )}
        {storeOtherProducts.length > 1 && (
          <>
            <div className="storeOtherProductContainer">
              <ul
                style={{
                  transform: `translateX(-${position1}px)`,
                }}
                ref={storeOtherProductsRef}
              >
                {storeOtherProducts
                  .filter((p) => p.id !== product.id)
                  .filter((p) => p.quantity !== 0)
                  .map((product) => (
                    <SingleProduct product={product} key={product.id} />
                  ))}
              </ul>
            </div>
            {position1 > 0 && (
              <div
                className="otherProductPrevBtn"
                onClick={() => handleClickPrev("storeOtherProducts")}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
            )}
            {position1 < maxWidth1 && (
              <div
                className="otherProductNextBtn"
                onClick={() => handleClickNext("storeOtherProducts")}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            )}
          </>
        )}
      </div>
      <div className="storeOtherProduct">
        <div className="otherProductText">Related Products</div>
        {relatedProducts.length === 1 && (
          <div className="noProduct">
            <img src={NoProduct} alt="" />
            <span>No Product Found</span>
          </div>
        )}
        {relatedProducts.length > 1 && (
          <>
            <div className="storeOtherProductContainer">
              <ul
                style={{
                  transform: `translateX(-${position2}px)`,
                }}
                ref={relatedProductsRef}
              >
                {relatedProducts
                  .filter((p) => p.id !== product.id)
                  .filter((p) => p.quantity !== 0)

                  .map((product) => (
                    <SingleProduct product={product} key={product.id} />
                  ))}
              </ul>
            </div>
            {position2 > 0 && (
              <div
                className="otherProductPrevBtn"
                onClick={() => handleClickPrev("relatedProducts")}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
            )}
            {position2 < maxWidth2 && (
              <div
                className="otherProductNextBtn"
                onClick={() => handleClickNext("relatedProducts")}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OtherProducts;
