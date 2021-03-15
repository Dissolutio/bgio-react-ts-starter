import _ from "lodash";

export function GameMatchList({
  gameName,
  availableMatches,
  availableMatchesError,
  fetchAvailableGames,
}) {
  return (
    <section>
      <h3>{`Available Matches for ${gameName}`}</h3>
      <button onClick={() => fetchAvailableGames(gameName)}>
        {`Refresh ${gameName} matches`}
      </button>
      <MatchesError
        availableMatchesError={availableMatchesError}
        gameName={gameName}
      />
      <MatchesList availableMatches={availableMatches} gameName={gameName} />
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
const MatchesList = ({ availableMatches, gameName }) => {
  const list = _.uniqBy(availableMatches?.[gameName] ?? [], "matchID");
  if (list.length) {
    return (
      <>
        <ul>
          {list.map((match) => {
            const {
              matchID, // createdAt, gameName, players, unlisted, updatedAt,
            } = match;
            return <li key={matchID}>{matchID}</li>;
          })}
        </ul>
      </>
    );
  }
  return null;
};
