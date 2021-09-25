import { Move } from "boardgame.io";
import { MyGameState } from "./game";

export const increaseScore: Move<MyGameState> = (G, ctx) => {
  const { currentPlayer } = ctx;
  const currentScore = G.score[currentPlayer];
  G.score[`${currentPlayer}`] = currentScore + 1;
};
