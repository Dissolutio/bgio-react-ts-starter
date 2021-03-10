import React from "react";
import { useBgioClientInfo, useBgioG } from "contexts";
import { ChatInput, ChatList } from "./Chat";
import { Controls } from "./Controls";

export const ExampleUI = () => {
  const { playerID } = useBgioClientInfo();
  const { G } = useBgioG();
  return (
    <div>
      <h1 style={{ margin: 0 }}>{`Player ${playerID}'s UI`}</h1>
      <p>{`Player 0 score: ${G.player0Score}`}</p>
      <p>{`Player 1 score: ${G.player1Score}`}</p>
      <Controls />
      <h3>Chats</h3>
      <ChatList />
      <ChatInput />
    </div>
  );
};
