import _ from "lodash";
import { MatchListMiniItem } from "./MatchListItem";

export function GameMatchList({
  gameName,
  availableMatches,
  availableMatchesError,
  fetchAvailableMatches,
  handleSelectMatch,
  handleJoinSelectedMatch,
}) {
  async function handleRefreshButton(e) {
    fetchAvailableMatches(gameName);
  }
  const matches = _.uniqBy(availableMatches?.[gameName] ?? [], "matchID");

  return (
    <section>
      <h3>{`Available Matches for ${gameName}`}</h3>
      <button onClick={handleRefreshButton}>{`Refresh`}</button>
      <MatchesError
        availableMatchesError={availableMatchesError}
        gameName={gameName}
      />
      <MatchesList
        handleJoinSelectedMatch={handleJoinSelectedMatch}
        handleSelectMatch={handleSelectMatch}
        matches={matches}
      />
    </section>
  );
}

const MatchesError = ({ availableMatchesError, gameName }) => {
  if (availableMatchesError[gameName]) {
    return (
      <>
        <p
          style={{ color: "red" }}
        >{`Error - Unable to fetch matches for ${gameName} from server: ${availableMatchesError[gameName]}`}</p>
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
