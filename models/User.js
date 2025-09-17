const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    birthday: { type: Date, required: true },
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", UserSchema);
