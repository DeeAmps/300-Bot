const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const nextPageSchema = new Schema({
    page: String
});

let nextPageModel = mongoose.model("nextpage300", nextPageSchema);
module.exports = nextPageModel