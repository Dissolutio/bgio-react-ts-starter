import { Server, Origins } from "boardgame.io/server";
import path from "path";
import serve from "koa-static";
import { myGame, myOtherGame } from "./server/game";

const server = Server({
  games: [myGame, myOtherGame],
  // CORS requirement
  origins: [
    // Allow your game site to connect.
    // "https://www.mygame.domain",
    // Allow localhost to connect, except when NODE_ENV is 'production'.
    Origins.LOCALHOST_IN_DEVELOPMENT,
    // Allow localhost to connect ALL THE TIME
    Origins.LOCALHOST,
  ],
});
const PORT = process.env.PORT || 8000;

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, "./build");
server.app.use(serve(frontEndAppBuildPath));

server.run(PORT, () => {
  server.app.use(
    async (ctx, next) =>
      await serve(frontEndAppBuildPath)(
        Object.assign(ctx, { path: "index.html" }),
        next
      )
  );
});
