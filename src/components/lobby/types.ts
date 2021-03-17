import { MyGameState } from "../../game/game";

export type MatchPlayerMetadata = {
  id: number;
  name?: string;
  credentials?: string;
  data?: any;
  isConnected?: boolean;
};
export type MyGameCreateMatchOptions = {
  setupData: MyGameState;
  numPlayers: number;
  unlisted?: boolean;
};
export type JoinMatchOptions = {
  playerID: string;
  playerName: string;
  data?: any;
};
export type JoinMatchParams = {
  gameName: string;
  matchID: string;
  options: JoinMatchOptions;
};
