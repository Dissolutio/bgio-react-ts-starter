import * as React from 'react';
import { BoardProps } from 'boardgame.io/react';

type MovesProviderProps = {
  children: React.ReactNode;
  moves: BoardProps['moves'];
  events: BoardProps['events'];
  undo: BoardProps['undo'];
  redo: BoardProps['redo'];
};
const MovesContext = React.createContext<
  | {
      moves: BoardProps['moves'];
      events: BoardProps['events'];
      undo: BoardProps['undo'];
      redo: BoardProps['redo'];
    }
  | undefined
>(undefined);
export function MovesProvider({
  moves,
  events,
  undo,
  redo,
  children,
}: MovesProviderProps) {
  return (
    <MovesContext.Provider value={{ moves, events, undo, redo }}>
      {children}
    </MovesContext.Provider>
  );
}
export function useMoves() {
  const context = React.useContext(MovesContext);
  if (context === undefined) {
    throw new Error('useMoves must be used within a MovesProvider');
  }
  return context;
}
