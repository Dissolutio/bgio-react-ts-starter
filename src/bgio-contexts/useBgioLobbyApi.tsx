import React from "react";
import { LobbyClient } from "boardgame.io/client";
import { LobbyAPI } from "boardgame.io";

import { MyGameState } from "game/game";

type LeaveMatchParams = {
  gameName: string;
  matchID: string;
  options: LeaveMatchOptions;
};
type LeaveMatchOptions = {
  playerID: string;
  credentials: string;
};
type JoinMatchParams = {
  gameName: string;
  matchID: string;
  options: JoinMatchOptions;
};
type JoinMatchOptions = {
  playerID: string;
  playerName: string;
  data?: any;
};
type CreateMatchOptions = {
  setupData: MyGameState;
  numPlayers: number;
  unlisted?: boolean;
};
type UpdatePlayerOptions = {
  playerID: string;
  credentials: string;
  newName?: string;
  data?: any;
};

type BgioLobbyApiCtxValue = {
  lobbyClient: LobbyClient | undefined;
  getLobbyGames: () => Promise<string[]>;
  getLobbyMatches: (gameName: string) => Promise<LobbyAPI.MatchList>;
  getMatch: (gameName: string, matchID: string) => Promise<LobbyAPI.Match>;
  createMatch: (
    gameName: string,
    createGameOptions: CreateMatchOptions
  ) => Promise<LobbyAPI.CreatedMatch>;
  joinMatch: (params: JoinMatchParams) => Promise<LobbyAPI.JoinedMatch>;
  leaveMatch: (params: LeaveMatchParams) => Promise<void>;
  updatePlayer: (
    gameName: string,
    matchID: string,
    options: UpdatePlayerOptions
  ) => Promise<void>;
};

const BgioLobbyApiContext = React.createContext<
  BgioLobbyApiCtxValue | undefined
>(undefined);

type BgioLobbyApiProviderProps = {
  children?: React.ReactNode;
  serverAddress: string;
};
export function BgioLobbyApiProvider({
  serverAddress,
  children,
}: BgioLobbyApiProviderProps) {
  // instantiate the boardgame.io LobbyClient
  const lobbyClientRef = React.useRef(
    new LobbyClient({ server: `${serverAddress}` })
  );
  const lobbyClient = lobbyClientRef.current;

  // BGIO Lobby API
  async function getLobbyGames() {
    return lobbyClient?.listGames();
  }
  async function getLobbyMatches(gameName: string) {
    return lobbyClient.listMatches(gameName);
  }
  async function createMatch(
    gameName: string,
    createGameOptions: CreateMatchOptions
  ) {
    return lobbyClient.createMatch(gameName, createGameOptions);
  }
  async function getMatch(gameName: string, matchID: string) {
    return lobbyClient.getMatch(gameName, matchID);
  }
  async function joinMatch(params: JoinMatchParams) {
    const { gameName, matchID, options } = params;
    return lobbyClient.joinMatch(gameName, matchID, options);
  }
  async function leaveMatch(params: LeaveMatchParams) {
    const { gameName, matchID, options } = params;
    return lobbyClient.leaveMatch(gameName, matchID, options);
  }
  async function updatePlayer(
    gameName: string,
    matchID: string,
    options: UpdatePlayerOptions
  ) {
    const { playerID, credentials, newName, data } = options;
    return lobbyClient.updatePlayer(gameName, matchID, {
      playerID,
      credentials,
      newName,
      data,
    });
  }

  return (
    <BgioLobbyApiContext.Provider
      value={{
        lobbyClient: lobbyClientRef.current,
        getLobbyGames,
        getLobbyMatches,
        getMatch,
        createMatch,
        joinMatch,
        leaveMatch,
        updatePlayer,
      }}
    >
      {children}
    </BgioLobbyApiContext.Provider>
  );
}

export function useBgioLobbyApi() {
  const context = React.useContext(BgioLobbyApiContext);
  if (context === undefined) {
    throw new Error(
      "useBgioLobbyApi must be used within a BgioLobbyApiProvider"
    );
  }
  return context;
}
