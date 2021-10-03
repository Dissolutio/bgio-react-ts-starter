import React from "react";
import { uniqBy } from "lodash";
import { useBgioClientInfo, useBgioChat } from "bgio-contexts";

function generateChatID() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z]+/g, "")
    .substr(0, 5);
}

export const ChatInput = () => {
  const [chatInputText, setChatInputText] = React.useState("");
  const { sendChatMessage } = useBgioChat();
  const { playerID } = useBgioClientInfo();
  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInputText(e.target.value);
  };
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sendChatMessage({
      sender: playerID,
      id: generateChatID(),
      payload: chatInputText,
    });
    setChatInputText("");
  };
  const chatInputHtmlId = `chat-text-input`;
  return (
    <div>
      <form onSubmit={handleChatSubmit}>
        <label htmlFor={chatInputHtmlId}>
          Type message:
          <input
            type="text"
            onChange={handleChatInputChange}
            value={chatInputText}
            id={chatInputHtmlId}
          />
        </label>
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export const ChatList = () => {
  const chatCtxVal = useBgioChat();
  const chatMessages = uniqBy(chatCtxVal.chatMessages, "id");
  return (
    <ul style={{ listStyleType: "none" }}>
      {chatMessages.map((chat) => {
        const actualChat = chat.payload;
        const { id, sender, payload } = actualChat;
        return (
          <li key={id}>
            <span
              style={{ fontSize: "0.8em", fontWeight: 700 }}
            >{`Player ${sender}: `}</span>
            {payload}
          </li>
        );
      })}
    </ul>
  );
};
