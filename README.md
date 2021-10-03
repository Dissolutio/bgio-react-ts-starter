- [Boardgame.io React TypeScript Starter](#boardgameio-react-typescript-starter)
  - [How to copy bgio-react-ts-starter](#how-to-copy-bgio-react-ts-starter)
  - [Project Structure](#project-structure)
    - [BGIO BoardProps into React Contexts](#bgio-boardprops-into-react-contexts)
      - [List of BGIO Contexts](#list-of-bgio-contexts)
    - [The useAuth hook](#the-useauth-hook)
    - [React-Router-Dom is included](#react-router-dom-is-included)
    - [`server/` is a compiled directory - don't use it](#server-is-a-compiled-directory---dont-use-it)
    - [CSS / UI Library used: water.css](#css--ui-library-used-watercss)
  - [Available Scripts](#available-scripts)
    - [`npm start`](#npm-start)
    - [`npm run devstart`](#npm-run-devstart)
    - [`npm run devserver`](#npm-run-devserver)
    - [`npm run build`](#npm-run-build)
    - [`npm run server`](#npm-run-server)
    - [`npm test`](#npm-test)
    - [`npm run eject`](#npm-run-eject)
  - [Create-React-App info](#create-react-app-info)

# Boardgame.io React TypeScript Starter

This is a React app built with
[Create React App](https://github.com/facebook/create-react-app) and
[Boardgame.io](https://boardgame.io). For now referred to as CRA and BGIO. It
comes with some simple commands to get up and running, and some React hooks that
expose the BGIO props a little more easily. Have fun!

## How to copy bgio-react-ts-starter

1. `npx create-react-app YOUR_PROJECT_NAME --template typescript`
2. `npm install boardgame.io esm koa-mount koa-static react-helmet react-router-dom`
3. `npm install --save-dev @types/koa-static nodemon npm-run-all watch @types/react-router-dom`
4. `npm install --save-dev eslint prettier`

Then copy these into the scripts section of your `package.json`:

```
"start": "react-scripts start",
"devstart": "REACT_APP_WITH_SEPARATE_SERVER=1 npm start",
"devserver": "run-p nodemon-devserver compile-game-files:watch",
"build": "npm-run-all --continue-on-error compile-game-files cra-build",
"server": "node -r esm server.js",
"cra-build": "react-scripts build",
"compile-game-files": "tsc ./src/game/*.ts --outDir ./server --downlevelIteration true --skipLibCheck true",
"compile-game-files:watch": "watch 'npm run compile-game-files' ./src/game",
"nodemon-devserver": "nodemon --delay 1 --watch ./server -r esm devserver.js",
"format": "prettier --write 'src/**/*.js' '**/*.json' 'src/**/*.ts' 'src/**/*.tsx' 'server.js' 'devserver.js'",
"test": "react-scripts test",
"eject": "react-scripts eject"
```

## Project Structure

Here are some concepts to help understand the project:

### BGIO BoardProps into React Contexts

The Board component, as a BGIO specific component, receives
[the BGIO API as props](https://boardgame.io/documentation/#/api/Client?id=board-props).

The Board in our project splits the BoardProps up into different contexts, and
wraps our UI in the Providers for all those contexts. Now our UI components can
access BoardProps easily, with hooks, and hopefully without any unnecessary
re-renders.

#### List of BGIO Contexts

1. `useBgioG` -- access the BGIO `G` object
2. `useBgioCtx` -- access the BGIO `ctx` object
3. `useBgioEvents` -- access BGIO game `events` as well as the `reset` action
4. `useBgioMoves` -- includes your game moves, as well as `undo` and `redo` from
   BGIO
5. `useBgioChat` -- access chats, send new ones
6. `useBgioClientInfo` -- for now, this is a little bit of a catch all, but it
   includes these BGIO Client related props: `playerID` `log` `matchID`
   `matchData` `isActive` `isMultiplayer` `isConnected` `credentials`
7. `useBgioLobbyApi` -- instantiates the BGIO `LobbyClient` object and provides
   the [BGIO Lobby/Server API](https://boardgame.io/documentation/#/api/Lobby)
   as a context hook
8. `useMultiplayerLobby` -- this context maintains the lobby state, and
   manages/provides the asynchronous flows that implement the useBgioLobbyApi
   hook

If you want your lobby to have a different flow, you'll be editing the
`useMultiplayerLobby`, but the `useBgioLobbyApi` hook is more tethered to the
shape of the BGIO API and less likely to need changing.

Checkout some of the components in `src/lobby/` or `src/ui/` for some examples
on how to use the hooks.

### The useAuth hook

The `useMultiplayerLobby` hook uses the useAuth hook to hold the players current
match, credentials, and name in memory. There's two storage hooks in the folder
with `useAuth`, and by default I have commented out the implementation of
`useLocalStorage` and left `useSessionStorage` in place. The advantage is for
when you are developing, you can start up the local client and server, then play
against yourself in two different browser tabs. On the flipside, once you've
deployed your app, maybe you want user's data to sync across
tabs/windows/sessions. In that case, you would want to go into `useAuth` and
implement `useLocalStorage`.

### React-Router-Dom is included

This is not a requirement of BGIO, so feel free to remove it, but this project's
`MultiplayerLobby`, `App`, and `Nav` components will need a refactor.

### `server/` is a compiled directory - don't use it

Our node server requires raw javascript. Some of the npm scripts herein involve
compiling files and outputting them to the `server/` directory. Don't use that
folder for other stuff.

### CSS / UI Library used: [water.css](https://watercss.kognise.dev/)

I chose it because it has no dependencies, it does **not** use classnames (so
the JSX markup is not contaminated with classNames) and it's tiny, so you can
easily remove it and use something else.

I did have to adjust some styles, these adjustments are in `index.css` and
largely do not use classnames except those already present in the BGIO debugger.

Adding it to the project involved no npm install, just the following import in
`index.html`:

```html
<!-- in project root /public/index.html -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/water.css@2/out/water.css"
/>
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the CRA app with a BGIO Local server setup, where the players are playing
on the same device. This is the fastest and easiest way to work on your game.
Since the game files are consumed by the client-side code, there is no
compilation step necessary.<br/>

### `npm run devstart`

Starts the CRA app but points the BGIO Client to a locally hosted BGIO Server.

In a separate terminal, you should run `npm run devserver`.

### `npm run devserver`

Watches your `src/game` folder, compiles and outputs the .js into the `server`
folder.

Runs the node server in `devserver.js`, and restarts when it or the game files
change.

The devserver does _NOT_ serve the front-end app, that must be started in
another terminal with `npm run devstart`.

### `npm run build`

Compiles the game files, so the server file can read them.

Builds the CRA app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the
best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

Also see the
[BGIO docs on deployment](https://boardgame.io/documentation/#/deployment).

I personally add a `Procfile` to the project root with contents:
`web: node -r esm server.js` and the whole repo is off to Heroku for deployment.
One thing that's easy to get snagged on is if the game files do not get compiled
in the right shape, then the server file won't import them correctly and your
build will succeed even though your logs will tell you why your deploy isn't
working (server.js can't find an import)

### `npm run server`

Test your build locally! This will run the node server from `server.js`, which
is the deployment server file. This server is configured to serve the front-end
app from the `build` folder when we navigate to http://localhost:8000/ .

### `npm test`

Launches the test runner in the interactive watch mode.

See the section about
[running tests](https://facebook.github.io/create-react-app/docs/running-tests)
for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can
`eject` at any time. This command will remove the single build dependency from
your project.

Instead, it will copy all the configuration files and the transitive
dependencies (webpack, Babel, ESLint, etc) right into your project so you have
full control over them. All of the commands except `eject` will still work, but
they will point to the copied scripts so you can tweak them. At this point
you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for
small and middle deployments, and you shouldn’t feel obligated to use this
feature. However we understand that this tool wouldn’t be useful if you couldn’t
customize it when you are ready for it.

## Create-React-App info

You can learn more in the
[Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
