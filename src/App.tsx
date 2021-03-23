import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import Modal from "react-modal";

import { BgioLobbyProvider } from "contexts/useBgioLobby";
import { AuthProvider, useAuth } from "hooks/useAuth";
import { ModalCtxProvider, useModalCtx } from "hooks/useModalCtx";
import { NewLobby } from "components/lobby/NewLobby";
import { Login } from "components/lobby/Login";
import { PlayPage } from "components/lobby/PlayPage";
import { Client } from "boardgame.io/react";
import { Local, SocketIO } from "boardgame.io/multiplayer";
import { Debug } from "boardgame.io/debug";

import { myGame } from "./game/game";
import { Board } from "./Board";

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
const deploymentServerAddr = `${protocol}//${hostname}${port ? `${port}` : ``}`;
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
  // will disable this when ready to deploy
  debug: { impl: Debug },
});

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

// for react-modal
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");
const modalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

const AppInterior = () => {
  const { modalIsOpen, closeModal } = useModalCtx();
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/demo">Demo</Link>
          </li>
          <li>
            <Link to="/lobby">Lobby</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/play">Play</Link>
          </li>
        </ul>
      </nav>
      <Switch>
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
        <Route exact path="/">
          <NewLobby />
        </Route>
      </Switch>
      <Modal
        isOpen={modalIsOpen}
        style={modalStyles}
        contentLabel="Example Modal"
      >
        <h2>Hello</h2>
        <button onClick={closeModal}>close</button>
        <div>I am a modal</div>
        <form>
          <input />
          <button>tab navigation</button>
          <button>stays</button>
          <button>inside</button>
          <button>the modal</button>
        </form>
      </Modal>
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
