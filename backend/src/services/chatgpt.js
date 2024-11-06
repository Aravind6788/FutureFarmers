const Suggestion = require("../models/suggestion");

async function getSuggestionsFromChatGPT(landType, soilType) {
  try {
    const suggestion = await Suggestion.findOne({ landType, soilType });

    if (!suggestion) {
      return {
        crops:
          "No specific suggestions available for this combination of land and soil type.",
        fertilizers:
          "Please consult with a local agricultural expert for personalized recommendations.",
      };
    }

    return {
      crops: suggestion.crops,
      fertilizers: suggestion.fertilizers,
    };
  } catch (error) {
    console.error("Error getting suggestions:", error);
    return {
      crops: "Error retrieving suggestions. Please try again later.",
      fertilizers: "Error retrieving suggestions. Please try again later.",
    };
  }
}

module.exports = { getSuggestionsFromChatGPT };
