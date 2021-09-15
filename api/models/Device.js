const mongoose = require("mongoose");

const DeviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String },
    img: { type: String },


    genre: { type: String },
    coordinates:{
      type:Array,
      default:[]
  }

  },
  { timestamps: true }
);

module.exports = mongoose.model("Device", DeviceSchema);
