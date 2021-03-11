import { BoardProps } from "boardgame.io/react";
import { ChatMessage } from "boardgame.io";
import {
  BgioClientInfoProvider,
  BgioGProvider,
  BgioMovesProvider,
  BgioEventsProvider,
  BgioCtxProvider,
  UIContextProvider,
  BgioChatProvider,
} from "contexts";
import { ExampleUI } from "./components/ExampleUI";

type MyBoardProps = BoardProps & { chatMessages?: ChatMessage[] };

export function Board(props: MyBoardProps) {
  const {
    // G
    G,
    // CTX
    ctx,
    // MOVES
    moves,
    undo,
    redo,
    // EVENTS
    events,
    reset,
    // CHAT
    sendChatMessage,
    chatMessages = [],
    // ALSO ON BOARD PROPS
    playerID,
    log,
    matchID,
    matchData,
    isActive,
    isMultiplayer,
    isConnected,
    credentials,
  } = props;
  return (
    <BgioClientInfoProvider
      playerID={playerID}
      log={log}
      matchID={matchID}
      matchData={matchData}
      isActive={isActive}
      isMultiplayer={isMultiplayer}
      isConnected={isConnected}
      credentials={credentials}
    >
      <BgioGProvider G={G}>
        <BgioCtxProvider ctx={ctx}>
          <BgioMovesProvider moves={moves} undo={undo} redo={redo}>
            <BgioEventsProvider reset={reset} events={events}>
              <BgioChatProvider
                chatMessages={chatMessages}
                sendChatMessage={sendChatMessage}
              >
                <UIContextProvider>
                  <ExampleUI />
                </UIContextProvider>
              </BgioChatProvider>
            </BgioEventsProvider>
          </BgioMovesProvider>
        </BgioCtxProvider>
      </BgioGProvider>
    </BgioClientInfoProvider>
  );
}
