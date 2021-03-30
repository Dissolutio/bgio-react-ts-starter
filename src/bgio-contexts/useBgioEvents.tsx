import * as React from "react";
import { BoardProps } from "boardgame.io/react";

type BgioEventsProviderProps = {
  children: React.ReactNode;
  events: BoardProps["events"];
  reset: BoardProps["reset"];
};
const BgioEventsContext = React.createContext<
  { events: BoardProps["events"]; reset: BoardProps["reset"] } | undefined
>(undefined);

export function BgioEventsProvider({
  events,
  reset,
  children,
}: BgioEventsProviderProps) {
  return (
    <BgioEventsContext.Provider
      value={{
        events,
        reset,
      }}
    >
      {children}
    </BgioEventsContext.Provider>
  );
}

export function useBgioEvents() {
  const context = React.useContext(BgioEventsContext);
  if (context === undefined) {
    throw new Error("useBgioEvents must be used within a BgioEventsProvider");
  }
  return context;
}
