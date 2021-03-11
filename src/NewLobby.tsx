import React from "react";
import { LobbyClient } from "boardgame.io/client";

// const lobbyClient = new LobbyClient({ server: "http://localhost:8000" });

// lobbyClient
//   .listGames()
//   .then(console.log) // => ['chess', 'tic-tac-toe']
//   .catch(console.error);

interface Props {
  serverAddress: string;
}

export const NewLobby = (props: Props) => {
  const { serverAddress } = props;
  const [availableGames, setAvailableGames] = React.useState([]);
  const [availableGamesError, setAvailableGamesError] = React.useState(
    undefined
  );
  const [availableMatches, setAvailableMatches] = React.useState({});
  const [availableMatchesError, setAvailableMatchesError] = React.useState({});
  const lobbyClientRef = React.useRef(
    new LobbyClient({ server: `${serverAddress}` })
  );
  const fireFetchAvailableGames = () => {
    fetchAvailableGames();
  };
  const fireFetchAvailableMatches = (gameName: string) => {
    fetchAvailableMatches(gameName);
  };
  async function fetchAvailableGames() {
    const lobbyClient = lobbyClientRef.current;
    try {
      const games = await lobbyClient.listGames();
      if (games) {
        setAvailableGamesError(undefined);
        setAvailableGames(games);
      }
    } catch (error) {
      setAvailableGamesError(error.message);
    }
  }
  async function fetchAvailableMatches(gameName: string) {
    const lobbyClient = lobbyClientRef.current;
    try {
      const matches = await lobbyClient.listMatches(gameName);
      if (matches) {
        setAvailableMatchesError((s) => ({
          ...s,
          [gameName]: undefined,
        }));
        setAvailableMatches((s) => ({ ...s, [gameName]: matches }));
      }
    } catch (error) {
      setAvailableMatchesError((s) => ({ ...s, [gameName]: error.message }));
    }
  }
  // FETCH GAMES
  React.useEffect(() => {
    const lobbyClient = lobbyClientRef.current;
    if (lobbyClient) {
      fetchAvailableGames();
    }
  }, []);
  // FETCH MATCHES
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
        fireFetchAvailableGames={fireFetchAvailableGames}
      />
      <MatchesList
        availableGames={availableGames}
        availableMatches={availableMatches}
        availableMatchesError={availableMatchesError}
        fireFetchAvailableMatches={fireFetchAvailableMatches}
      />
    </div>
  );
};

function MatchesList({
  availableGames,
  availableMatches,
  availableMatchesError,
  fireFetchAvailableMatches,
}) {
  console.dir(`🚀 ~ availableMatches`, availableMatches);
  if (availableGames.length > 0) {
    return availableGames.map((gameName) => (
      <>
        <h3>{`Available Matches for ${gameName}`}</h3>
        {availableMatchesError[gameName] ? (
          <>
            <h4>Error</h4>
            <p>{`Unable to fetch matches for ${gameName} from server: ${availableMatchesError[gameName]}`}</p>
            <button onClick={() => fireFetchAvailableMatches(gameName)}>
              RETRY
            </button>
          </>
        ) : (
          <ul>
            {/* {(availableMatches?.[gameName] || []).map((match) => (
              <li>MATCH!</li>
            ))} */}
          </ul>
        )}
      </>
    ));
  }
  return null;
}
function GamesList({
  availableGames,
  availableGamesError,
  fireFetchAvailableGames,
}) {
  return (
    <>
      <h3>Available Games:</h3>
      {availableGamesError ? (
        <>
          <h4>Error</h4>
          <p>Unable to fetch games from server: {availableGamesError}</p>
          <button onClick={fireFetchAvailableGames}>RETRY</button>
        </>
      ) : (
        <ul>
          {availableGames.map((game) => (
            <li>{game}</li>
          ))}
        </ul>
      )}
    </>
  );
}
