import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom";
import Modal from "react-modal";

import { NewLobby } from "components/lobby/NewLobby";
import { PlayPage } from "components/lobby/PlayPage";
import { Demo } from "./Demo";
import { BgioLobbyProvider, useBgioLobby } from "contexts/useBgioLobby";
import { AuthProvider, useAuth } from "hooks/useAuth";
import { ModalCtxProvider, useModalCtx } from "hooks/useModalCtx";
import { Login } from "components/lobby/Login";

// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement("#root");

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

export const App = () => {
  if (isLocalApp) {
    return <Demo />;
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
  const { modalIsOpen, closeModal } = useModalCtx();
  const { storedCredentials } = useAuth();
  console.log(`🚀 ~ AppInterior ~ storedCredentials`, storedCredentials);
  const { joinedMatch } = useBgioLobby();
  console.log(`🚀 ~ AppInterior ~ joinedMatch`, joinedMatch);
  return (
    <>
      <Nav />
      <AppRoutes />
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
const Nav = () => {
  return (
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
  );
};

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/demo">
        <Demo />
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
