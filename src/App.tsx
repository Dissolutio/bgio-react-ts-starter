import { BrowserRouter, Switch, Route } from "react-router-dom";
import { NewLobby } from "components/lobby/NewLobby";
import { PassAndPlayMatch } from "./PassAndPlayMatch";

// ! Three Options:
// * Client that connects to its origin server `npm run build`
// * Client that connects to a local server `npm run devstart`
// * A local game (for game development) `npm run start`
const isDeploymentEnv = process.env.NODE_ENV === "production";
const isDevEnv = process.env.NODE_ENV === "development";
const isLocalServer = !Boolean(process.env.REACT_APP_WITH_SEPARATE_SERVER);
const isLocalApp = isDevEnv && isLocalServer;

let server;
if (isDeploymentEnv) {
  const { protocol, hostname, port } = window.location;
  server = `${protocol}//${hostname}`;
  if (port) {
    server += `:${port}`;
  }
} else {
  server = "http://localhost:8000";
}

export const App = () => {
  if (isLocalApp) {
    return <PassAndPlayMatch />;
  } else {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <NewLobby serverAddress={server} />
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
};
