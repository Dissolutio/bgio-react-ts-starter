import React, { useState, useEffect } from "react";
import { LobbyAPI } from "boardgame.io";

import { defaultSetupData, myGameNumPlayers } from "game/game";
import { useBgioLobby, JoinMatchOptions } from "contexts";
import { CreateMatchButton } from "./CreateMatchButton";
import { GameMatchList } from "./GameMatchList";
import { GameSelect } from "./GameSelect";
import { MatchListItem } from "./MatchListItem";
import { useLocalStorage } from "hooks";

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
  const [storedPlayerCredentials, setStoredPlayerCredentials] = useLocalStorage(
    "bgio-player-credentials",
    {
      matchID: "",
      playerCredentials: "",
    }
  );
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<
    LobbyAPI.Match | undefined
  >(undefined);
  // computed state
  const numCurrentMatches = lobbyMatches?.[selectedGame]?.length ?? 0;

  // effect auto-select first game (once they're fetched)
  useEffect(() => {
    const firstAvailableGame = lobbyGames?.[0];
    if (firstAvailableGame && !selectedGame) {
      setSelectedGame(firstAvailableGame);
    }
  }, [lobbyGames, selectedGame]);

  // effect fetch matches
  // fires for currently selected game (including initial auto-selection)
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
  async function handleCreateMatchButton(e) {
    await createMatch(selectedGame, {
      setupData: defaultSetupData,
      numPlayers: myGameNumPlayers,
    });
  }
  // join match, then save credentials and proceed to Room
  async function handleJoinSelectedMatch(options: JoinMatchOptions) {
    const matchID = selectedMatch.matchID;
    const gameName = `${selectedGame}`;
    const playerCredentials = await joinMatch({
      gameName,
      matchID,
      options,
    });
    if (playerCredentials) {
      //save
      setStoredPlayerCredentials({ matchID, playerCredentials });
      console.log(
        `🚀 ~ handleJoinSelectedMatch ~ storedPlayerCredentials`,
        storedPlayerCredentials
      );
      // refresh match info
      getMatch(gameName, matchID);
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
        <>
          <GameSelect
            selectLabelText={`Choose a game`}
            lobbyGames={lobbyGames}
            selectedGame={selectedGame}
            handleSelectGameChange={handleSelectGameChange}
          />
        </>
      )}
      {/* First game will be auto-selected, so this should display if games are successfully fetched */}
      {selectedGame ? (
        <>
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
            numCurrentMatches={numCurrentMatches}
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
