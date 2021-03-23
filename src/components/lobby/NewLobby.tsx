import { Redirect } from "react-router-dom";
import { useBgioLobby } from "contexts";
import { CreateMatchButton } from "./CreateMatchButton";
import { SelectedGameMatchList } from "./SelectedGameMatchList";
import { GameSelect } from "./GameSelect";
import { SelectedMatchDisplay } from "./SelectedMatchDisplay";

export const NewLobby = () => {
  const {
    getLobbyGames,
    lobbyGamesError,
    selectedGame,
    joinedMatch,
  } = useBgioLobby();
  // If we've joined a match, time to go to play page
  // if (joinedMatch?.matchID) {
  //   return <Redirect to="/play" />;
  // }

  return (
    <>
      {lobbyGamesError ? (
        <p style={{ color: "red" }}>
          {`Error -- Could not retrieve games from server : ${lobbyGamesError}`}
          <button onClick={getLobbyGames}>Retry</button>
        </p>
      ) : (
        <>
          <GameSelect />
        </>
      )}
      {/* First game will be auto-selected, so this should display if games are successfully fetched */}
      {selectedGame ? (
        <>
          <CreateMatchButton />
          <SelectedGameMatchList />
          <SelectedMatchDisplay />
        </>
      ) : null}
    </>
  );
};
