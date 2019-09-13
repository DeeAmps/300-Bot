const request = require("request");
const cheerio = require('cheerio');
const fs = require("fs");
const path = require("path");
const nextpage = require("./models/nextpageSchema");
const posted = require("./models/postedSchema");
const released = require("./models/releasedSchema");
const tweetBot = require("./tweetBot");

module.exports = {
    Scrape: function(url) {
        request(url, (err, res, body) => {
            const $ = cheerio.load(body);
            let nextPage = $("link[rel$='next']").attr('href');

            let newPage = new nextpage();
            newPage.page = nextPage;
            newPage.save((err) => {});

            let postsPerPage = $(".entry");
            postsPerPage.each((index, obj) => {
                let divContents = $(obj).html();
                let links = $("span.zbench-more-link");
                let newObj = links[index];
                let posts = $("span.post-info-date");
                let newPostObj = posts[index];

                let titlesPerPage = $(divContents).find('img').attr('alt');
                let imgSrcPerPage = $(divContents).find('img').attr('src');
                let downloadLink = $(newObj).find("a").attr("href");
                let postDate = $(newPostObj).find("a[rel$='bookmark']").text();

                let postedDayOfMonth = new Date(Date.parse(postDate)).getDate();
                let todaysDate = new Date(Date.now()).getDate();

                posted.find({ title: titlesPerPage }, (err, res) => {
                    if (res.length === 0 && postedDayOfMonth == todaysDate) {
                        let newPosted = new posted();
                        newPosted.title = titlesPerPage;
                        newPosted.save((err) => {});

                        let newReleased = new released();

                        newReleased.title = titlesPerPage;
                        newReleased.image = imgSrcPerPage;
                        newReleased.link = downloadLink;
                        newReleased.postDate = postDate;

                        newReleased.save((err) => {});

                    } else {
                        nextpage.remove({}, (err) => {});
                    }
                });
            });
            tweetBot.TweetReleases();

        });
    }
}

function existsInFile(title) {
    let exists = fs.readFileSync(path.join(__dirname, "PostedMovies.txt"), 'utf-8').split('\n');
    for (let index = 0; index < exists.length; index++) {
        if (exists[index].trim() === title.toString().trim()) {
            return true;
        }
    }
    return false;

}