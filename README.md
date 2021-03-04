# Boardgame.io React TypeScript Starter

This is a React app built with [Create React App](https://github.com/facebook/create-react-app) and [Boardgame.io](https://boardgame.io).
For now referred to as CRA and BGIO. It comes with some simple commands to get up and running, and some React hooks that expose the BGIO props a little more easily. Have fun!

## Overview

The Board component is what gets all the BGIO goodness as props. Our Board splits the props up into different contexts, now your underlying UI components can access them easily.

The project also includes _react-router-dom_ already. See example of its use in the `LocalApp` component in `App.tsx`.

The game files, in the `src/game/` directory, can be used by the Local server, but for the node server in `devserver.js` and `server.js` to use them, they must be compiled to JS files. This compilation is run by some of the scripts below, and the files are output to the `server/` directory. Don't use that folder for other stuff.

### React hooks included to access BGIO data:

1. usePlayerID
2. useG
3. useCtx
4. useMoves -- includes your game moves, as well as `undo` and `redo` from BGIO

See the file `src/components/ExampleUI.tsx` for an example on how to use the hooks.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the CRA app with a BGIO Local server setup, where the players are playing on the same device. This is the fastest and easiest way to work on your game. Since the game files are consumed on the client-side code, there is no compilation step necessary.<br/>

### `npm run devstart`

Starts the CRA app but points the BGIO Client to a locally hosted BGIO Server.

In a seperate terminal, you should run `npm run devserver`.

### `npm run devserver`

Watches your `src/game` folder, compiles and outputs the .js into the `server` folder.

Runs the node server in `devserver.js`, and restarts when it or the game files change.

The devserver does _NOT_ serve the front-end app, that must be started in another terminal with `npm run devstart`.

### `npm run build`

Compiles the game files, so the server file can read them.

Builds the CRA app for production to the `build` folder.

It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

Also see the [BGIO docs on deployment](https://boardgame.io/documentation/#/deployment).

### `npm run server`

Test your build locally! This will run the node server from `server.js`, which is the deployment server file. This server is configured to serve the front-end app from the `build` folder when we navigate to http://localhost:8000/ .

### `npm test`

Launches the test runner in the interactive watch mode.

See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Create-React-App info

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
