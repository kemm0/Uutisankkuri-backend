const axios = require('axios');
const { XMLParser } = require('fast-xml-parser');

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

module.exports = {
    getRssFeedJSON
};