import Beauty from "../../../images/beauty-icon.png"
import Clothing from "../../../images/clothing-icon.png";
import Book from "../../../images/book-icon.png"
import Electronic from "../../../images/electronic-icon.png"
import Food from "../../../images/food-icon.png"
import Furniture from "../../../images/furniture-icon.png"
import Health from "../../../images/health-icon.png"
import Home from "../../../images/home-icon.png"
import Jewelry from "../../../images/jewelry-icon.png"
import Sport from "../../../images/sport-icon.png"
import Travel from "../../../images/travel-icon.png"
import Shoes from "../../../images/shoes-icon.png"
import Bag from "../../../images/bag-icon.png"
import Toy from "../../../images/toy-icon.png"

export const handleDisplayCategoryImage = (category) => {
  switch (category) {
    case "BEAUTY":
      return Beauty;
    case "CLOTHING":
      return Clothing;
    case "BOOKS": 
      return Book;
    case "ELECTRONICS": 
      return Electronic;
    case "FOOD":
      return Food;
    case "FURNITURE":
      return Furniture;
    case "HEALTH":
      return Health;
    case "HOME":
      return Home;
    case "JEWELRY":
      return Jewelry;
    case "SPORTS":
      return Sport;
    case "TRAVEL":
      return Travel;
    case "SHOES": 
      return Shoes;
    case "BAGS":
      return Bag;
    case "TOYS":
      return Toy;
  }
};

