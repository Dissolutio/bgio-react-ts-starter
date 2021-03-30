import { useBgioClientInfo, useBgioG } from "bgio-contexts";
import { ChatInput, ChatList } from "./Chat";
import { Controls } from "./Controls";

export const ExampleUI = () => {
  const { playerID } = useBgioClientInfo();
  const { G } = useBgioG();
  return (
    <div>
      <h1>{`Player ${playerID}'s UI`}</h1>
      <p>{`Player 0 score: ${G?.score["0"] ?? ""}`}</p>
      <p>{`Player 1 score: ${G?.score["1"] ?? ""}`}</p>
      <Controls />
      <h3>Chats</h3>
      <ChatList />
      <ChatInput />
    </div>
  );
};
