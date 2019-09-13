const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postedSchema = new Schema({
    title: String
});

let postedModel = mongoose.model("postedon300", postedSchema);
module.exports = postedModel