const mongoose = require("mongoose");
const { Schema } = mongoose;

const ALLOWED = ["food", "education", "health", "housing", "sports"];

const CostSchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: ALLOWED },
    userid: { type: Number, required: true, index: true },
    sum: { type: Number, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true, min: 1, max: 12 },
    day: { type: Number, required: true, min: 1, max: 31 },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "costs" }
);

module.exports = mongoose.model("Cost", CostSchema);
