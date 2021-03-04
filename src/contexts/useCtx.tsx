import * as React from 'react';
import { BoardProps } from 'boardgame.io/react';
import { usePlayerID } from './usePlayerID';

type CtxProviderProps = {
  children: React.ReactNode;
  ctx: BoardProps['ctx'];
};
type ModifiedCtx = {
  ctx: BoardProps['ctx'] & {
    isMyTurn: boolean;
    isGameover: boolean;
  };
};
const CtxContext = React.createContext<ModifiedCtx | undefined>(undefined);

export function CtxProvider({ ctx, children }: CtxProviderProps) {
  const { playerID } = usePlayerID();
  const isMyTurn: boolean = ctx.currentPlayer === playerID;
  const isGameover: boolean = Boolean(ctx.gameover);
  return (
    <CtxContext.Provider
      value={{
        ctx: {
          ...ctx,
          isMyTurn,
          isGameover,
        },
      }}
    >
      {children}
    </CtxContext.Provider>
  );
}

export function useCtx() {
  const context = React.useContext(CtxContext);
  if (context === undefined) {
    throw new Error('useCtx must be used within a CtxProvider');
  }
  return context;
}
