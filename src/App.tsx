import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Client } from "boardgame.io/react";
import { Local, SocketIO } from "boardgame.io/multiplayer";
import { Debug } from "boardgame.io/debug";

import { BgioLobbyApiProvider } from "bgio-contexts";
import { AuthProvider, useAuth } from "hooks/useAuth";
import { MultiplayerLobby, MultiplayerLobbyProvider } from "lobby";
import { myGame } from "./game/game";
import { Board } from "./Board";
import { MultiplayerNav } from "./Nav";
import { isLocalApp, SERVER } from "./constants";


// Enable Redux DevTools in development
const reduxDevTools =
  window &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
  (window as any).__REDUX_DEVTOOLS_EXTENSION__();

const bgioClientOptions = {
  game: myGame,
  board: Board,
  numPlayers: 2,
};

const DemoGameClient = Client({
  ...bgioClientOptions,
  multiplayer: Local(),
  enhancer: reduxDevTools,
  debug: { impl: Debug },
});

const MultiplayerGameClient = Client({
  ...bgioClientOptions,
  multiplayer: SocketIO({ server: SERVER }),
  debug: false,
});

export const App = () => {
  if (isLocalApp) {
    return <LocalApp />;
  } else {
    return (
      <AuthProvider>
        <BgioLobbyApiProvider serverAddress={SERVER}>
          <MultiplayerLobbyProvider>
            <BrowserRouter>
              <Switch>
                <Route exact path="/">
                  <MultiplayerNav />
                  <MultiplayerLobby />
                </Route>
                <Route path="/demo">
                  <MultiplayerNav />
                  <DemoGameClient matchID="matchID" playerID="0" />
                </Route>
                <Route path="/play">
                  <MultiplayerNav />
                  <PlayPage />
                </Route>
              </Switch>
            </BrowserRouter>
          </MultiplayerLobbyProvider>
        </BgioLobbyApiProvider>
      </AuthProvider>
    );
  }
};

const LocalApp = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <DemoGameClient matchID="matchID" playerID="0" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

const PlayPage = () => {
  const { storedCredentials } = useAuth();
  const { playerID, matchID, playerCredentials } = storedCredentials;
  if (!playerID || !matchID || !playerCredentials) {
    return (
      <p>
        You are not currently joined in a match.{" "}
        <Link to="/">Return to Lobby?</Link>
      </p>
    );
  }
  return (
    <MultiplayerGameClient
      matchID={matchID}
      playerID={playerID}
      credentials={playerCredentials}
    />
  );
};
