import React from 'react';
import { BoardProps } from 'boardgame.io/react';
import {
  PlayerIDProvider,
  GProvider,
  MovesProvider,
  BgioEventsProvider,
  BgioCtxProvider,
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
        <BgioCtxProvider ctx={ctx}>
          <MovesProvider  moves={moves} undo={undo} redo={redo}>
            <BgioEventsProvider events={events}>
            <UIContextProvider>
              <ExampleUI />
            </UIContextProvider>
            </BgioEventsProvider>
          </MovesProvider>
        </BgioCtxProvider>
      </GProvider>
    </PlayerIDProvider>
  );
};
