import { useBgioLobby } from "contexts";
import { MyGameState } from "game/game";
import { CreateMatchButton } from "./CreateMatchButton";
import { SelectedGameMatchList } from "./SelectedGameMatchList";
import { GameSelect } from "./GameSelect";
import { SelectedMatchDisplay } from "./SelectedMatchDisplay";

export type LobbyMatchSetupData = {
  lobbyDisplayName: string;
};
export type MyGameSetupData = MyGameState & LobbyMatchSetupData;

export type MatchPlayerMetadata = {
  id: number;
  name?: string;
  credentials?: string;
  data?: any;
  isConnected?: boolean;
};

export const NewLobby = () => {
  const {
    getLobbyGames,
    lobbyGamesError,
    selectedGame,
    joinedMatch,
    handleLeaveJoinedMatch,
  } = useBgioLobby();
  const joinedMatchID = joinedMatch?.matchID;
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
          {joinedMatchID ? (
            <div>
              <button onClick={handleLeaveJoinedMatch}>
                Leave Joined Game
              </button>
            </div>
          ) : null}
          <SelectedGameMatchList />
          <SelectedMatchDisplay />
        </>
      ) : null}
    </>
  );
};
