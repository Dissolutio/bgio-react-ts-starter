import React, { useState } from "react";
import { LobbyClient } from "boardgame.io/client";
import {
  MyGameState,
  defaultSetupData,
  myGameNumPlayers,
} from "../../game/game";
import { CreateMatchForm } from "./CreateMatchForm";
import { GameMatchList } from "./GameMatchList";
import { GetMatchByIdForm } from "./GetMatchByIdForm";
import { GameSelect } from "./GameSelect";
import { LobbyAPI } from "boardgame.io";

interface Props {
  serverAddress: string;
}

type MyGameCreateMatchOptions = {
  setupData: MyGameState;
  numPlayers: number;
  unlisted?: boolean;
};
export type GetMatchParams = { gameName: string; matchID: string };

export const NewLobby = (props: Props) => {
  const { serverAddress } = props;
  const lobbyClientRef = React.useRef(
    new LobbyClient({ server: `${serverAddress}` })
  );

  const [availableGames, setAvailableGames] = useState([]);
  const [availableGamesError, setAvailableGamesError] = useState("");

  const [availableMatches, setAvailableMatches] = useState({});
  const [availableMatchesError, setAvailableMatchesError] = useState({});

  const [createMatchError, setCreateMatchError] = useState("");
  const [createMatchSuccess, setCreateMatchSuccess] = useState("");

  const [getMatchByIDError, setGetMatchByIDError] = useState("");

  const [selectedGame, setSelectedGame] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<
    LobbyAPI.Match | undefined
  >(undefined);
  const handleGameSelectChange = (e) => {
    setSelectedGame(e.target.value);
  };

  // initial fetch games
  React.useEffect(() => {
    const lobbyClient = lobbyClientRef.current;
    if (lobbyClient) {
      fetchAvailableGames();
    }
  }, []);

  // auto-select first game, once games are fetched
  React.useEffect(() => {
    const firstAvailableGame = availableGames?.[0];
    if (firstAvailableGame && !selectedGame) {
      setSelectedGame(firstAvailableGame);
    }
  }, [availableGames, selectedGame]);

  // if selected game changes, fetch matches for that game, and clear selected match if it's not of the selected game
  React.useEffect(() => {
    const lobbyClient = lobbyClientRef.current;
    if (lobbyClient && selectedGame) {
      fetchAvailableMatches(selectedGame);
    }
    const selectedMatchGameName = selectedMatch?.gameName ?? "";
    if (selectedMatchGameName !== selectedGame) {
      setSelectedMatch(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame]);

  //! GET all games
  async function fetchAvailableGames() {
    const lobbyClient = lobbyClientRef.current;
    try {
      const games = await lobbyClient.listGames();
      if (games) {
        setAvailableGamesError("");
        setAvailableGames(games);
      }
    } catch (error) {
      setAvailableGamesError(error.message);
    }
  }

  //! GET matches for game
  async function fetchAvailableMatches(gameName: string) {
    const lobbyClient = lobbyClientRef.current;
    try {
      const matches = await lobbyClient.listMatches(gameName);
      if (matches) {
        setAvailableMatchesError((s) => ({
          ...s,
          [gameName]: undefined,
        }));
        setAvailableMatches((s) => ({ ...s, [gameName]: matches.matches }));
      }
    } catch (error) {
      setAvailableMatchesError((s) => ({ ...s, [gameName]: error.message }));
    }
  }
  const handleCreateMatchSubmit: React.FormEventHandler = (e) => {
    e.preventDefault();
    createMatch(selectedGame, {
      setupData: defaultSetupData,
      numPlayers: myGameNumPlayers,
    });
  };

  //! POST create match for game
  async function createMatch(
    gameName: string,
    createGameOptions: MyGameCreateMatchOptions
  ) {
    const { numPlayers, setupData, unlisted = false } = createGameOptions;
    const lobbyClient = lobbyClientRef.current;
    try {
      const response = await lobbyClient.createMatch(`${gameName}`, {
        numPlayers,
        setupData,
        unlisted,
      });
      const newMatchID = response?.matchID;
      if (newMatchID) {
        fetchAvailableMatches(gameName);
        setCreateMatchError("");
        setCreateMatchSuccess(`${newMatchID}`);
      }
    } catch (error) {
      setCreateMatchSuccess("");
      setCreateMatchError(error.message);
    }
  }

  //! GET Match by ID
  async function getMatchData(gameName: string, matchID: string) {
    const lobbyClient = lobbyClientRef.current;
    try {
      //! Note that if matchID matches an available match but the gameName is not the same, our server STILL sends back the match
      const response = await lobbyClient.getMatch(gameName, matchID);
      if (response) {
        setGetMatchByIDError("");
        return response;
      }
    } catch (error) {
      setGetMatchByIDError(error.message);
    }
  }
  async function getMatchDataByIDForSelectedGame(matchID: string) {
    const matchData = await getMatchData(selectedGame, matchID);
    if (matchData) {
      setSelectedMatch(matchData);
    }
  }

  //! POST Join a Match
  type JoinMatchOptions = {
    playerID: string;
    playerName: string;
    data?: any;
  };
  async function joinMatch(
    gameName: string,
    matchID: string,
    options: JoinMatchOptions
  ) {
    const { playerID, playerName, data } = options;
    const lobbyClient = lobbyClientRef.current;
    try {
      const response = await lobbyClient.joinMatch(gameName, matchID, options);
      const playerCredentials = response.playerCredentials;
      if (playerCredentials) {
        return playerCredentials;
      }
    } catch (error) {
      console.log(`🚀 ~ error`, error);
    }
  }
  async function joinMatchForCurrentlySelectedGameAndMatch(
    options: JoinMatchOptions
  ) {
    const playerCredentials = await joinMatch(
      selectedGame,
      selectedMatch.matchID,
      options
    );
    console.log(`🚀 ~ playerCredentials`, playerCredentials);
  }
  //!! finally - NEW LOBBY RETURN
  return (
    <>
      {false ? (
        <p
          style={{ color: "red" }}
        >{`Error -- Could not retrieve list of games : ${availableGamesError}`}</p>
      ) : (
        <h3>
          Available games:{" "}
          <GameSelect
            availableGames={availableGames}
            selectedGame={selectedGame}
            handleGameSelectChange={handleGameSelectChange}
          />
        </h3>
      )}
      {selectedGame ? (
        <>
          <GameMatchList
            gameName={selectedGame}
            availableMatches={availableMatches}
            availableMatchesError={availableMatchesError}
            fetchAvailableGames={fetchAvailableGames}
          />
          <CreateMatchForm
            availableGames={availableGames}
            createMatchSuccess={createMatchSuccess}
            createMatchError={createMatchError}
            selectedGame={selectedGame}
            handleGameSelectChange={handleGameSelectChange}
            handleCreateMatchSubmit={handleCreateMatchSubmit}
          />
          <GetMatchByIdForm
            getMatchByIDError={getMatchByIDError}
            getMatchDataByIDForSelectedGame={getMatchDataByIDForSelectedGame}
            selectedMatch={selectedMatch}
          />
        </>
      ) : null}
    </>
  );
};
