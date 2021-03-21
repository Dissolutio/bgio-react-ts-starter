import React, { useState } from "react";
import { LobbyAPI } from "boardgame.io";

import { defaultSetupData, myGameNumPlayers } from "game/game";
import { useBgioLobby, JoinMatchOptions } from "contexts";
import { CreateMatchButton } from "./CreateMatchButton";
import { GameMatchList } from "./GameMatchList";
import { GetMatchByIdForm } from "./GetMatchByIdForm";
import { GameSelect } from "./GameSelect";
import { MatchListItem } from "./MatchListItem";

export const NewLobby = () => {
  const {
    lobbyClient,
    // BGIO Lobby API Calls
    getLobbyGames,
    getLobbyMatches,
    getMatch,
    createMatch,
    joinMatch,
    //state
    lobbyGames,
    lobbyGamesError,
    lobbyMatches,
    lobbyMatchesError,
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
      getLobbyMatches(selectedGame);
    }
  };

  // auto-select first game, once games are fetched
  React.useEffect(() => {
    const firstAvailableGame = lobbyGames?.[0];
    if (firstAvailableGame && !selectedGame) {
      setSelectedGame(firstAvailableGame);
    }
  }, [lobbyGames, selectedGame]);

  // fetch matches for game when new game selected
  React.useEffect(() => {
    if (lobbyClient && selectedGame) {
      getLobbyMatches(selectedGame);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame]);

  async function handleCreateMatchButton(e) {
    await createMatch(selectedGame, {
      setupData: defaultSetupData,
      numPlayers: myGameNumPlayers,
    });
  }
  // this handler used within `handleSelectMatch` ^^, and `handleSubmit` in child component GetMatchByIdForm
  async function getMatchDataByIDForSelectedGame(matchID: string) {
    const matchData = await getMatch(selectedGame, matchID);
    if (matchData) {
      setSelectedMatch(matchData);
      return matchData;
    }
  }
  // join match, then save credentials and proceed to Room
  async function handleJoinSelectedMatch(options: JoinMatchOptions) {
    const playerCredentials = await joinMatch({
      gameName: selectedGame,
      matchID: selectedMatch.matchID,
      options,
    });
    if (playerCredentials) {
      // refresh match info
      // set joined match to new match info
    } else {
      console.log(`🚀 handleJoinSelectedMatch ~ FAILED TO JOIN`);
    }
  }

  // return error or game select + rest
  return (
    <>
      {lobbyGamesError ? (
        <p style={{ color: "red" }}>
          {`Error -- Could not retrieve games from server : ${lobbyGamesError}`}
          <button onClick={getLobbyGames}>Retry</button>
        </p>
      ) : (
        <GameSelect
          selectLabelText={`Choose a game`}
          lobbyGames={lobbyGames}
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
          <SelectedMatchDisplay
            selectedMatch={selectedMatch}
            handleJoinSelectedMatch={handleJoinSelectedMatch}
          />
          <CreateMatchButton
            createMatchSuccess={createMatchSuccess}
            createMatchError={createMatchError}
            handleCreateMatchButton={handleCreateMatchButton}
          />
          <GameMatchList
            gameName={selectedGame}
            lobbyMatches={lobbyMatches}
            lobbyMatchesError={lobbyMatchesError}
            getLobbyMatches={getLobbyMatches}
            handleSelectMatch={handleSelectMatch}
            handleJoinSelectedMatch={handleJoinSelectedMatch}
          />
        </>
      ) : null}
    </>
  );
};

const SelectedMatchDisplay = ({ selectedMatch, handleJoinSelectedMatch }) => {
  if (!selectedMatch) {
    return null;
  }
  return (
    <ul>
      <MatchListItem
        handleJoinSelectedMatch={handleJoinSelectedMatch}
        match={selectedMatch}
      />
    </ul>
  );
};
