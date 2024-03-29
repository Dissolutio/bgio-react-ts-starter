import { increaseScore } from "./moves";

export type MyGameState = {
  score: {
    [playerID: string]: number;
  };
};
export const defaultSetupData = {
  score: { "0": 0, "1": 0 },
  lobbyDisplayName: "",
};
export const MYGAME_NUMPLAYERS = 2;
export const myGame = {
  name: "myGame",
  setup: (ctx, setupData) => {
    const myG = {
      ...defaultSetupData,
      ...setupData,
    };
    return myG;
  },
  moves: {
    increaseScore,
  },
  minPlayers: 2,
  maxPlayers: 2,
};

export const myOtherGame = {
  name: "myOtherGame",
  setup: (ctx, setupData) => {
    const myG = {
      ...defaultSetupData,
      ...setupData,
    };
    return myG;
  },
  moves: {
    increaseScore,
  },
  minPlayers: 2,
  maxPlayers: 2,
};
