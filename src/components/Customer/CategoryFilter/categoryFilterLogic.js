import Beauty from "../../../images/beauty-icon.png"
import Clothing from "../../../images/clothing-icon.png";
import Book from "../../../images/book-icon.jpg"
import Electronic from "../../../images/electronic-icon.png"
import Food from "../../../images/food-icon.png"
import Furniture from "../../../images/furniture-icon.png"
import Health from "../../../images/health-icon.webp"
import Home from "../../../images/home-icon.png"
import Jewelry from "../../../images/jewelry-icon.png"
import Sport from "../../../images/sport-icon.png"

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
  }
};

export const handleDisplayCategoryName = (category) => {
  switch (category) {
    case "BEAUTY":
      return "Beauty";
    case "CLOTHING":
      return "Clothing";
    case "BOOKS": 
      return "Book";
    case "ELECTRONICS": 
      return "Electronics";
    case "FOOD":
      return "Food";
    case "FURNITURE":
      return "Furniture";
    case "HEALTH":
      return "Health";
    case "HOME":
      return "Home";
    case "JEWELRY":
      return "Jewelry";
    case "SPORTS":
      return "Sport";
  }
}
