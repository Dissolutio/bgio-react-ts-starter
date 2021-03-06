const Server = require('boardgame.io/server').Server;
const myGame = require('./server/game').myGame;

const server = Server({ games: [myGame] });
const PORT = process.env.PORT || 8000;

server.run(PORT, () => console.log('dev server running at: PORT'));
