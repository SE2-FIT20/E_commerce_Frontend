import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useRef, useContext, useEffect } from "react";
import { capitalize } from "../../longFunctions";
import "./categoryFilter.css";

import axios from "axios";
import {
  handleDisplayCategoryImage,
} from "./categoryFilterLogic";
import { AuthContext } from "../../../context/AuthContext";
import { useHistory, useLocation } from "react-router-dom";

const CategoryFilter = () => {
  const { BACKEND_URL } = useContext(AuthContext);
  const [left, setLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const categoryList = useRef();

  // categoryList && console.log(categoryList.current.offsetWidth)
  // const categoryWidth = categoryList.current && categoryList.current.offsetWidth;
  const [categories, setCategories] = useState([]);
  const history = useHistory();
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
    fetchCategories();
  }, []);

  return (
    <div className="categoryFilter">
      <div className="categoryFilterContainer">
        <div className="categoryFilterHeading">Category</div>
        {!loading && (
          <div className="categories">
            <ul
              style={{
                marginLeft: `-${left}px`,
                marginRight: `${left}px`,
              }}
            >
              {categories.map((category, i) => (
                <li
                  key={i}
                  onClick={() =>
                    history.push(`?category=${category.toLowerCase()}`)
                  }
                >
                  <div
                    className="categoryContainer"
                    style={{
                      paddingRight:
                        i === categories.length - 1 ? "1px solid #ccc" : "none",
                    }}
                  >
                    <div className="imageContainer"></div>
                    <img src={handleDisplayCategoryImage(category)} alt="" />
                    <span>{capitalize(category.toLowerCase())}</span>
                  </div>
                </li>
              ))}
            </ul>
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
