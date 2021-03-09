import * as React from 'react';
import { BoardProps } from 'boardgame.io/react';

type BgioEventsProviderProps = {
  children: React.ReactNode;
  events: BoardProps['events'];
};
const BgioEventsContext = React.createContext<{events: BoardProps['events']} | undefined>(undefined);

export function BgioEventsProvider({ events, children }: BgioEventsProviderProps) {
  return (
    <BgioEventsContext.Provider
      value={{
        events,
      }}
    >
      {children}
    </BgioEventsContext.Provider>
  );
}

export function useBgioEvents() {
  const context = React.useContext(BgioEventsContext);
  if (context === undefined) {
    throw new Error('useBgioEvents must be used within a BgioEventsProvider');
  }
  return context;
}
