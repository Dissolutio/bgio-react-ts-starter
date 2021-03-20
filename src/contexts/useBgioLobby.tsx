import React, { useState, useEffect } from "react";
import { LobbyClient } from "boardgame.io/client";
import { LobbyAPI } from "boardgame.io";
import {
  MyGameCreateMatchOptions,
  JoinMatchParams,
} from "components/lobby/types";

type AvailableMatches = {
  [gameName: string]: LobbyAPI.Match[];
};
type AvailableMatchesError = {
  [gameName: string]: string;
};
type BgioLobbyCtxValue = {
  lobbyClient: LobbyClient | undefined;
  fetchAvailableGames: any;
  fetchAvailableMatches: (gameName: string) => Promise<LobbyAPI.MatchList>;
  getMatch: (gameName: string, matchID: string) => Promise<LobbyAPI.Match>;
  createMatch: (
    gameName: string,
    createGameOptions: MyGameCreateMatchOptions
  ) => Promise<string | undefined>;
  joinMatch: (params: JoinMatchParams) => Promise<string>;
  availableGames: LobbyAPI.GameList;
  availableMatches: AvailableMatches;
  availableMatchesError: AvailableMatchesError;
  availableGamesError: string;
  createMatchError: string;
  createMatchSuccess: string;
  getMatchByIDSuccess: string;
  getMatchByIDError: string;
};

const BgioLobbyContext = React.createContext<BgioLobbyCtxValue | undefined>(
  undefined
);

type BgioLobbyProviderProps = {
  children: React.ReactNode;
  serverAddress: string;
};

export function BgioLobbyProvider({
  serverAddress,
  children,
}: BgioLobbyProviderProps) {
  const lobbyClientRef = React.useRef(
    new LobbyClient({ server: `${serverAddress}` })
  );
  const lobbyClient = lobbyClientRef.current;

  const [availableGames, setAvailableGames] = useState<string[]>([]);
  const [availableGamesError, setAvailableGamesError] = useState("");
  const [availableMatches, setAvailableMatches] = useState<AvailableMatches>(
    {}
  );
  const [
    availableMatchesError,
    setAvailableMatchesError,
  ] = useState<AvailableMatchesError>({});

  const [createMatchError, setCreateMatchError] = useState("");
  const [createMatchSuccess, setCreateMatchSuccess] = useState("");
  const [getMatchByIDSuccess, setGetMatchByIDSuccess] = useState("");
  const [getMatchByIDError, setGetMatchByIDError] = useState("");

  //! GET GAMES
  async function fetchAvailableGames() {
    try {
      const games = await lobbyClient.listGames();
      if (games) {
        setAvailableGamesError("");
        setAvailableGames(games);
        return games;
      }
    } catch (error) {
      setAvailableGamesError(error.message);
      console.log(`🚀 ~ fetchAvailableGames ~ error`, error);
    }
  }
  //! GET MATCHES
  async function fetchAvailableMatches(gameName: string) {
    try {
      const matches = await lobbyClient.listMatches(gameName);
      if (matches) {
        setAvailableMatchesError((s) => ({
          ...s,
          [gameName]: undefined,
        }));
        setAvailableMatches((s) => ({ ...s, [gameName]: matches.matches }));
        return matches;
      }
    } catch (error) {
      setAvailableMatchesError((s) => ({ ...s, [gameName]: error.message }));
      console.log(`🚀 ~ fetchAvailableMatches ~ error`, error);
    }
  }
  // similar to fetchAvailableMatches but does not update error state
  async function updateAvailableMatches(gameName: string) {
    try {
      const matches = await lobbyClient.listMatches(gameName);
      if (matches) {
        setAvailableMatches((s) => ({ ...s, [gameName]: matches.matches }));
        return matches;
      }
    } catch (error) {
      // todo: set some kind of 'lost-connection' state?
      console.log(`🚀 ~ fetchAvailableMatches ~ error`, error);
    }
  }
  //! CREATE MATCH
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
        updateAvailableMatches(gameName);
        return matchID;
      }
    } catch (error) {
      setCreateMatchError(error.message);
      console.log(`🚀 ~ createMatch ~ error`, error);
    }
  }
  //! GET MATCH BY ID
  async function getMatch(gameName: string, matchID: string) {
    try {
      //? matchID matches an available match but the gameName is not the same, bgio server sends back the match anyway it seems
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
  //! JOIN MATCH
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
  //! Effect: initial fetch games
  useEffect(() => {
    async function initializeGames() {
      if (lobbyClient) {
        const games = await fetchAvailableGames();
        console.log(`🚀 ~ initializeGames ~ games`, games);
      }
    }
    initializeGames();
    // disabled reason: Only want to run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BgioLobbyContext.Provider
      value={{
        lobbyClient: lobbyClientRef.current,
        fetchAvailableGames,
        fetchAvailableMatches,
        getMatch,
        createMatch,
        joinMatch,
        availableGames,
        availableGamesError,
        availableMatches,
        availableMatchesError,
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
