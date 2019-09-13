require('dotenv').config();
const twit = require("twit");
const released = require("./models/releasedSchema");
const config = require("./config")


let twitConfig = {
    consumer_key: config.API_KEY,
    consumer_secret: config.SECRET,
    access_token: config.ACCESS_TOKEN,
    access_token_secret: config.ACCESS_TOKEN_SECRET
}

const Twitter = new twit(twitConfig);

module.exports = {
    TweetReleases: function() {
        released.find({}, (err, res) => {
            if (res.length > 1) {
                res.forEach((element) => {
                    Twitter.post('statuses/update', { status: `${element.title} is out\nDownload here ${element.link}` }, function(err, data, response) {});
                    released.findOneAndRemove({ title: element.title }, (err, res) => {})
                })
            }
        })
    }
}