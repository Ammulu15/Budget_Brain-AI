import { motion } from "framer-motion";

const characterImages = {
  cart: "/characters/cart.png",
  shopping: "/characters/cart.png",
  burger: "/characters/burger.png",
  food: "/characters/burger.png",
  popcorn: "/characters/popcorn.png",
  envelope: "/characters/envelope.png",
  currency: "/characters/currency.png",
  piggy: "/characters/piggy.png",
  car: "/characters/car.png",
  coffee: "/characters/coffee.png",
  drink: "/characters/drink.png",
  beverage: "/characters/drink.png",
  treat: "/characters/treat.png",
  bag: "/characters/bag.png",
};

export function getCharacterType(category = "", type = "expense") {
  const c = category.toLowerCase();
  if (c.includes("popcorn") || c.includes("movie") || c.includes("cinema") || c.includes("entertainment") || c.includes("fun") || c.includes("netflix") || c.includes("show")) {
    return "popcorn";
  }
  // Drinks & Beverages
  if (
    c.includes("drink") ||
    c.includes("beverage") ||
    c.includes("juice") ||
    c.includes("soda") ||
    c.includes("coke") ||
    c.includes("cola") ||
    c.includes("smoothie") ||
    c.includes("shake") ||
    c.includes("milkshake") ||
    c.includes("cocktail") ||
    c.includes("mocktail") ||
    c.includes("beer") ||
    c.includes("wine") ||
    c.includes("bar") ||
    c.includes("pub") ||
    c.includes("brew") ||
    c.includes("liquor") ||
    c.includes("alcohol") ||
    (c.includes("water") && !c.includes("bill") && !c.includes("tax"))
  ) {
    return "drink";
  }
  // Coffee / Cafe / Tea / Bakery
  if (c.includes("coffee") || c.includes("cafe") || c.includes("tea") || c.includes("boba") || c.includes("starbucks") || c.includes("snack") || c.includes("dessert") || c.includes("bakery") || c.includes("cake") || c.includes("pastry")) {
    return "coffee";
  }
  // Combo treats / fries
  if (c.includes("combo") || c.includes("treat") || c.includes("fries")) {
    return "treat";
  }
  // Food & Dining / Restaurant
  if (c.includes("burger") || c.includes("food") || c.includes("restaurant") || c.includes("pizza") || c.includes("dining") || c.includes("lunch") || c.includes("dinner") || c.includes("breakfast") || c.includes("meal") || c.includes("swiggy") || c.includes("zomato") || c.includes("takeout") || c.includes("dine")) {
    return "burger";
  }
  if (c.includes("travel") || c.includes("car") || c.includes("taxi") || c.includes("cab") || c.includes("uber") || c.includes("ola") || c.includes("transport") || c.includes("fuel") || c.includes("petrol") || c.includes("diesel") || c.includes("flight") || c.includes("train")) {
    return "car";
  }
  if (c.includes("fee") || c.includes("bill") || c.includes("rent") || c.includes("electricity") || c.includes("utility") || c.includes("wifi") || c.includes("recharge") || c.includes("subscription") || c.includes("tax") || c.includes("emi") || c.includes("loan")) {
    return "envelope";
  }
  if (type === "income" || c.includes("salary") || c.includes("dividend") || c.includes("bonus") || c.includes("cash") || c.includes("freelance") || c.includes("interest") || c.includes("refund")) {
    return "currency";
  }
  if (c.includes("saving") || c.includes("goal") || c.includes("invest") || c.includes("deposit") || c.includes("mutual") || c.includes("stock")) {
    return "piggy";
  }
  if (c.includes("grocery") || c.includes("groceries") || c.includes("vegetable") || c.includes("fruit") || c.includes("market") || c.includes("supermarket")) {
    return "bag";
  }
  return "cart";
}

export default function FoodDoodle({ type = "cart", size = 42 }) {
  const imgSrc = characterImages[type] || characterImages.cart;

  return (
    <motion.div
      whileHover={{ scale: 1.25, rotate: [-4, 4, 0], y: -4 }}
      whileTap={{ scale: 0.92 }}
      animate={{ y: [0, -3, 0] }}
      transition={{
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        scale: { type: "spring", stiffness: 300, damping: 15 },
      }}
      style={{ width: size, height: size }}
      className="inline-flex items-center justify-center shrink-0 cursor-pointer relative"
    >
      <img
        src={imgSrc}
        alt={type}
        className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.28)] hover:drop-shadow-[0_8px_16px_rgba(0,0,0,0.38)] transition-all pointer-events-none select-none"
      />
    </motion.div>
  );
}
