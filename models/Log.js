const mongoose = require("mongoose");
const { Schema } = mongoose;

const LogSchema = new Schema(
  {
    method: { type: String, required: true },
    path: { type: String, required: true },
    status: { type: Number, required: true },
    msg: { type: String, required: true },
    at: { type: Date, default: Date.now },
  },
  { collection: "logs" }
);

module.exports = mongoose.model("Log", LogSchema);
