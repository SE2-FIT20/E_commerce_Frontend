import { useState, useEffect } from "react";
import CategoryFilter from "../../components/Customer/CategoryFilter/CategoryFilter";
import FeaturedProduct from "../../components/Customer/FeaturedProduct/FeaturedProduct";
import Footer from "../../components/Customer/Footer/Footer";
import Navbar from "../../components/Customer/Navbar/Navbar";
import "./homepage.css";
import { useLocation } from "react-router-dom";
import Banner from "../../components/Customer/Banner/Banner";
import Minigame from "../../components/Customer/Minigame/Minigame";

const Homepage = () => {
  const location = useLocation();
  const [category, setCategory] = useState("");

  useEffect(() => {
    setCategory(location.search ? location.search.split("=")[1] : "all");
  }, [location]);

  return (
    <div className="homepage">
      <div className="homepageContainer">
        <div className="homepageBody">
          <div className="homepageBanner">
            <Banner />
          </div>
          <div className="homepageProducts">
            <CategoryFilter />
            <Minigame />
            <FeaturedProduct category={category} setCategory={setCategory} />
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
