import { useBgioLobby } from "contexts";

interface Props {}

export const PlayPage = (props: Props) => {
  const {
    getLobbyGames,
    lobbyGamesError,
    selectedGame,
    joinedMatch,
    storedCredentials,
  } = useBgioLobby();
  return (
    <div>
      <h1>{`PLAY PAGE! Match ID: ${joinedMatch?.matchID}`}</h1>
    </div>
  );
};
