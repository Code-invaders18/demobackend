const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      reqiure: true,
      trim: true,
      maxlength: 32,
      unique: true,
    },
  },
  { timestamp: true }
);
module.exports = mongoose.model("Category", categorySchema);
