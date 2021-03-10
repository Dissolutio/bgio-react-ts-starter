import * as React from "react";

//🛠️ PLAYERID
type PlayerIDProviderProps = { children: React.ReactNode; playerID: string };
const PlayerIDContext = React.createContext<
  { playerID: string; belongsToPlayer: (thing: any) => boolean } | undefined
>(undefined);

export function PlayerIDProvider({
  playerID,
  children,
}: PlayerIDProviderProps) {
  if (playerID === "") {
    playerID = "observer";
  }
  const belongsToPlayer = (thing: any): boolean => thing?.playerID === playerID;
  return (
    <PlayerIDContext.Provider value={{ playerID: playerID, belongsToPlayer }}>
      {children}
    </PlayerIDContext.Provider>
  );
}
export function useBgioClientInfo() {
  const context = React.useContext(PlayerIDContext);
  if (context === undefined) {
    throw new Error("useBgioClientInfo must be used within a PlayerIDProvider");
  }
  return context;
}
