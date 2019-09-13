const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const releasedSchema = new Schema({
    title: String,
    image: String,
    link: String,
    postDate: String
});

let releasedModel = mongoose.model("releasedon300", releasedSchema);
module.exports = releasedModel