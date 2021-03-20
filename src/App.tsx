import { BrowserRouter, Switch, Route } from "react-router-dom";
import { NewLobby } from "components/lobby/NewLobby";
import { Demo } from "./Demo";

// ! Three Options:
// * Client that connects to its origin server `npm run build`
// * Client that connects to a local server `npm run devstart`
// * A local game (for game development) `npm run start`
const isDeploymentEnv = process.env.NODE_ENV === "production";
const isDevEnv = process.env.NODE_ENV === "development";
const isSeparateServer = Boolean(process.env.REACT_APP_WITH_SEPARATE_SERVER);
const isLocalApp = isDevEnv && !isSeparateServer;

// use appropriate address for server
const decideServerAddress = () => {
  if (isSeparateServer) {
    return "http://localhost:8000";
  }
  if (isDeploymentEnv) {
    const { protocol, hostname, port } = window.location;
    return `${protocol}//${hostname}${port ? `${port}` : ``}`;
  }
};

export const App = () => {
  if (isLocalApp) {
    return <Demo />;
  } else {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <NewLobby serverAddress={decideServerAddress()} />
          </Route>
          <Route exact path="/demo">
            <Demo />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
};
