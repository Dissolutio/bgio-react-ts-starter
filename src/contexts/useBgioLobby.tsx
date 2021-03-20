import React, { useState, useEffect } from "react";
import { LobbyClient } from "boardgame.io/client";
import { LobbyAPI } from "boardgame.io";
import { MyGameCreateMatchOptions } from "components/lobby/types";

export type JoinMatchHandler = (options: JoinMatchOptions) => Promise<void>;
type JoinMatchParams = {
  gameName: string;
  matchID: string;
  options: JoinMatchOptions;
};
export type JoinMatchOptions = {
  playerID: string;
  playerName: string;
  data?: any;
};

type LobbyMatches = {
  [gameName: string]: LobbyAPI.Match[];
};
type LobbyMatchesError = {
  [gameName: string]: string;
};
type BgioLobbyCtxValue = {
  lobbyClient: LobbyClient | undefined;
  getLobbyGames: any;
  getLobbyMatches: (gameName: string) => Promise<LobbyAPI.MatchList>;
  getMatch: (gameName: string, matchID: string) => Promise<LobbyAPI.Match>;
  createMatch: (
    gameName: string,
    createGameOptions: MyGameCreateMatchOptions
  ) => Promise<string | undefined>;
  joinMatch: (params: JoinMatchParams) => Promise<string>;
  lobbyGames: string[];
  lobbyMatches: LobbyMatches;
  lobbyMatchesError: LobbyMatchesError;
  lobbyGamesError: string;
  createMatchError: string;
  createMatchSuccess: string;
  getMatchByIDSuccess: string;
  getMatchByIDError: string;
};

type BgioLobbyProviderProps = {
  children: React.ReactNode;
  serverAddress: string;
};

const BgioLobbyContext = React.createContext<BgioLobbyCtxValue | undefined>(
  undefined
);

export function BgioLobbyProvider({
  serverAddress,
  children,
}: BgioLobbyProviderProps) {
  // instantiate the boardgame.io LobbyClient
  const lobbyClientRef = React.useRef(
    new LobbyClient({ server: `${serverAddress}` })
  );
  const lobbyClient = lobbyClientRef.current;
  // STATE
  const [lobbyGames, setLobbyGames] = useState<string[]>([]);
  const [lobbyGamesError, setLobbyGamesError] = useState("");
  const [lobbyMatches, setLobbyMatches] = useState<LobbyMatches>({});
  const [lobbyMatchesError, setLobbyMatchesError] = useState<LobbyMatchesError>(
    {}
  );
  const [createMatchSuccess, setCreateMatchSuccess] = useState("");
  const [createMatchError, setCreateMatchError] = useState("");
  const [getMatchByIDSuccess, setGetMatchByIDSuccess] = useState("");
  const [getMatchByIDError, setGetMatchByIDError] = useState("");

  // initial fetch games
  useEffect(() => {
    getLobbyGames();
    // eslint reason: Only want to fetch games on mount for now.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // BGIO Lobby API
  async function getLobbyGames() {
    try {
      const games = await lobbyClient.listGames();
      if (games) {
        setLobbyGamesError("");
        setLobbyGames(games);
        return games;
      }
    } catch (error) {
      setLobbyGamesError(error.message);
      console.log(`🚀 ~ getLobbyGames ~ error`, error);
    }
  }
  async function getLobbyMatches(gameName: string) {
    try {
      const matches = await lobbyClient.listMatches(gameName);
      if (matches) {
        setLobbyMatchesError((s) => ({
          ...s,
          [gameName]: undefined,
        }));
        setLobbyMatches((s) => ({ ...s, [gameName]: matches.matches }));
        return matches;
      }
    } catch (error) {
      setLobbyMatchesError((s) => ({ ...s, [gameName]: error.message }));
      console.log(`🚀 ~ getLobbyMatches ~ error`, error);
    }
  }
  async function createMatch(
    gameName: string,
    createGameOptions: MyGameCreateMatchOptions
  ) {
    const { numPlayers, setupData, unlisted = false } = createGameOptions;
    try {
      const { matchID }: LobbyAPI.CreatedMatch = await lobbyClient.createMatch(
        `${gameName}`,
        {
          numPlayers,
          setupData,
          unlisted,
        }
      );
      // const  = response;
      if (matchID) {
        setCreateMatchSuccess(matchID);
        setCreateMatchError("");
        getLobbyMatches(gameName);
        return matchID;
      }
    } catch (error) {
      setCreateMatchError(error.message);
      console.log(`🚀 ~ createMatch ~ error`, error);
    }
  }
  async function getMatch(gameName: string, matchID: string) {
    try {
      //? UNEXPECTED SERVER RETURN: if `matchID` matches but `gameName` does not, bgio server sends back the match anyway it seems
      const response = await lobbyClient.getMatch(gameName, matchID);
      if (response) {
        setGetMatchByIDError("");
        setGetMatchByIDSuccess(`${matchID}`);
        return response;
      }
      return response;
    } catch (error) {
      console.log(`🚀 ~ getMatch ~ error`, error);
      setGetMatchByIDSuccess(``);
      setGetMatchByIDError(error.message);
    }
  }
  async function joinMatch(params: JoinMatchParams) {
    const { gameName, matchID, options } = params;
    try {
      const { playerCredentials } = await lobbyClient.joinMatch(
        gameName,
        matchID,
        options
      );
      return playerCredentials;
    } catch (error) {
      console.log(`🚀 ~ joinMatch ~ error`, error);
    }
  }

  return (
    <BgioLobbyContext.Provider
      value={{
        lobbyClient: lobbyClientRef.current,
        getLobbyGames,
        getLobbyMatches,
        getMatch,
        createMatch,
        joinMatch,
        lobbyGames,
        lobbyGamesError,
        lobbyMatches,
        lobbyMatchesError,
        createMatchError,
        createMatchSuccess,
        getMatchByIDSuccess,
        getMatchByIDError,
      }}
    >
      {children}
    </BgioLobbyContext.Provider>
  );
}

export function useBgioLobby() {
  const context = React.useContext(BgioLobbyContext);
  if (context === undefined) {
    throw new Error("useBgioLobby must be used within a BgioLobbyProvider");
  }
  return context;
}
