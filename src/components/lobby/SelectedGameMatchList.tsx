import { useBgioLobby } from "contexts";
import _ from "lodash";
import { LobbyAPI } from "boardgame.io";

export function SelectedGameMatchList() {
  const { selectedGame, lobbyMatches, getLobbyMatches } = useBgioLobby();
  async function handleRefreshButton(e) {
    getLobbyMatches(selectedGame);
  }
  const selectedGameMatches = lobbyMatches?.[selectedGame] ?? [];
  // the BGIO server often returns duplicate matches, unsure why
  const matches = _.uniqBy(selectedGameMatches, "matchID");
  const numCurrentMatches = selectedGameMatches?.length ?? 0;
  return (
    <section>
      <h3>{`${selectedGame} matches (${numCurrentMatches})`}</h3>
      <button onClick={handleRefreshButton}>{`Refresh`}</button>
      <MatchesError />
      <MatchesList matches={matches} />
    </section>
  );
}
const MatchesError = () => {
  const { lobbyMatchesError, selectedGame } = useBgioLobby();
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
const MatchesList = ({ matches }) => {
  const { lobbyMatchesError, selectedGame } = useBgioLobby();
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
const MatchListItem = (props: { match: LobbyAPI.Match }) => {
  const { handleSelectMatch } = useBgioLobby();
  const { match } = props;
  const { matchID } = match;
  return <li onClick={() => handleSelectMatch(match)}>Match ID: {matchID}</li>;
};
