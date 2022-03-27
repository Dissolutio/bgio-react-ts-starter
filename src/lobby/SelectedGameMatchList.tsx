import { LobbyAPI, Server } from "boardgame.io";
import { uniqBy } from "lodash";

import { useAuth } from "hooks";
import { useMultiplayerLobby } from "./useMultiplayerLobby";

export function SelectedGameMatchList() {
  const { selectedGame, lobbyMatches, updateLobbyMatchesForSelectedGame } =
    useMultiplayerLobby();
  const selectedGameMatches = lobbyMatches?.[selectedGame] ?? [];
  // the BGIO server often returns duplicate matches, unsure why
  const matches = uniqBy(selectedGameMatches, "matchID");
  async function handleRefreshButton(e: React.MouseEvent) {
    updateLobbyMatchesForSelectedGame();
  }
  return (
    <>
      <button onClick={handleRefreshButton}>{`Refresh`}</button>
      <MatchesError />
      <MatchesList matches={matches} />
    </>
  );
}

const MatchesError = () => {
  const { lobbyMatchesError, selectedGame } = useMultiplayerLobby();
  const isError = lobbyMatchesError?.[selectedGame];
  if (isError) {
    return (
      <p
        style={{ color: "red" }}
      >{`Error - Unable to fetch matches for ${selectedGame} from server: ${lobbyMatchesError[selectedGame]}`}</p>
    );
  }
  return null;
};

const MatchesList = ({ matches }: { matches: LobbyAPI.Match[] }) => {
  const { lobbyMatchesError, selectedGame } = useMultiplayerLobby();
  const isError = lobbyMatchesError?.[selectedGame];
  const isMatches = matches.length > 0;
  if (isMatches) {
    return (
      <ul>
        {matches.map((match) => {
          return <MatchListItem match={match} key={match.matchID} />;
        })}
      </ul>
    );
  }
  // blank if error, 'no matches' if not
  return isError ? null : <p>No current matches!</p>;
};

export const MatchListItem = (props: { match?: LobbyAPI.Match }) => {
  if (!props.match) {
    return null;
  }
  const { matchID, createdAt, gameName, players, unlisted, updatedAt } =
    props.match;
  return (
    <details>
      <summary>Match ID: {matchID}</summary>
      <ul>
        <li>{unlisted ? "Private match" : "Public match"}</li>
        <li>Game: {gameName}</li>
        <li>Match ID: {matchID}</li>
        <li>Created at: {`${new Date(createdAt).toLocaleTimeString()}`}</li>
        <li>Last updated: {`${new Date(updatedAt).toLocaleTimeString()}`}</li>
        <li>
          PLAYERS:
          <MatchPlayersList matchID={matchID} players={players} />
        </li>
      </ul>
    </details>
  );
};

const MatchPlayersList = (props: {
  players: Server.PlayerMetadata[];
  matchID: string;
}) => {
  const { players, matchID } = props;
  const { isAuthenticated } = useAuth();
  const { handleJoinMatch, verifyMatchSuccess } = useMultiplayerLobby();
  const playersJSX = players.map((playerMetadata) => {
    const playerID = playerMetadata.id;
    const isConnected = playerMetadata?.isConnected;
    const data = playerMetadata?.data;
    const credentials = playerMetadata?.credentials;
    const playerName = playerMetadata?.name ?? "";
    // players have to join with a name, so no name means empty slot
    const isPlayer = Boolean(playerName);
    // if user isn't logged in, or is already in a game, then disable join button
    const joinIsDisabled = !isAuthenticated || Boolean(verifyMatchSuccess);
    return (
      <li key={playerID}>
        {`${playerID}: `}
        {isPlayer ? (
          <span style={{ fontWeight: "bold" }}>{playerName}</span>
        ) : (
          <button
            disabled={joinIsDisabled}
            onClick={(e) =>
              handleJoinMatch({ playerID: `${playerID}`, matchID })
            }
          >
            Join
          </button>
        )}
      </li>
    );
  });
  return <ul>{playersJSX}</ul>;
};
