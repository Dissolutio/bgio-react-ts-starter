import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  NavLink,
} from "react-router-dom";

import { BgioLobbyProvider, useBgioLobby } from "contexts/useBgioLobby";
import { AuthProvider, useAuth } from "hooks/useAuth";
import { ModalCtxProvider } from "hooks/useModalCtx";
import { NewLobby } from "components/lobby/NewLobby";
import { Login } from "components/lobby/Login";
import { Client } from "boardgame.io/react";
import { Local, SocketIO } from "boardgame.io/multiplayer";
import { Debug } from "boardgame.io/debug";

import { myGame } from "./game/game";
import { Board } from "./Board";
import { MyModal } from "components/MyModal";

// ! Three Options:
// * Client that connects to its origin server `npm run build`
// * Client that connects to a local server `npm run devstart`
// * A local game (for game development) `npm run start`

const isDeploymentEnv = process.env.NODE_ENV === "production";
const isDevEnv = process.env.NODE_ENV === "development";
const isSeparateServer = Boolean(process.env.REACT_APP_WITH_SEPARATE_SERVER);
const isLocalApp = isDevEnv && !isSeparateServer;

// use appropriate address for server
const { protocol, hostname, port } = window.location;
const deploymentServerAddr = `${protocol}//${hostname}${
  port ? `:${port}` : ``
}`;
const localServerAddr = `http://localhost:8000`;
const SERVER = isDeploymentEnv ? deploymentServerAddr : localServerAddr;

// Enable Redux DevTools in development
const reduxDevTools =
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION__();

const bgioClientOptions = {
  game: myGame,
  board: Board,
  numPlayers: 2,
};

export const DemoGameClient = Client({
  ...bgioClientOptions,
  multiplayer: Local(),
  enhancer: reduxDevTools,
  debug: { impl: Debug },
});

export const MultiplayerGameClient = Client({
  ...bgioClientOptions,
  multiplayer: SocketIO({ server: SERVER }),
});

const PlayPage = () => {
  const { storedCredentials } = useAuth();
  const { playerID, matchID, playerCredentials } = storedCredentials;
  //TODO
  // if (!playerID || !matchID || !playerCredentials) {
  //   <h2>Sorry, you have not joined a game yet!</h2>;
  // }
  return (
    <MultiplayerGameClient
      matchID={matchID}
      playerID={playerID}
      credentials={playerCredentials}
    />
  );
};

export const App = () => {
  if (isLocalApp) {
    return <DemoGameClient matchID="matchID" playerID="0" />;
  } else {
    return (
      <AuthProvider>
        <BgioLobbyProvider serverAddress={SERVER}>
          <ModalCtxProvider>
            <BrowserRouter>
              <AppInterior />
            </BrowserRouter>
          </ModalCtxProvider>
        </BgioLobbyProvider>
      </AuthProvider>
    );
  }
};

const AppInterior = () => {
  const { joinedMatch } = useBgioLobby();
  const isJoinedInMatch = Boolean(joinedMatch?.matchID);
  return (
    <>
      <nav>
        <ul>
          <li>
            <NavLink exact to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/demo">Demo</NavLink>
          </li>
          <li>
            <NavLink to="/lobby">Lobby</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
          {isJoinedInMatch ? (
            <li>
              <NavLink to="/play">Play</NavLink>
            </li>
          ) : null}
        </ul>
      </nav>
      <Switch>
        <Route exact path="/">
          <NewLobby />
        </Route>
        <Route path="/demo">
          <DemoGameClient matchID="matchID" playerID="0" />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <PrivateRoute path="/lobby">
          <NewLobby />
        </PrivateRoute>
        <PrivateRoute path="/play">
          <PlayPage />
        </PrivateRoute>
      </Switch>
      <MyModal />
    </>
  );
};

function PrivateRoute({ children, ...rest }) {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
