import { MultiplayerGameClient } from "App";
import { useAuth } from "hooks";

export const PlayPage = () => {
  const { storedCredentials } = useAuth();
  const { playerID, matchID, playerCredentials } = storedCredentials;
  return (
    <MultiplayerGameClient
      matchID={matchID}
      playerID={playerID}
      credentials={playerCredentials}
    />
  );
};
