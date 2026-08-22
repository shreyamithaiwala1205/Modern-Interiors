import sofa from "../assets/images/sofa.png";
import bed from "../assets/images/bed.png";
import chair from "../assets/images/chair.png";
import officeTable from "../assets/images/office-table.png";
import decor from "../assets/images/decor.png";

import reclinerChair from "../assets/images/recliner-chair.png";
import coffeeTable from "../assets/images/coffee-table.png";
import tvUnit from "../assets/images/tv-unit.png";
import wardrobe from "../assets/images/wardrobe.png";
import dressingTable from "../assets/images/dressing-table.png";

import officeChair from "../assets/images/office-chair.png";
import officeDesk from "../assets/images/office-desk.png";
import bookshelf from "../assets/images/bookshelf.png";
import diningTable from "../assets/images/dining-table.png";
import barStool from "../assets/images/bar-stool.png";

import shoeRack from "../assets/images/shoe-rack.png";
import wallShelf from "../assets/images/wall-shelf.png";
import floorLamp from "../assets/images/floor-lamp.png";
import plantStand from "../assets/images/plant-stand.png";
import mirror from "../assets/images/mirror.png";

const furnitureData = [

  {
    id: 1,
    name: "Luxury Sofa Set",
    price: "₹24,999",
    priceValue: 24999,
    category: "Living",
    material: "Fabric",
    image: sofa,
    rating: 4.8,
    stock: true,
    description: "Premium luxury sofa with modern design and soft cushions.",
    colors: ["Beige","Gray","Brown"],
    dimensions: "84 x 36 x 34 inches",
    warranty: "5 Years",
    delivery: "Free Delivery",
    features: [
      "Premium Fabric",
      "Solid Wood Frame",
      "High Density Foam",
      "Modern Design"
    ]
  },

  {
    id: 2,
    name: "Modern Bed",
    price: "₹18,999",
    priceValue: 18999,
    category: "Bedroom",
    material: "Wood",
    image: bed,
    rating: 4.5,
    stock: true,
    description: "Stylish wooden bed with premium finish.",
    colors: ["Brown","White"],
    dimensions: "78 x 60 inches",
    warranty: "3 Years",
    delivery: "Free Delivery",
    features: [
      "Engineered Wood",
      "Premium Finish",
      "Easy Assembly"
    ]
  },

  {
    id: 3,
    name: "Wooden Dining Chair",
    price: "₹3,499",
    priceValue: 3499,
    category: "Dining",
    material: "Wood",
    image: chair,
    rating: 4.2,
    stock: true,
    description: "Comfortable dining chair made with solid wood.",
    colors: ["Brown"],
    dimensions: "20 x 20 x 36 inches",
    warranty: "2 Years",
    delivery: "3 Days",
    features: [
      "Solid Wood",
      "Comfortable",
      "Elegant Finish"
    ]
  },

  {
    id: 4,
    name: "Office Table",
    price: "₹9,999",
    priceValue: 9999,
    category: "Office",
    material: "Metal",
    image: officeTable,
    rating: 4.3,
    stock: true,
    description: "Strong office table for work and study.",
    colors: ["Black"],
    dimensions: "48 x 24 inches",
    warranty: "2 Years",
    delivery: "Free Delivery",
    features: [
      "Metal Frame",
      "Scratch Resistant",
      "Modern Design"
    ]
  },

  {
    id: 5,
    name: "Home Decor Set",
    price: "₹2,999",
    priceValue: 2999,
    category: "Decor",
    material: "Decor",
    image: decor,
    rating: 4.1,
    stock: true,
    description: "Beautiful decorative accessories.",
    colors: ["Gold"],
    dimensions: "Various",
    warranty: "1 Year",
    delivery: "2 Days",
    features: [
      "Premium Finish",
      "Luxury Look"
    ]
  },

  {
    id: 6,
    name: "Recliner Chair",
    price: "₹15,999",
    priceValue: 15999,
    category: "Living",
    material: "Fabric",
    image: reclinerChair,
    rating: 4.7,
    stock: true,
    description: "Luxury recliner chair with adjustable backrest and footrest.",
    colors: ["Gray","Brown"],
    dimensions: "32 x 34 x 40 inches",
    warranty: "5 Years",
    delivery: "Free Delivery",
    features: [
      "Adjustable Recliner",
      "Premium Fabric",
      "Comfort Seating",
      "Modern Design"
    ]
  },

  {
    id: 7,
    name: "Coffee Table",
    price: "₹6,999",
    priceValue: 6999,
    category: "Living",
    material: "Wood",
    image: coffeeTable,
    rating: 4.4,
    stock: true,
    description: "Stylish wooden coffee table for modern living rooms.",
    colors: ["Brown","Walnut"],
    dimensions: "40 x 20 x 18 inches",
    warranty: "2 Years",
    delivery: "3 Days",
    features: [
      "Solid Wood",
      "Scratch Resistant",
      "Premium Finish"
    ]
  },

    {
    id: 8,
    name: "TV Unit",
    price: "₹13,499",
    priceValue: 13499,
    category: "Living",
    material: "Wood",
    image: tvUnit,
    rating: 4.5,
    stock: true,
    description: "Modern TV unit with storage cabinets and shelves.",
    colors: ["White", "Brown"],
    dimensions: "60 x 18 x 24 inches",
    warranty: "3 Years",
    delivery: "Free Delivery",
    features: [
      "Cable Management",
      "Premium Finish",
      "Storage Cabinet"
    ]
  },

  {
    id: 9,
    name: "Wooden Wardrobe",
    price: "₹21,999",
    priceValue: 21999,
    category: "Bedroom",
    material: "Wood",
    image: wardrobe,
    rating: 4.6,
    stock: true,
    description: "3-door wardrobe with spacious shelves and hanging space.",
    colors: ["Brown"],
    dimensions: "72 x 24 x 78 inches",
    warranty: "5 Years",
    delivery: "Free Delivery",
    features: [
      "3 Doors",
      "Large Storage",
      "Premium Wood"
    ]
  },

  {
    id: 10,
    name: "Dressing Table",
    price: "₹11,999",
    priceValue: 11999,
    category: "Bedroom",
    material: "Wood",
    image: dressingTable,
    rating: 4.4,
    stock: true,
    description: "Elegant dressing table with mirror and drawers.",
    colors: ["White", "Brown"],
    dimensions: "42 x 18 x 60 inches",
    warranty: "3 Years",
    delivery: "Free Delivery",
    features: [
      "Large Mirror",
      "Storage Drawers",
      "Premium Finish"
    ]
  },

  {
    id: 11,
    name: "Office Chair",
    price: "₹7,499",
    priceValue: 7499,
    category: "Office",
    material: "Fabric",
    image: officeChair,
    rating: 4.4,
    stock: true,
    description: "Ergonomic office chair with adjustable height.",
    colors: ["Black", "Gray"],
    dimensions: "24 x 24 x 45 inches",
    warranty: "3 Years",
    delivery: "Free Delivery",
    features: [
      "Ergonomic Design",
      "Height Adjustable",
      "360° Rotation"
    ]
  },

  {
    id: 12,
    name: "Office Desk",
    price: "₹12,999",
    priceValue: 12999,
    category: "Office",
    material: "Wood",
    image: officeDesk,
    rating: 4.5,
    stock: true,
    description: "Spacious office desk with drawers.",
    colors: ["Brown"],
    dimensions: "48 x 24 inches",
    warranty: "3 Years",
    delivery: "Free Delivery",
    features: [
      "Storage Drawers",
      "Premium Wood",
      "Modern Design"
    ]
  },

  {
    id: 13,
    name: "Bookshelf",
    price: "₹8,999",
    priceValue: 8999,
    category: "Office",
    material: "Wood",
    image: bookshelf,
    rating: 4.3,
    stock: true,
    description: "Wooden bookshelf with multiple shelves.",
    colors: ["Walnut"],
    dimensions: "30 x 12 x 72 inches",
    warranty: "2 Years",
    delivery: "3 Days",
    features: [
      "5 Shelves",
      "Strong Build",
      "Premium Finish"
    ]
  },

  {
    id: 14,
    name: "Dining Table Set",
    price: "₹19,999",
    priceValue: 19999,
    category: "Dining",
    material: "Wood",
    image: diningTable,
    rating: 4.6,
    stock: true,
    description: "6-seater premium dining table set.",
    colors: ["Brown"],
    dimensions: "60 x 36 inches",
    warranty: "5 Years",
    delivery: "Free Delivery",
    features: [
      "6 Seater",
      "Solid Wood",
      "Premium Finish"
    ]
  },

    {
    id: 15,
    name: "Bar Stool",
    price: "₹4,499",
    priceValue: 4499,
    category: "Dining",
    material: "Metal",
    image: barStool,
    rating: 4.2,
    stock: false,
    description: "Modern metal bar stool with comfortable seating.",
    colors: ["Black"],
    dimensions: "18 x 18 x 30 inches",
    warranty: "2 Years",
    delivery: "4 Days",
    features: [
      "Metal Frame",
      "Comfort Seat",
      "Stylish Design"
    ]
  },

  {
    id: 16,
    name: "Shoe Rack",
    price: "₹5,999",
    priceValue: 5999,
    category: "Decor",
    material: "Wood",
    image: shoeRack,
    rating: 4.1,
    stock: true,
    description: "Wooden shoe rack with 4 spacious shelves.",
    colors: ["Brown"],
    dimensions: "30 x 12 x 36 inches",
    warranty: "2 Years",
    delivery: "2 Days",
    features: [
      "4 Shelves",
      "Compact Design",
      "Premium Finish"
    ]
  },

  {
    id: 17,
    name: "Wall Shelf",
    price: "₹2,999",
    priceValue: 2999,
    category: "Decor",
    material: "Wood",
    image: wallShelf,
    rating: 4.4,
    stock: true,
    description: "Decorative floating wall shelf for modern homes.",
    colors: ["White", "Brown"],
    dimensions: "24 x 8 inches",
    warranty: "1 Year",
    delivery: "2 Days",
    features: [
      "Wall Mounted",
      "Modern Look",
      "Easy Installation"
    ]
  },

  {
    id: 18,
    name: "Floor Lamp",
    price: "₹3,999",
    priceValue: 3999,
    category: "Decor",
    material: "Metal",
    image: floorLamp,
    rating: 4.5,
    stock: true,
    description: "Elegant floor lamp for modern interiors.",
    colors: ["Black", "Gold"],
    dimensions: "60 inches",
    warranty: "2 Years",
    delivery: "3 Days",
    features: [
      "LED Compatible",
      "Premium Metal",
      "Luxury Finish"
    ]
  },

  {
    id: 19,
    name: "Plant Stand",
    price: "₹2,499",
    priceValue: 2499,
    category: "Decor",
    material: "Metal",
    image: plantStand,
    rating: 4.0,
    stock: true,
    description: "Stylish indoor plant stand with durable metal frame.",
    colors: ["Black"],
    dimensions: "18 x 18 x 30 inches",
    warranty: "1 Year",
    delivery: "2 Days",
    features: [
      "Rust Resistant",
      "Modern Design",
      "Lightweight"
    ]
  },

  {
    id: 20,
    name: "Decorative Mirror",
    price: "₹6,499",
    priceValue: 6499,
    category: "Decor",
    material: "Decor",
    image: mirror,
    rating: 4.6,
    stock: true,
    description: "Luxury wall mirror with premium decorative frame.",
    colors: ["Gold"],
    dimensions: "36 x 24 inches",
    warranty: "2 Years",
    delivery: "Free Delivery",
    features: [
      "Premium Glass",
      "Luxury Frame",
      "Easy Wall Mount"
    ]
  }

];

export default furnitureData;  