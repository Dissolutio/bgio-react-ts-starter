import { myGame } from "./game/game";
import { Board } from "./Board";

import { Local } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";

// Enable Redux DevTools in development
const isDevEnv = process.env.NODE_ENV === "development";
const enhancer = isDevEnv
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  : null;

const bgioClientOptions = {
  game: myGame,
  numPlayers: 2,
  board: Board,
  multiplayer: Local(),
  debug: true,
  enhancer,
};

const GameClient = Client({
  ...bgioClientOptions,
});

export const Demo = () => {
  return <GameClient matchID="matchID" playerID="0" />;
};
