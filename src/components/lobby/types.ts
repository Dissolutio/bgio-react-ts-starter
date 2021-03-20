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
