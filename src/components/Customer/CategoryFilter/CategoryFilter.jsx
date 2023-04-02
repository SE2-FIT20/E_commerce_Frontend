import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef } from "react";
import "./categoryFilter.css";

const CategoryFilter = () => {
  const [left, setLeft] = useState(0);
  const categoryList = useRef();
  // categoryList && console.log(categoryList.current.offsetWidth)
  // const categoryWidth = categoryList.current && categoryList.current.offsetWidth;
  const categories = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ];

  const handleClickNext = () => {
    setLeft((prev) => prev + 200);
  };

  const handleClickPrev = () => {
    setLeft((prev) => prev - 200);
  };

  return (
    <div className="categoryFilter">
      <div className="categoryFilterContainer">
        <div className="categoryFilterHeading">Filter by categories</div>
        <div className="categories">
          <ul
            style={{
              marginLeft: `-${left}px`,
              marginRight: `${left}px`,
              gridTemplateColumns: `repeat(${Math.ceil(
                categories.length / 2
              )}, 10%)`,
            }}
          >
            {categories.map((category, i) => (
              <li key={i}>
                <img
                  src="data:image/jpeg;base64,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"
                  alt=""
                />
                <span>{i}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
