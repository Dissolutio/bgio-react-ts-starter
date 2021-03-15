export const myGame = {
  name: "myGame",
  setup: (ctx, setupData) => {
    const myG = {
      player0Score: 0,
      player1Score: 0,
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
