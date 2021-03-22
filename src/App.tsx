import { BrowserRouter, Switch, Route } from "react-router-dom";
import { NewLobby } from "components/lobby/NewLobby";
import { Demo } from "./Demo";
import { BgioLobbyProvider } from "contexts/useBgioLobby";
import { AuthProvider } from "hooks/useAuth";

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

export const App = () => {
  if (isLocalApp) {
    return <Demo />;
  } else {
    return (
      <BgioLobbyProvider serverAddress={SERVER}>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </BgioLobbyProvider>
    );
  }
};

const AppRoutes = () => {
  return (
    <Switch>
      <Route exact path="/demo">
        <Demo />
      </Route>
      <Route path="/">
        <NewLobby />
      </Route>
    </Switch>
  );
};
