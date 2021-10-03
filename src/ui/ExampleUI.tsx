import { useBgioClientInfo, useBgioG } from "bgio-contexts";
import { LeaveJoinedMatchButton } from "lobby/LeaveJoinedMatchButton";
import { ChatInput, ChatList } from "./Chat";
import { Controls } from "./Controls";
import { isLocalApp } from "App";
export const ExampleUI = () => {
  const { playerID } = useBgioClientInfo();
  const { G } = useBgioG();
  return (
    <div>
      <h1>{`YOU are PLAYER-${playerID}`}</h1>
      <p>{`Player 0 score: ${G?.score["0"] ?? ""}`}</p>
      <p>{`Player 1 score: ${G?.score["1"] ?? ""}`}</p>
      <Controls />
      <MultiplayerMatchPlayerList />
      {!isLocalApp && <LeaveJoinedMatchButton />}
      <h3>Chats</h3>
      <ChatList />
      <ChatInput />
    </div>
  );
};

const MultiplayerMatchPlayerList = () => {
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
