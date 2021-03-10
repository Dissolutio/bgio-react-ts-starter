import * as React from 'react';
import { BoardProps } from 'boardgame.io/react';

type BgioMovesProviderProps = {
  children: React.ReactNode;
  moves: BoardProps['moves'];
  undo: BoardProps['undo'];
  redo: BoardProps['redo'];
};
const BgioMovesContext = React.createContext<
  | {
      moves: BoardProps['moves'];
      undo: BoardProps['undo'];
      redo: BoardProps['redo'];
    }
  | undefined
>(undefined);
export function BgioMovesProvider({
  moves,
  undo,
  redo,
  children,
}: BgioMovesProviderProps) {
  return (
    <BgioMovesContext.Provider value={{ moves,
      undo, redo }}>
      {children}
    </BgioMovesContext.Provider>
  );
}
export function useBgioMoves() {
  const context = React.useContext(BgioMovesContext);
  if (context === undefined) {
    throw new Error('useBgioMoves must be used within a BgioMovesProvider');
  }
  return context;
}
