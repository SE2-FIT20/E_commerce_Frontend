import React from "react";
import CategoryFilter from "../../components/Customer/CategoryFilter/CategoryFilter";
import FeaturedProduct from "../../components/Customer/FeaturedProduct/FeaturedProduct";
import Footer from "../../components/Customer/Footer/Footer";
import Navbar from "../../components/Customer/Navbar/Navbar";
import "./homepage.css";

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="homepageContainer">
        <div className="homepageBody">
          <CategoryFilter />
          <FeaturedProduct />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
