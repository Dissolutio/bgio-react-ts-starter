import { Link } from "react-router-dom";

import { useAuth } from "hooks";
import { useMultiplayerLobby } from "./useMultiplayerLobby";
import { CreateMatchButton } from "./CreateMatchButton";
import { SelectedGameMatchList, MatchListItem } from "./SelectedGameMatchList";
import { GameSelect } from "./GameSelect";
import { Login } from "./Login";

export const MultiplayerLobby = () => {
  const {
    lobbyMatches,
    selectedGame,
    lobbyGamesError,
    verifyMatchSuccess,
    verifyMatchError,
    updateLobbyGames,
    handleLeaveJoinedMatch,
    handleVerifyJoinedMatch,
  } = useMultiplayerLobby();
  const { storedCredentials, isAuthenticated } = useAuth();
  const joinedMatchID = storedCredentials?.matchID;
  const selectedGameMatches = lobbyMatches?.[selectedGame] ?? [];
  const numCurrentMatches = selectedGameMatches?.length ?? 0;
  const joinedMatch = lobbyMatches?.[selectedGame]?.find(
    (m) => m.matchID === joinedMatchID
  );
  // NAME REQUIRED FROM USER FIRST
  if (!isAuthenticated) {
    return (
      <>
        <p>Please choose a username in order to play multiplayer</p>
        <Login />
      </>
    );
  }
  return (
    <>
      <details>
        <summary>{`Account: ${storedCredentials.playerName}`}</summary>
        <Login />
      </details>
      <hr></hr>
      {/* Either we errored, or we connected to server and received games list */}
      {lobbyGamesError ? (
        <p style={{ color: "red" }}>
          {`Error -- Could not retrieve games from server : ${lobbyGamesError}`}
          <button onClick={updateLobbyGames}>Retry Connecting to Server</button>
        </p>
      ) : (
        <>
          <details>
            <summary>{`Switch games (current: ${selectedGame})`}</summary>
            <GameSelect />
          </details>
        </>
      )}
      <hr></hr>

      {/* If no games/connection, don't show anything below */}
      {selectedGame && (
        <>
          {/* Joined match NOT verified, show error / retry OR leave game */}
          {verifyMatchError && (
            <>
              <p>
                Error -- the match you were in could not be verified:{" "}
                {`${verifyMatchError}`}
              </p>
              <p>
                <button onClick={handleVerifyJoinedMatch}>Retry!</button>
              </p>
              <p>
                <button onClick={handleLeaveJoinedMatch}>
                  Leave that match, there are other matters to tend to...
                </button>
              </p>
            </>
          )}

          {/* If in a match, show play/leave buttons , otherwise show match list and create/refresh buttons */}
          {verifyMatchSuccess && joinedMatchID ? (
            <>
              <p>You are joined in a match:</p>
              <MatchListItem match={joinedMatch} />
              <p>
                <button>
                  <Link to="/play">GO TO YOUR MATCH</Link>
                </button>
              </p>
              <div>
                <button onClick={handleLeaveJoinedMatch}>
                  Leave Joined Game
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>{`Matches for ${selectedGame} (total: ${numCurrentMatches})`}</h2>
              <CreateMatchButton />
              <SelectedGameMatchList />
            </>
          )}
        </>
      )}
    </>
  );
};
