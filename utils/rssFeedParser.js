const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');
const NewsArticle = require('../models/newsarticle');
const logger = require('../utils/logger');

const getRssFeedJSON = async (url) => {
    let response = null;
    let rssObj = null;
    try{
        response = await axios.get(url);
    }
    catch (error){
        return null;
    }
    if(response === null){
        return null;
    }
    try{
        const parser = new XMLParser();
        rssObj = parser.parse(response.data);
    }
    catch(error){
        return null;
    }
    const title = rssObj.rss.channel.title;
    const items = rssObj.rss.channel.item;

    if(title === null || title === undefined){
        return null;
    }
    if(items === null || items === undefined){
        return null;
    }
    return rssObj;
};

const updateArticles = async (newsfeed) => {
    const data = await getRssFeedJSON(newsfeed.link);

    const articles = data.rss.channel.item;

    let createdArticles = [];

    for(const article of articles){
        try{
            const foundArticle = await NewsArticle.findOne({ link: article.link });
            if(foundArticle !== null){
                continue;
            }
            const newArticle = new NewsArticle({
                headline: article.title,
                link: article.link,
                language: data.rss.channel.language,
                usersRead: 0,
                sourceNewsFeed: newsfeed.id
            });
            createdArticles.push(newArticle);
        }
        catch(error){
            logger.error(`error creating article ${article.title} from feed ${newsfeed.name}`);
        }
    }
    if(createdArticles.length === 0){
        logger.info(`No new articles in feed ${newsfeed.name}`);
        return;
    }
    try{
        await NewsArticle.collection.insertMany(createdArticles);
        logger.info(`Parsed feed "${newsfeed.name}". ${createdArticles.length}/${articles.length} articles were new and saved.`);
    }
    catch(error){
        logger.error(`Could not save articles in feed ${newsfeed.name}. Error message: ` + error);
    }
};

module.exports = {
    getRssFeedJSON,
    updateArticles
};