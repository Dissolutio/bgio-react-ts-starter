import { useBgioClientInfo } from "bgio-contexts";

export const MultiplayerMatchPlayerList = () => {
  const { matchData } = useBgioClientInfo();

  return matchData ? (
    <>
      <h3>PlayerList</h3>
      <ul>
        {matchData.map((playerSlot) => {
          const { id } = playerSlot;
          const playerName = playerSlot?.name ?? "";
          const isConnected = playerSlot?.isConnected ?? false;
          const color = isConnected ? "green" : "red";
          return playerName ? (
            <li key={id} style={{ color }}>
              Player-{id}: <span>{playerName}</span>
            </li>
          ) : (
            <li key={id} style={{ color }}>
              Player-{id}: <span>No player yet</span>
            </li>
          );
        })}
      </ul>
    </>
  ) : null;
};
