#Uutisankkuri backend

This is the Uutisankkuri backend application / server. Provides an API for the Uutisankkuri client for creating users, logging in, creating new RSS feed boards, adding news feeds and retrieving the feed headlines.

#How to use

1. Go to project root folder
2. Create a file called .env
3. Define the following variables in .env file. The values come after the = symbol

```
MONGODB_URL=your_mongodb_url_here
PORT=port_number_here
TOKENSECRET=some_secret_here
```
4. Install npm packages
```
npm install
```
5. Run the server program
```
node index.js
```
6. Start fetching articles to the database. Run in another terminal:
```
node articlefetcher.js
```

#TODO

[Trello-board](https://trello.com/b/oJJQuuAT/uutisankkuri-backend)