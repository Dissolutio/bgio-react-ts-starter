import { useBgioClientInfo, useBgioG } from "bgio-contexts";
import { ChatInput, ChatList } from "./Chat";
import { Controls } from "./Controls";

export const ExampleUI = () => {
  const { playerID, matchData } = useBgioClientInfo();
  const { G } = useBgioG();
  return (
    <div>
      <h1>{`YOU are PLAYER-${playerID}`}</h1>
      <p>{`Player 0 score: ${G?.score["0"] ?? ""}`}</p>
      <p>{`Player 1 score: ${G?.score["1"] ?? ""}`}</p>
      <Controls />
      {matchData && (
        <>
          <h3>Opponents</h3>
          <ul>
            {matchData.map((playerSlot) => {
              const { id } = playerSlot;
              const playerName = playerSlot?.name ?? "";
              const isConnected = playerSlot?.isConnected ?? false;
              return playerName ? (
                <li>
                  Player-{id}: <span>{playerName}</span>
                </li>
              ) : (
                <li>
                  Player-{id}: <span>No player yet</span>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <h3>Chats</h3>
      <ChatList />
      <ChatInput />
    </div>
  );
};
