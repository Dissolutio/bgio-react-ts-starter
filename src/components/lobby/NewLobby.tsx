import React, { useState } from "react";
import { LobbyAPI } from "boardgame.io";

import { defaultSetupData, myGameNumPlayers } from "game/game";
import { JoinMatchOptions } from "./types";
import { useBgioLobby } from "contexts";
import { CreateMatchButton } from "./CreateMatchButton";
import { GameMatchList } from "./GameMatchList";
import { GetMatchByIdForm } from "./GetMatchByIdForm";
import { GameSelect } from "./GameSelect";
import { MatchListItem } from "./MatchListItem";

export const NewLobby = () => {
  const {
    lobbyClient,
    // BGIO Lobby API Calls
    fetchAvailableGames,
    fetchAvailableMatches,
    getMatch,
    createMatch,
    joinMatch,
    //state
    availableGames,
    availableGamesError,
    availableMatches,
    availableMatchesError,
    createMatchSuccess,
    createMatchError,
    getMatchByIDError,
  } = useBgioLobby();

  const [selectedGame, setSelectedGame] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<
    LobbyAPI.Match | undefined
  >(undefined);
  const handleSelectGameChange = (e) => {
    setSelectedGame(e.target.value);
  };
  const handleSelectMatch = async (match: LobbyAPI.Match) => {
    // optimistic update
    setSelectedMatch(match);
    // refresh, update if success, clear and refetch matches if not
    const refreshedMatch = await getMatchDataByIDForSelectedGame(match.matchID);
    if (refreshedMatch?.matchID) {
      setSelectedMatch(refreshedMatch);
    } else {
      setSelectedMatch(undefined);
      fetchAvailableMatches(selectedGame);
    }
  };

  // ! EFFECTS
  // Effect: auto-select first game, once games are fetched
  React.useEffect(() => {
    const firstAvailableGame = availableGames?.[0];
    if (firstAvailableGame && !selectedGame) {
      setSelectedGame(firstAvailableGame);
    }
  }, [availableGames, selectedGame]);

  // Effect: fetch matches for game when new game selected
  React.useEffect(() => {
    if (lobbyClient && selectedGame) {
      fetchAvailableMatches(selectedGame);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame]);

  async function handleCreateMatchButton(e) {
    await createMatch(selectedGame, {
      setupData: defaultSetupData,
      numPlayers: myGameNumPlayers,
    });
  }
  // this handler used within `handleSelectMatch` ^^, and `handleSubmit` fn in child component GetMatchByIdForm
  async function getMatchDataByIDForSelectedGame(matchID: string) {
    const matchData = await getMatch(selectedGame, matchID);
    if (matchData) {
      setSelectedMatch(matchData);
      return matchData;
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
