import React, { useState } from "react";
import _ from "lodash";
import { LobbyClient } from "boardgame.io/client";
import { LobbyAPI } from "boardgame.io";

import { defaultSetupData, myGameNumPlayers } from "game/game";
import {
  MyGameCreateMatchOptions,
  JoinMatchOptions,
  JoinMatchParams,
} from "./types";
import { CreateMatchButton } from "./CreateMatchButton";
import { GameMatchList } from "./GameMatchList";
import { GetMatchByIdForm } from "./GetMatchByIdForm";
import { GameSelect } from "./GameSelect";
import { MatchListItem } from "./MatchListItem";

interface Props {
  serverAddress: string;
}
export const NewLobby = (props: Props) => {
  const { serverAddress } = props;
  const lobbyClientRef = React.useRef(
    new LobbyClient({ server: `${serverAddress}` })
  );

  const [availableGames, setAvailableGames] = useState<string[]>([]);
  const [availableGamesError, setAvailableGamesError] = useState("");

  const [availableMatches, setAvailableMatches] = useState<{
    [gameName: string]: LobbyAPI.Match[];
  }>({});
  const [availableMatchesError, setAvailableMatchesError] = useState<{
    [gameName: string]: string;
  }>({});

  const [createMatchError, setCreateMatchError] = useState("");
  const [createMatchSuccess, setCreateMatchSuccess] = useState("");

  const [getMatchByIDError, setGetMatchByIDError] = useState("");

  const [selectedGame, setSelectedGame] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<
    LobbyAPI.Match | undefined
  >(undefined);
  const handleSelectGameChange = (e) => {
    setSelectedGame(e.target.value);
  };
  const handleSelectMatch = (match: LobbyAPI.Match) => {
    setSelectedMatch(match);
    getMatchDataByIDForSelectedGame(match.matchID);
  };

  // ! EFFECTS
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
  // if selected game changes, fetch matches for that game, and clear selected match if it's not of the selected game, clear error states
  React.useEffect(() => {
    const lobbyClient = lobbyClientRef.current;
    if (lobbyClient && selectedGame) {
      fetchAvailableMatches(selectedGame);
    }
    const selectedMatchGameName = selectedMatch?.gameName ?? "";
    if (selectedMatchGameName !== selectedGame) {
      setSelectedMatch(undefined);
    }
    setAvailableGamesError("");
    setCreateMatchError("");
    setCreateMatchSuccess("");
    // below: do not want to run this hook when selected match changes, only selected game
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame]);

  //! BGIO LobbyClient API and handlers
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

  //! POST create match for game
  async function createMatch(
    gameName: string,
    createGameOptions: MyGameCreateMatchOptions
  ) {
    const { numPlayers, setupData, unlisted = false } = createGameOptions;
    const lobbyClient = lobbyClientRef.current;
    try {
      const { matchID } = await lobbyClient.createMatch(`${gameName}`, {
        numPlayers,
        setupData,
        unlisted,
      });
      if (matchID) {
        fetchAvailableMatches(gameName);
        getMatchDataByIDForSelectedGame(matchID);
        setCreateMatchError("");
      }
    } catch (error) {
      setCreateMatchError(error.message);
    }
  }
  const handleCreateMatchButton = async (e) => {
    createMatch(selectedGame, {
      setupData: defaultSetupData,
      numPlayers: myGameNumPlayers,
    });
  };

  //! GET Match by ID
  async function fetchMatch(gameName: string, matchID: string) {
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
    const matchData = await fetchMatch(selectedGame, matchID);
    if (matchData) {
      setSelectedMatch(matchData);
    }
  }

  //! POST Join a Match
  async function joinMatch(params: JoinMatchParams) {
    const { gameName, matchID, options } = params;
    const lobbyClient = lobbyClientRef.current;
    try {
      const response = await lobbyClient.joinMatch(gameName, matchID, options);
      const playerCredentials = response.playerCredentials;
      if (playerCredentials) {
        return playerCredentials;
      }
    } catch (error) {
      console.log(`async joinMatch error`, error);
    }
  }
  async function handleJoinSelectedMatch(options: JoinMatchOptions) {
    const playerCredentials = await joinMatch({
      gameName: selectedGame,
      matchID: selectedMatch.matchID,
      options,
    });
    console.log(`🚀 JOINED ~ playerCredentials`, playerCredentials);
  }

  //!! finally - NEW LOBBY RETURN
  return (
    <>
      {availableGamesError ? (
        <p style={{ color: "red" }}>
          {`Error -- Could not retrieve games from server : ${availableGamesError}`}
          <button onClick={fetchAvailableGames}>Retry</button>
        </p>
      ) : (
        <GameSelect
          selectLabelText={`Choose a game`}
          availableGames={availableGames}
          selectedGame={selectedGame}
          handleSelectGameChange={handleSelectGameChange}
        />
      )}
      {/* First game will be auto-selected, so this should display if games are successfully fetched */}
      {selectedGame ? (
        <>
          <GetMatchByIdForm
            getMatchByIDError={getMatchByIDError}
            getMatchDataByIDForSelectedGame={getMatchDataByIDForSelectedGame}
          />
          {selectedMatch && (
            <ul>
              <MatchListItem
                handleJoinSelectedMatch={handleJoinSelectedMatch}
                match={selectedMatch}
              />
            </ul>
          )}
          <CreateMatchButton
            createMatchSuccess={createMatchSuccess}
            createMatchError={createMatchError}
            handleCreateMatchButton={handleCreateMatchButton}
          />
          <GameMatchList
            gameName={selectedGame}
            availableMatches={availableMatches}
            availableMatchesError={availableMatchesError}
            fetchAvailableMatches={fetchAvailableMatches}
            handleSelectMatch={handleSelectMatch}
            handleJoinSelectedMatch={handleJoinSelectedMatch}
          />
        </>
      ) : null}
    </>
  );
};
