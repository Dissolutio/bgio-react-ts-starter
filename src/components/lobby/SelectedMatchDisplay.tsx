import { useBgioLobby } from "contexts";
import { useAuth } from "hooks";
import { MatchPlayerMetadata } from "./types";

export const SelectedMatchDisplay = () => {
  const { selectedMatch } = useBgioLobby();
  if (!selectedMatch) {
    return null;
  }
  const {
    matchID,
    createdAt,
    gameName,
    players,
    unlisted,
    updatedAt,
  } = selectedMatch;
  return (
    <ul>
      <li>{unlisted ? "Private match" : "Public match"}</li>
      <li>Game: {gameName}</li>
      <li>Match ID: {matchID}</li>
      <li>Created at: {`${new Date(createdAt).toLocaleTimeString()}`}</li>
      <li>Last updated: {`${new Date(updatedAt).toLocaleTimeString()}`}</li>
      <li>
        PLAYERS:
        <MatchPlayersList players={players} />
      </li>
    </ul>
  );
};
const MatchPlayersList = (props: { players: MatchPlayerMetadata[] }) => {
  const { players } = props;
  const { user, isAuthenticated } = useAuth();
  const { handleJoinSelectedMatch } = useBgioLobby();
  const playersJSX = players.map((playerMetadata) => {
    const playerID = playerMetadata.id;
    const isConnected = playerMetadata?.isConnected;
    const data = playerMetadata?.data;
    const credentials = playerMetadata?.credentials;
    const playerName = playerMetadata?.name ?? "";
    // players have to join with a name, so no name means empty slot
    const isPlayer = Boolean(playerName);
    return (
      <li key={playerID}>
        {`${playerID}: `}
        {isPlayer ? (
          <span style={{ fontWeight: "bold" }}>playerName</span>
        ) : (
          <button
            disabled={!isAuthenticated}
            onClick={(e) =>
              handleJoinSelectedMatch({ playerID: `${playerID}`, playerName })
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
