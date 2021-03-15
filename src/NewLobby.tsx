import React from "react";
import _ from "lodash";
import { LobbyClient } from "boardgame.io/client";
import { MyGameState } from "./game/game";
interface Props {
  serverAddress: string;
}

type MyGameCreateGameOptions = {
  setupData: MyGameState;
  numPlayers: number;
  unlisted?: boolean;
};

export const NewLobby = (props: Props) => {
  const { serverAddress } = props;
  const [availableGames, setAvailableGames] = React.useState([]);
  const [availableGamesError, setAvailableGamesError] = React.useState("");
  const [availableMatches, setAvailableMatches] = React.useState({});
  const [availableMatchesError, setAvailableMatchesError] = React.useState({});
  const [createMatchError, setCreateMatchError] = React.useState("");
  const [createMatchSuccess, setCreateMatchSuccess] = React.useState("");
  const lobbyClientRef = React.useRef(
    new LobbyClient({ server: `${serverAddress}` })
  );
  // API CALLS
  // GET matches
  // GET games
  async function fetchAvailableGames() {
    const lobbyClient = lobbyClientRef.current;
    try {
      const games = await lobbyClient.listGames();
      if (games) {
        setAvailableGamesError("");
        setAvailableGames(games);
      }
    } catch (error) {
      setAvailableGamesError(error.message);
    }
  }
  // GET matches
  async function fetchAvailableMatches(gameName: string) {
    const lobbyClient = lobbyClientRef.current;
    try {
      const matches = await lobbyClient.listMatches(gameName);
      if (matches) {
        setAvailableMatchesError((s) => ({
          ...s,
          [gameName]: undefined,
        }));
        setAvailableMatches((s) => ({ ...s, [gameName]: matches.matches }));
      }
    } catch (error) {
      setAvailableMatchesError((s) => ({ ...s, [gameName]: error.message }));
    }
  }
  // POST create match
  async function createMatch(
    gameName: string,
    createGameOptions: MyGameCreateGameOptions
  ) {
    const { numPlayers, setupData, unlisted = false } = createGameOptions;
    const lobbyClient = lobbyClientRef.current;
    try {
      const response = await lobbyClient.createMatch(`${gameName}`, {
        numPlayers,
        setupData,
        unlisted,
      });
      const newMatchID = response?.matchID;
      if (newMatchID) {
        fetchAvailableMatches(gameName);
        setCreateMatchError("");
        setCreateMatchSuccess(`${newMatchID}`);
      }
    } catch (error) {
      setCreateMatchSuccess("");
      setCreateMatchError(error.message);
    }
  }

  // TODO
  // Get Match by ID
  // Join a Match
  // Update Player Metadata
  // Leave a Match
  // Play Again

  // ON MOUNT - fetch games
  React.useEffect(() => {
    const lobbyClient = lobbyClientRef.current;
    if (lobbyClient) {
      fetchAvailableGames();
    }
  }, []);
  // if games change, fetch matches for those games
  React.useEffect(() => {
    const lobbyClient = lobbyClientRef.current;
    if (lobbyClient) {
      if (availableGames.length > 0) {
        availableGames.forEach((gameName) => fetchAvailableMatches(gameName));
      }
    }
  }, [availableGames]);

  return (
    <div>
      <GamesList
        availableGames={availableGames}
        availableGamesError={availableGamesError}
        fetchAvailableGames={fetchAvailableGames}
      />
      <MatchesList
        availableGames={availableGames}
        availableMatches={availableMatches}
        availableMatchesError={availableMatchesError}
        fetchAvailableGames={fetchAvailableGames}
      />
      <CreateMatchForm
        createMatch={createMatch}
        availableGames={availableGames}
        createMatchSuccess={createMatchSuccess}
        createMatchError={createMatchError}
      />
    </div>
  );
};

function CreateMatchForm({
  createMatch,
  availableGames,
  createMatchSuccess,
  createMatchError,
}) {
  const [gameSelect, setGameSelect] = React.useState(
    availableGames?.[0] ?? undefined
  );
  const firstAvailableGame = availableGames?.[0];

  // EFFECT: auto-select first game, once games are fetched
  React.useEffect(() => {
    if (firstAvailableGame && !gameSelect) {
      setGameSelect(firstAvailableGame);
    }
  }, [availableGames, firstAvailableGame, gameSelect]);

  const handleGameSelectChange = (e) => {
    setGameSelect(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMatch(gameSelect, {
      setupData: { score: { "0": 0, "1": 7 } },
      numPlayers: 2,
    });
  };
  const createMatchGameSelectHtmlID = `create-match-game-select`;

  return (
    <form onSubmit={handleSubmit}>
      <h5>Create a New Match</h5>
      <label htmlFor={createMatchGameSelectHtmlID}>
        Choose game:
        <select
          onChange={handleGameSelectChange}
          value={gameSelect}
          id={createMatchGameSelectHtmlID}
        >
          {availableGames.map((gameName) => (
            <option key={gameName} value={gameName}>
              {gameName}
            </option>
          ))}
        </select>
      </label>
      <div>
        <button type="submit">CREATE GAME</button>
        {createMatchError && (
          <p style={{ color: "red" }}>
            Error - Failed to create game: {`${createMatchError}`}
          </p>
        )}
        {createMatchSuccess && (
          <p style={{ color: "green" }}>
            Created Match with ID: {`${createMatchSuccess}`}
          </p>
        )}
      </div>
    </form>
  );
}

function MatchesList({
  availableGames,
  availableMatches,
  availableMatchesError,
  fetchAvailableGames,
}) {
  if (availableGames.length > 0) {
    return availableGames.map((gameName) => (
      <section key={gameName}>
        <h3>{`Available Matches for ${gameName}`}</h3>
        {availableMatchesError[gameName] ? (
          <>
            <h4>Error</h4>
            <p>{`Unable to fetch matches for ${gameName} from server: ${availableMatchesError[gameName]}`}</p>
            <button onClick={() => fetchAvailableGames(gameName)}>RETRY</button>
          </>
        ) : (
          <>
            <button onClick={() => fetchAvailableGames(gameName)}>
              {`Refresh ${gameName} matches`}
            </button>
            <ul>
              {_.uniqBy(availableMatches?.[gameName] ?? [], "matchID").map(
                (match) => {
                  const {
                    createdAt,
                    gameName,
                    matchID,
                    players,
                    unlisted,
                    updatedAt,
                  } = match;
                  return <li key={matchID}>{matchID}</li>;
                }
              )}
            </ul>
          </>
        )}
      </section>
    ));
  }
  return null;
}

function GamesList({
  availableGames,
  availableGamesError,
  fetchAvailableGames,
}) {
  return (
    <>
      <h3>Available Games:</h3>
      {availableGamesError ? (
        <>
          <h4>Error</h4>
          <p>Unable to fetch games from server: {availableGamesError}</p>
          <button onClick={fetchAvailableGames}>RETRY</button>
        </>
      ) : (
        <ul>
          {availableGames.map((gameName) => (
            <li key={gameName}>{gameName}</li>
          ))}
        </ul>
      )}
    </>
  );
}
