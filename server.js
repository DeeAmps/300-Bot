const express = require("express");
require('dotenv').config();
const fs = require("fs");
const extfs = require("extfs");
const path = require("path");
const scraper = require("./300Scraper");
const mongoose = require("mongoose");
const nextpage = require("./models/nextpageSchema");
const config = require("./config")

mongoose.connect(`mongodb://${config.DB_USER}:${config.DB_PASSWORD}@${process.env.HOST}`, { keepAlive: 1, connectTimeoutMS: 30000, reconnectTries: 30, reconnectInterval: 5000 }, (err) => {});

const app = express();

let port = process.env.PORT || 3000;

function CallScraper() {
    nextpage.findOne({}, (err, res) => {
        if (res) {
            fetch300NewlyAdded(res.page.trim());
        } else {
            let url = "https://www.300mbfilms.co/"
            fetch300NewlyAdded(url);
        }
    })
}


function fetch300NewlyAdded(url) {
    scraper.Scrape(url);
}

setInterval(CallScraper, 300000);

app.listen(port, () => {
    console.log(`300 Bot running on port ${port}`);
})