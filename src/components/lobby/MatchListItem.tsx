import { LobbyAPI } from "boardgame.io";
import { MatchPlayerMetadata } from "./types";
import { JoinMatchHandler } from "contexts";

export const MatchListMiniItem = (props: {
  match: LobbyAPI.Match;
  handleSelectMatch: (match: LobbyAPI.Match) => void;
  handleJoinSelectedMatch: JoinMatchHandler;
}) => {
  const { match, handleSelectMatch } = props;
  const { matchID } = match;
  return <li onClick={() => handleSelectMatch(match)}>Match ID: {matchID}</li>;
};

export const MatchListItem = (props: {
  match: LobbyAPI.Match;
  handleJoinSelectedMatch: JoinMatchHandler;
}) => {
  const { match, handleJoinSelectedMatch } = props;
  const { matchID, createdAt, gameName, players, unlisted, updatedAt } = match;
  return (
    <>
      <li>{unlisted ? "Private match" : "Public match"}</li>
      <li>Game: {gameName}</li>
      <li>Match ID: {matchID}</li>
      <li>Created at: {`${new Date(createdAt).toLocaleTimeString()}`}</li>
      <li>Last updated: {`${new Date(updatedAt).toLocaleTimeString()}`}</li>
      <li>
        PLAYERS:
        <MatchPlayerDataDisplay
          handleJoinSelectedMatch={handleJoinSelectedMatch}
          players={players}
        />
      </li>
    </>
  );
};

const MatchPlayerDataDisplay = (props: {
  players: MatchPlayerMetadata[];
  handleJoinSelectedMatch: JoinMatchHandler;
}) => {
  const { players, handleJoinSelectedMatch } = props;
  // Displays like this:
  // 0: "ZebraGamer"
  // Or lik this:
  // 1: <JoinButton/>
  const playersJSX = players.map((playerSlot) => {
    const playerID = playerSlot.id;
    const playerName = playerSlot?.name ?? "Bubba";
    return (
      <li key={playerID}>
        {`${playerID}: `}
        {playerSlot?.name ? (
          `"${playerName}"`
        ) : (
          <button
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
