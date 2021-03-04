import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Client, Lobby as BgioLobby } from 'boardgame.io/react';
import { Local, SocketIO } from 'boardgame.io/multiplayer';

import { myGame } from './game/game';
import { Board } from './Board';

//! LOCAL APP with NO SERVER
// `npm run start`
// local multiplayer, no server, no lobby
const isDev = process.env.NODE_ENV === 'development';

//! APP with LOCAL SERVER
// `npm run devstart` + `npm run devserver`
// lobby & client that connect to the node server in ~/devserver.js
const withSeparateServer = Boolean(process.env.REACT_APP_WITH_SEPARATE_SERVER);

//! APP for PRODUCTION SERVER
// `npm run build`
// lobby & client as static asset for node server in ~/server.js
const isProduction = process.env.NODE_ENV === 'production';

const serverGamesList = [{ game: myGame, board: Board }];

export const App = () => {
  const { protocol, hostname, port } = window.location;
  const serverAddress = isProduction
    ? `${protocol}//${hostname}:${port}`
    : `http://localhost:8000`;
  return (
    <BrowserRouter>
      {/* DEV - local multiplayer, no server, no lobby */}
      {isDev && !withSeparateServer && <LocalApp />}
      {/* SEPARATE - lobby & client that connect to the node server in ~/devserver.js */}
      {isDev && withSeparateServer && (
        <Lobby serverAddress={serverAddress} importedGames={serverGamesList} />
      )}
      {/* PROD - lobby & client for build and deployment as static asset for node server in ~/server.js */}
      {isProduction && (
        <Lobby serverAddress={serverAddress} importedGames={serverGamesList} />
      )}
    </BrowserRouter>
  );
};

const LocalApp = () => {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <ul style={{ margin: 0 }}>
        <li>
          <Link to="/">Observer</Link>
        </li>
        <li>
          <Link to="/0">Player0</Link>
        </li>
        <li>
          <Link to="/1">Player1</Link>
        </li>
        <li>
          <Link to="/both">{`Both Player 0 & 1`}</Link>
        </li>
      </ul>
      <Switch>
        <Route exact path="/">
          {/* NO playerID will make client an observer in match */}
          <GameClient matchID="matchID" playerID={''} />
        </Route>
        <Route path="/0">
          <GameClient matchID="matchID" playerID={'0'} />
        </Route>
        <Route path="/1">
          <GameClient matchID="matchID" playerID={'1'} />
        </Route>
        <Route path="/both">
          <GameClient matchID="matchID" playerID={'0'} />
          <hr />
          <GameClient matchID="matchID" playerID={'1'} />
        </Route>
      </Switch>
    </div>
  );
};

const Lobby = ({ serverAddress, importedGames }) => {
  return (
    <BgioLobby
      gameServer={serverAddress}
      lobbyServer={serverAddress}
      gameComponents={importedGames}
    />
  );
};

const clientOptions = {
  game: myGame,
  numPlayers: 2,
  board: Board,
  multiplayer: isProduction
    ? SocketIO({ server: `https://${window.location.hostname}` })
    : withSeparateServer
    ? SocketIO({ server: 'http://localhost:8000' })
    : Local(),
  debug: false,
  enhancer: isDev
    ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
    : null,
};
const GameClient = Client({
  ...clientOptions,
});
