import { motion } from "framer-motion";

const characterImages = {
  burger: "/characters/burger.jpg",
  popcorn: "/characters/popcorn.jpg",
  envelope: "/characters/envelope.jpg",
  currency: "/characters/currency.jpg",
  piggy: "/characters/piggy.jpg",
  shopping: "/characters/shopping.jpg",
  treat: "/characters/treat.jpg",
};

export function getCharacterType(category = "", type = "expense") {
  const c = category.toLowerCase();
  if (c.includes("popcorn") || c.includes("movie") || c.includes("cinema") || c.includes("snack") || c.includes("entertainment") || c.includes("fun")) {
    return "popcorn";
  }
  if (c.includes("burger") || c.includes("food") || c.includes("restaurant") || c.includes("cafe") || c.includes("coffee") || c.includes("pizza") || c.includes("dining") || c.includes("lunch") || c.includes("dinner")) {
    return "burger";
  }
  if (c.includes("fee") || c.includes("bill") || c.includes("rent") || c.includes("electricity") || c.includes("water") || c.includes("wifi") || c.includes("recharge") || c.includes("subscription") || c.includes("tax")) {
    return "envelope";
  }
  if (type === "income" || c.includes("salary") || c.includes("dividend") || c.includes("bonus") || c.includes("cash") || c.includes("freelance")) {
    return "currency";
  }
  if (c.includes("saving") || c.includes("goal") || c.includes("invest") || c.includes("deposit")) {
    return "piggy";
  }
  return "shopping";
}

export default function FoodDoodle({ type = "shopping", size = 42 }) {
  const imgSrc = characterImages[type] || characterImages.shopping;

  return (
    <motion.div
      whileHover={{ scale: 1.22, rotate: [-4, 4, 0], y: -3 }}
      whileTap={{ scale: 0.92 }}
      animate={{ y: [0, -2.5, 0] }}
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
        className="w-full h-full object-cover rounded-2xl shadow-sm border border-white/60 ring-1 ring-black/5 hover:shadow-md transition"
      />
    </motion.div>
  );
}
