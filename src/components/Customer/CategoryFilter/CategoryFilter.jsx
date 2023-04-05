import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useContext, useEffect } from "react";
import "./categoryFilter.css";

import axios from "axios";
import {
  handleDisplayCategoryImage,
  handleDisplayCategoryName,
} from "./categoryFilterLogic";
import { AuthContext } from "../../../context/AuthContext";
import { useHistory } from "react-router-dom";

const CategoryFilter = () => {
  const { BACKEND_URL } = useContext(AuthContext);
  const [left, setLeft] = useState(0);
  const categoryList = useRef();
  // categoryList && console.log(categoryList.current.offsetWidth)
  // const categoryWidth = categoryList.current && categoryList.current.offsetWidth;
  const [categories, setCategories] = useState([]);
  const history = useHistory()
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/product-categories`);
      setCategories(data.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="categoryFilter">
      <div className="categoryFilterContainer">
        <div className="categoryFilterHeading">Filter by categories</div>
        <div className="categories">
          <ul
            style={{
              marginLeft: `-${left}px`,
              marginRight: `${left}px`,
            }}
          >
            {categories.map((category, i) => (
              <li key={i} onClick={() => history.push(`?category=${category.toLowerCase()}`)}>
                <div
                  className="categoryContainer"
                  style={{
                    paddingRight:
                      i === categories.length -1 ? "1px solid #ccc" : "none",
                  }}
                >
                  <div className="imageContainer"></div>
                  <img src={handleDisplayCategoryImage(category)} alt="" />
                  <span>{handleDisplayCategoryName(category)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
