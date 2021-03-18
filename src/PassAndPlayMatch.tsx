import { myGame } from './game/game';
import { Board } from './Board';

import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';

// Enable Redux DevTools in development
const isDevEnv = process.env.NODE_ENV === 'development';
const enhancer = isDevEnv
  ? (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  : null;

const bgioClientOptions = {
  game: myGame,
  numPlayers: 2,
  board: Board,
  multiplayer: Local(),
  debug: false,
  enhancer,
};

const GameClient = Client({
  ...bgioClientOptions,
});

export const PassAndPlayMatch = () => {
  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
      <GameClient matchID="matchID" playerID={''} />
      <hr />
      <GameClient matchID="matchID" playerID={'0'} />
      <hr />
      <GameClient matchID="matchID" playerID={'1'} />
    </div>
  );
};
