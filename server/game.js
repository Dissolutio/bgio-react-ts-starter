"use strict";
exports.__esModule = true;
exports.myGame = void 0;
exports.myGame = {
    name: 'myGame',
    setup: function (ctx, setupData) {
        var myG = {
            player0Score: 0,
            player1Score: 0
        };
        return myG;
    },
    moves: {
        increaseScore: function (G, ctx) {
            var currentPlayer = ctx.currentPlayer;
            G["player" + currentPlayer + "Score"]++;
        }
    }
};
