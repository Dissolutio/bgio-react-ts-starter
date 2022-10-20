// ! Three Options:
// * A local game (for game development) `npm run start`
// * Client that connects to a local server `npm run devstart` (`npm run devserver` will run the local server)
// * Run a production server that serves up the client on localhost:8000: `npm run build` THEN `npm run server`

const isDeploymentEnv = process.env.NODE_ENV === "production";
const isDevEnv = process.env.NODE_ENV === "development";
const isSeparateServer = Boolean(process.env.REACT_APP_WITH_SEPARATE_SERVER);
export const isLocalApp = isDevEnv && !isSeparateServer;

// use appropriate address for server
const hostname = window?.location?.hostname ?? "";
const protocol = window?.location?.protocol ?? "";
const port = window?.location?.port ?? "";
const deploymentServerAddr = `${protocol}//${hostname}${
  port ? `:${port}` : ``
}`;
const localServerAddr = `http://localhost:8000`;
export const SERVER = isDeploymentEnv ? deploymentServerAddr : localServerAddr;

export const MAX_PLAYERS = 5;

export const NUM_COLORS = 7;

export const PLAYER_NAME_MAX_LEN = 16;

// TODO and warning: changing those is not enough, you need to also fix the possibles
// options in GameSetup.tsx
export const AUTO_NUM_COLS_TO_WIN = new Map([
  [1, 5],
  [2, 5],
  [3, 3],
  [4, 3],
  [5, 2],
]);

// Number of steps for each columns for the different modes.
export const NUM_STEPS = {
  classic: {
    2: 3,
    3: 5,
    4: 7,
    5: 9,
    6: 11,
    7: 13,
  },
  tall: {
    2: 3,
    3: 6,
    4: 9,
    5: 11,
    6: 14,
    7: 16,
  },
};
