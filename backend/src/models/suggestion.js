const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
  landType: {
    type: String,
    required: true,
  },
  soilType: {
    type: String,
    required: true,
  },
  crops: {
    type: String,
    required: true,
  },
  fertilizers: {
    type: String,
    required: true,
  },
});

// Compound index for faster queries
suggestionSchema.index({ landType: 1, soilType: 1 });

const Suggestion = mongoose.model("Suggestion", suggestionSchema);

module.exports = Suggestion;
