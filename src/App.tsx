import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Client } from "boardgame.io/react";
import { Local, SocketIO } from "boardgame.io/multiplayer";

import { myGame } from "./game/game";
import { Board } from "./Board";
import { Lobby } from "./Lobby";
import { NewLobby } from "components/lobby/NewLobby";

// Our app changes based on the npm script run, see package.json or README.md for more info
// THREE OPTIONS:
// * A local game (for game development)
// * A multiplayer lobby/client that connects to a local server (for staging a deployment)
// * A multiplayer lobby/client that connects to its origin server (for deployment)
const isDevEnv = process.env.NODE_ENV === "development";
const isLocalServer = !Boolean(process.env.REACT_APP_WITH_SEPARATE_SERVER);
const isLocalApp = isDevEnv && isLocalServer;
const isDeploymentEnv = process.env.NODE_ENV === "production";
// Use appropriate BGIO multiplayer strategy for environment
const multiplayer = isDeploymentEnv
  ? SocketIO({ server: `https://${window.location.hostname}` })
  : isLocalServer
  ? Local()
  : SocketIO({ server: "http://localhost:8000" });
// Enable Redux DevTools in development
const enhancer = isDevEnv
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  : null;
// SETUP BGIO CLIENT OPTIONS
const clientOptions = {
  game: myGame,
  numPlayers: 2,
  board: Board,
  multiplayer,
  debug: false,
  enhancer,
};

const GameClient = Client({
  ...clientOptions,
});

export const App = () => {
  const { protocol, hostname, port } = window.location;
  const serverAddress = isDeploymentEnv
    ? `${protocol}//${hostname}:${port}`
    : `http://localhost:8000`;
  if (isLocalApp) {
    return <LocalApp />;
  } else {
    return (
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Old Lobby</Link>
            </li>
            <li>
              <Link to="/new">New Lobby</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Route path="/new">
            <NewLobby serverAddress={serverAddress} />
          </Route>
          <Route exact path="/">
            <Lobby serverAddress={serverAddress} />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
};

const LocalApp = () => {
  return (
    <BrowserRouter>
      <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
        <GameClient matchID="matchID" playerID={""} />
        <hr />
        <GameClient matchID="matchID" playerID={"0"} />
        <hr />
        <GameClient matchID="matchID" playerID={"1"} />
      </div>
    </BrowserRouter>
  );
};
