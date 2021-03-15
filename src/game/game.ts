export type MyGameState = {
  score: {
    [playerID: string]: number;
  };
};

export const defaultSetupData: MyGameState = {
  score: { "0": 0, "1": 0 },
};

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
};

function increaseScore(G, ctx) {
  const { currentPlayer } = ctx;
  const currentScore = G.score[currentPlayer];
  G.score[`${currentPlayer}`] = currentScore + 1;
}
