const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    userid: { type: Number, required: true, index: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    costs: { type: Array, required: true },
    computedAt: { type: Date, default: Date.now },
  },
  { collection: "reports" }
);

ReportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model("Report", ReportSchema);
