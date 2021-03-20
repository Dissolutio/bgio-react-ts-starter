import _ from "lodash";
import { MatchListMiniItem } from "./MatchListItem";

export function GameMatchList({
  gameName,
  lobbyMatches,
  lobbyMatchesError,
  getLobbyMatches,
  handleSelectMatch,
  handleJoinSelectedMatch,
}) {
  async function handleRefreshButton(e) {
    getLobbyMatches(gameName);
  }
  const matches = _.uniqBy(lobbyMatches?.[gameName] ?? [], "matchID");

  return (
    <section>
      <h3>{`Available Matches for ${gameName}`}</h3>
      <button onClick={handleRefreshButton}>{`Refresh`}</button>
      <MatchesError lobbyMatchesError={lobbyMatchesError} gameName={gameName} />
      <MatchesList
        handleJoinSelectedMatch={handleJoinSelectedMatch}
        handleSelectMatch={handleSelectMatch}
        matches={matches}
      />
    </section>
  );
}

const MatchesError = ({ lobbyMatchesError, gameName }) => {
  if (lobbyMatchesError[gameName]) {
    return (
      <>
        <p
          style={{ color: "red" }}
        >{`Error - Unable to fetch matches for ${gameName} from server: ${lobbyMatchesError[gameName]}`}</p>
      </>
    );
  }
  return null;
};
const MatchesList = ({
  matches,
  handleSelectMatch,
  handleJoinSelectedMatch,
}) => {
  if (matches.length) {
    return (
      <>
        <ul>
          {matches.map((match) => {
            return (
              <MatchListMiniItem
                handleSelectMatch={handleSelectMatch}
                handleJoinSelectedMatch={handleJoinSelectedMatch}
                match={match}
                key={match.matchID}
              />
            );
          })}
        </ul>
      </>
    );
  }
  return null;
};
