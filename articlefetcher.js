const NewsFeed = require('./models/newsfeed');
const rssFeedParser = require('./utils/rssFeedParser');
const config = require('./utils/config');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

const fetchNewsFromFeeds = async () => {

    logger.info('connecting to mongoDB');

    await mongoose.connect(config.MONGODB_URL)
        .catch(error => {
            logger.error(error);
        });

    const newsFeeds = await NewsFeed.find({});

    let fetchOperations = [];

    for(const newsFeed of newsFeeds){
        const fetch = rssFeedParser.updateArticles(newsFeed);
        fetchOperations.push(fetch);
    }

    return fetchOperations;
};

setInterval(() => {
    fetchNewsFromFeeds().then((fetches) => {
        Promise.all(fetches).then(() => {
            mongoose.disconnect();
        });
    });
}, 60000);

