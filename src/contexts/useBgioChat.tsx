// BgioChatProvider
import * as React from "react";
import { BoardProps } from "boardgame.io/react";
import { ChatMessage } from "boardgame.io";

type BgioChatProviderProps = {
  children: React.ReactNode;
  sendChatMessage: BoardProps["sendChatMessage"];
  chatMessages: ChatMessage[];
};
type BgioChatValue = {
  sendChatMessage: BoardProps["sendChatMessage"];
  chatMessages: ChatMessage[];
};
const BgioChatContext = React.createContext<BgioChatValue | undefined>(
  undefined
);

export function BgioChatProvider({
  chatMessages,
  sendChatMessage,
  children,
}: BgioChatProviderProps) {
  return (
    <BgioChatContext.Provider
      value={{
        chatMessages,
        sendChatMessage,
      }}
    >
      {children}
    </BgioChatContext.Provider>
  );
}

export function useBgioChat() {
  const context = React.useContext(BgioChatContext);
  if (context === undefined) {
    throw new Error("useBgioChat must be used within a BgioChatProvider");
  }
  return context;
}
