import React from "react";
import "./chooseCategory.css";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { handleDisplayCategoryImage } from "../../Customer/CategoryFilter/categoryFilterLogic";
import { capitalize } from "../../longFunctions";
import { useRef } from "react";

const ChooseCategory = ({ open, setOpen, setProduct }) => {
  const { BACKEND_URL } = useContext(AuthContext);
  const [categories, setCategories] = useState([]);
  const chooseCategory = useRef();
  const fetchCategory = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/product-categories`);
      setCategories(data.data);
    } catch (error) {}
  };

  const handleChooseCategory = (cat) => {
    setProduct((prev) => ({ ...prev, category: cat }));
    setOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        chooseCategory.current &&
        !chooseCategory.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [chooseCategory]);

  useEffect(() => {
    fetchCategory();
  });
  return (
    <div className={open ? "chooseCategory" : "chooseCategory hide"}>
      <div className="chooseCategoryContainer" ref={chooseCategory}>
        <div className="title">
          <h2 className="chooseCategoryTitle">Choose your category</h2>
        </div>
        <ul>
          {categories.map((category, i) => (
            <li
              key={i}
              onClick={() =>
                handleChooseCategory(
                  category === "CARS_MOTORBIKES"
                    ? "Cars & Motorbikes"
                    : capitalize(category.toLowerCase())
                )
              }
            >
              <div className="categoryImageBackground">
                <img src={handleDisplayCategoryImage(category)} alt="" />
              </div>
              <span>
                {category === "CARS_MOTORBIKES"
                  ? "Cars & Motorbikes"
                  : capitalize(category.toLowerCase())}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChooseCategory;
