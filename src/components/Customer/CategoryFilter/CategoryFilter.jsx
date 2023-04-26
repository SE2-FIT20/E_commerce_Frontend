import React, { useState, useContext, useEffect, useRef } from "react";
import { capitalize } from "../../longFunctions";
import "./categoryFilter.css";

import axios from "axios";
import { handleDisplayCategoryImage } from "./categoryFilterLogic";
import { AuthContext } from "../../../context/AuthContext";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const CategoryFilter = () => {
  const { BACKEND_URL } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const history = useHistory();
  const [position, setPosition] = useState(0);
  const [maxWidth, setMaxWidth] = useState(0);
  const categoryRef = useRef();

  const handleClickPrev = () => {
    setPosition(Math.max(position - 200, 0));
  };

  const handleClickNext = () => {
    setPosition(Math.min(position + 200, maxWidth));
  };
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${BACKEND_URL}/api/product-categories`);
      setCategories(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (categoryRef.current) {
      setMaxWidth(Math.abs(categoryRef.current.offsetWidth - 1400));
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (categoryRef.current) {
        setMaxWidth(Math.abs(categoryRef.current.offsetWidth - 1400));
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [categoryRef]);

  // useEffect(() => {
  //   if (categoryRef.current) {
  //     const maxPos =
  //       categoryRef.current.scrollWidth - categoryRef.current.clientWidth;
  //       console.log(maxPos)
  //     setMaxWidth(maxPos);
  //   }
  // }, [categoryRef]);

  return (
    <div className="categoryFilter">
      <div className="categoryFilterContainer">
        <div className="categoryFilterHeading">Category</div>
        {!loading && (
          <div className="categories">
            <div className="categoriesContainer" ref={categoryRef}>
              <ul
                style={{
                  transform: `translateX(-${position}px)`,
                }}
              >
                {categories.length > 0 &&
                  categories.map((category, i) => (
                    <li
                      key={i}
                      onClick={() => {
                        history.push(`?category=${category.toLowerCase()}`);
                        window.scrollTo({
                          top: document.querySelector(".featuredProduct")
                            .offsetTop,
                          behavior: "smooth",
                        });
                      }}
                    >
                      <div
                        className="categoryContainer"
                        style={{
                          paddingRight:
                            i === categories.length - 1
                              ? "1px solid #ccc"
                              : "none",
                        }}
                      >
                        <div className="imageContainer"></div>
                        <img
                          src={handleDisplayCategoryImage(category)}
                          alt=""
                        />
                        <span>
                          {category === "CARS_MOTORBIKES"
                            ? "Cars & Motorbikes"
                            : capitalize(category.toLowerCase())}
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            {position > 0 && (
              <div className="categoryFilterPrevBtn" onClick={handleClickPrev}>
                <FontAwesomeIcon icon={faChevronLeft} />
              </div>
            )}
            {position < maxWidth && (
              <div className="categoryFilterNextBtn" onClick={handleClickNext}>
                <FontAwesomeIcon icon={faChevronRight} />
              </div>
            )}
          </div>
        )}
        {loading && (
          <div className="partialLoading">
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter;
