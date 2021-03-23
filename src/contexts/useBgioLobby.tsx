import React, { useState, useEffect } from "react";
import { LobbyClient } from "boardgame.io/client";
import { LobbyAPI } from "boardgame.io";

import { MyGameCreateMatchOptions } from "components/lobby/types";
import { useLocalStorage } from "hooks";
import { defaultSetupData, MYGAME_NUMPLAYERS } from "game/game";

export type JoinMatchHandler = (options: JoinMatchOptions) => Promise<void>;
type LeaveMatchParams = {
  gameName: string;
  matchID: string;
  options: LeaveMatchOptions;
};
export type LeaveMatchOptions = {
  playerID: string;
  credentials: string;
};
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
type StoredCredentials = {
  matchID: string;
  playerCredentials: string;
  playerID: string;
  playerName: string;
};
type BgioLobbyCtxValue = {
  lobbyClient: LobbyClient | undefined;
  getLobbyGames: () => Promise<string[]>;
  getLobbyMatches: (gameName: string) => Promise<LobbyAPI.MatchList>;
  // getMatch: (gameName: string, matchID: string) => Promise<LobbyAPI.Match>;
  // createMatch: (
  //   gameName: string,
  //   createGameOptions: MyGameCreateMatchOptions
  // ) => Promise<string | undefined>;
  // joinMatch: (params: JoinMatchParams) => Promise<string>;
  // leaveMatch: (params: LeaveMatchParams) => Promise<void>;
  lobbyGames: string[];
  lobbyMatches: LobbyMatches;
  lobbyMatchesError: LobbyMatchesError;
  lobbyGamesError: string;
  createMatchError: string;
  createMatchSuccess: string;
  getMatchByIDSuccess: string;
  getMatchByIDError: string;
  selectedGame: string;
  selectedMatch: LobbyAPI.Match;
  joinedMatch: LobbyAPI.Match;
  storedCredentials: StoredCredentials;
  //handlers
  handleSelectGameChange: (e) => void;
  handleSelectMatch: (match: LobbyAPI.Match) => Promise<void>;
  handleCreateMatchButton: () => Promise<void>;
  handleJoinSelectedMatch: (options: JoinMatchOptions) => Promise<void>;
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
  const localStorageKey_bgioCredentials = "bgio-player-credentials";
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

  const [storedCredentials, setStoredCredentials] = useLocalStorage(
    localStorageKey_bgioCredentials,
    {
      matchID: "",
      playerCredentials: "",
      playerID: "",
      playerName: "",
    }
  );
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<
    LobbyAPI.Match | undefined
  >(undefined);
  const [joinedMatch, setJoinedMatch] = useState<LobbyAPI.Match>(undefined);

  // effect -- initial fetch games
  useEffect(() => {
    getLobbyGames();
    // eslint reason: Only want to fetch games on mount for now.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // effect -- auto-select first game (once they're fetched)
  useEffect(() => {
    const firstAvailableGame = lobbyGames?.[0];
    if (firstAvailableGame && !selectedGame) {
      setSelectedGame(firstAvailableGame);
    }
  }, [lobbyGames, selectedGame]);

  // effect -- fetch matches on game select (including initial auto-selection)
  useEffect(() => {
    if (lobbyClient && selectedGame) {
      getLobbyMatches(selectedGame);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame]);

  // handler select game
  const handleSelectGameChange = (e) => {
    setSelectedGame(e.target.value);
  };
  // handler select match
  const handleSelectMatch = async (match: LobbyAPI.Match) => {
    // optimistic update
    setSelectedMatch(match);
    // refresh the selected match
    const refreshedMatch = await getMatch(match.gameName, match.matchID);
    // then select the refreshed match (aka update) if success ...
    if (refreshedMatch?.matchID) {
      setSelectedMatch(refreshedMatch);
    }
    // ... otherwise, selected match does not exist, so we clear and refetch matches
    // todo: we should apologize
    else {
      setSelectedMatch(undefined);
      getLobbyMatches(selectedGame);
    }
  };
  // handler createMatch
  async function handleCreateMatchButton() {
    createMatch(selectedGame, {
      setupData: defaultSetupData,
      numPlayers: MYGAME_NUMPLAYERS,
    });
  }
  // join match, then save credentials and proceed to Room
  async function handleJoinSelectedMatch(options: JoinMatchOptions) {
    const { playerID, playerName } = options;
    const matchID = selectedMatch.matchID;
    const gameName = `${selectedGame}`;
    const playerCredentials = await joinMatch({
      gameName,
      matchID,
      options,
    });
    if (playerCredentials) {
      const newCredentials = {
        matchID,
        playerCredentials,
        playerID,
        playerName,
      };
      //save
      setStoredCredentials(newCredentials);
      // refresh match info
      const joinedMatch = await getMatch(gameName, matchID);
      //double check the server has us in there
      if (joinedMatch) {
        const serverPlayer = joinedMatch.players.find(
          (playerMetadata) => playerMetadata.id.toString() === playerID
        );
        const serverPlayerName = serverPlayer?.name;
        const isConfirmedJoin = serverPlayerName === playerName;
        console.log(
          `🚀 ~ handleJoinSelectedMatch ~ isConfirmedJoin`,
          isConfirmedJoin
        );
      }
      // set joined match to new match info
      setJoinedMatch(joinedMatch);
    } else {
      console.log(`🚀 handleJoinSelectedMatch ~ FAILED TO JOIN`);
    }
  }

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
      setCreateMatchSuccess("");
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
      console.error(`🚀 ~ joinMatch ~ error`, error);
    }
  }

  async function leaveMatch(params: LeaveMatchParams) {
    const { gameName, matchID, options } = params;
    const { playerID, credentials } = options;
    try {
      const leftMatch = await lobbyClient.leaveMatch(
        gameName,
        matchID,
        options
      );
      return leftMatch;
    } catch (error) {
      console.error(`🚀 ~ leaveMatch ~ error`, error);
    }
  }

  return (
    <BgioLobbyContext.Provider
      value={{
        lobbyClient: lobbyClientRef.current,
        getLobbyGames,
        getLobbyMatches,
        // getMatch,
        // createMatch,
        // joinMatch,
        // leaveMatch,
        lobbyGames,
        lobbyGamesError,
        lobbyMatches,
        lobbyMatchesError,
        createMatchError,
        createMatchSuccess,
        getMatchByIDSuccess,
        getMatchByIDError,
        selectedGame,
        selectedMatch,
        joinedMatch,
        storedCredentials,
        handleSelectGameChange,
        handleSelectMatch,
        handleCreateMatchButton,
        handleJoinSelectedMatch,
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
