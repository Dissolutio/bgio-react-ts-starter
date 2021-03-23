export type MyGameState = {
  score: {
    [playerID: string]: number;
  };
};
export type LobbyMatchSetupData = {
  lobbyDisplayName: string;
};
export type MyGameSetupData = MyGameState & LobbyMatchSetupData;

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
