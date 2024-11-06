const mongoose = require("mongoose");
const Suggestion = require("../models/suggestion");
require("dotenv").config({ path: "../../.env" });

const suggestions = [
  {
    landType: "Tropical",
    soilType: "Clay",
    crops: "1. Rice\n2. Sugarcane\n3. Banana\n4. Taro",
    fertilizers:
      "1. NPK 14-14-14 (Balanced nutrition for clay soil)\n2. Organic compost (Improves soil structure)\n3. Calcium-rich amendments (Helps break up clay)",
  },
  {
    landType: "Tropical",
    soilType: "Sandy",
    crops: "1. Cassava\n2. Sweet Potato\n3. Coconut\n4. Pineapple",
    fertilizers:
      "1. NPK 5-10-5 (Good for sandy soils)\n2. Organic matter (Improves water retention)\n3. Slow-release fertilizers",
  },
  {
    landType: "Tropical",
    soilType: "Loamy",
    crops: "1. Mango\n2. Papaya\n3. Vegetables\n4. Coffee",
    fertilizers: "1. Balanced NPK 10-10-10\n2. Vermicompost\n3. Green manure",
  },
  {
    landType: "Tropical",
    soilType: "Peaty",
    crops: "1. Vegetables\n2. Berry fruits\n3. Root crops\n4. Herbs",
    fertilizers:
      "1. Lime (to balance pH)\n2. Phosphorus-rich fertilizers\n3. Micronutrient mix",
  },
  {
    landType: "Temperate",
    soilType: "Clay",
    crops: "1. Wheat\n2. Corn\n3. Soybeans\n4. Cabbage",
    fertilizers: "1. NPK 10-20-10\n2. Gypsum\n3. Organic matter",
  },
  {
    landType: "Temperate",
    soilType: "Sandy",
    crops: "1. Potatoes\n2. Carrots\n3. Beans\n4. Rye",
    fertilizers: "1. High-nitrogen fertilizer\n2. Compost\n3. Manure",
  },
  {
    landType: "Temperate",
    soilType: "Loamy",
    crops: "1. Apples\n2. Pears\n3. Vegetables\n4. Grains",
    fertilizers: "1. Balanced NPK\n2. Organic compost\n3. Cover crop residues",
  },
  {
    landType: "Temperate",
    soilType: "Peaty",
    crops:
      "1. Blueberries\n2. Cranberries\n3. Root vegetables\n4. Leafy greens",
    fertilizers: "1. Acidifying fertilizers\n2. Iron supplements\n3. Calcium",
  },
  {
    landType: "Arid or Semi-Arid",
    soilType: "Clay",
    crops: "1. Cotton\n2. Sorghum\n3. Chickpeas\n4. Dates",
    fertilizers:
      "1. Phosphorus-rich fertilizer\n2. Sulfur\n3. Zinc supplements",
  },
  {
    landType: "Arid or Semi-Arid",
    soilType: "Sandy",
    crops:
      "1. Drought-resistant grains\n2. Cacti\n3. Desert legumes\n4. Melons",
    fertilizers:
      "1. Slow-release NPK\n2. Water-retention polymers\n3. Organic mulch",
  },
  {
    landType: "Arid or Semi-Arid",
    soilType: "Loamy",
    crops: "1. Olives\n2. Grapes\n3. Figs\n4. Pomegranates",
    fertilizers:
      "1. Drip-irrigation compatible fertilizers\n2. Micronutrient mix\n3. Organic matter",
  },
  {
    landType: "Arid or Semi-Arid",
    soilType: "Peaty",
    crops:
      "1. Drought-tolerant herbs\n2. Native grasses\n3. Medicinal plants\n4. Hardy shrubs",
    fertilizers: "1. Low-salt fertilizers\n2. pH balancers\n3. Trace minerals",
  },
];

// Use the MongoDB connection string from the environment variable or fallback to a default
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb+srv://aravind6788:GJbGnYkisZGzBE48@futurefarmers.brgcz.mongodb.net/";

async function populateSuggestions() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB successfully");

    // Clear existing suggestions
    await Suggestion.deleteMany({});
    console.log("Cleared existing suggestions");

    // Insert new suggestions
    const result = await Suggestion.insertMany(suggestions);
    console.log(`Inserted ${result.length} suggestions successfully`);

    console.log("Suggestions populated successfully!");
  } catch (error) {
    console.error("Error populating suggestions:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
}

populateSuggestions();
