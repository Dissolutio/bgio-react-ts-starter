import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import {
  PlayerIDProvider,
  GProvider,
  MovesProvider,
  CtxProvider,
  UIContextProvider,
} from 'contexts';
import { ExampleUI } from './components/ExampleUI';
export const Board: React.FunctionComponent<BoardProps> = ({
  playerID,
  G,
  ctx,
  moves,
  events,
  undo,
  redo,
}) => {
  return (
    <PlayerIDProvider playerID={playerID}>
      <GProvider G={G}>
        <CtxProvider ctx={ctx}>
          <MovesProvider events={events} moves={moves} undo={undo} redo={redo}>
            <UIContextProvider>
              <ExampleUI />
            </UIContextProvider>
          </MovesProvider>
        </CtxProvider>
      </GProvider>
    </PlayerIDProvider>
  );
};
