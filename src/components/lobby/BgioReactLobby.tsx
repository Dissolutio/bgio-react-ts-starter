import { Lobby as BgioLobby } from "boardgame.io/react";
import { myGame } from "../../game/game";
import { Board } from "../../Board";

const serverGamesList = [{ game: myGame, board: Board }];

export const BgioReactLobby = ({
  serverAddress,
}: {
  serverAddress: string;
}) => {
  return (
    <BgioLobby
      gameServer={serverAddress}
      lobbyServer={serverAddress}
      gameComponents={serverGamesList}
    />
  );
};
