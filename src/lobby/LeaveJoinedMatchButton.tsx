import { useMultiplayerLobby } from "lobby";
import React from "react";

export const LeaveJoinedMatchButton = () => {
  const { handleLeaveJoinedMatch } = useMultiplayerLobby();
  return (
    <div>
      <button onClick={handleLeaveJoinedMatch}>Leave Joined Game</button>
    </div>
  );
};
