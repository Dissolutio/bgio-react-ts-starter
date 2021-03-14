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
    increaseScore: (G, ctx) => {
      const { currentPlayer } = ctx;
      G[`player${currentPlayer}Score`]++;
    },
  },
};
