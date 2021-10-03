import { useBgioCtx, useBgioMoves, useBgioEvents } from "bgio-contexts";

export const Controls = () => {
  const { ctx } = useBgioCtx();
  const { isMyTurn } = ctx;
  const { moves, undo, redo } = useBgioMoves();
  const { events } = useBgioEvents();
  const { endTurn } = events;
  const { increaseScore } = moves;
  const handleClickIncreaseScore = (e: React.MouseEvent) => {
    increaseScore();
  };
  const handleClickEndTurn = (e: React.MouseEvent) => {
    endTurn?.();
  };

  return isMyTurn ? (
    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
      <button onClick={undo}>UNDO</button>
      <button onClick={redo}>REDO</button>
      <button onClick={handleClickIncreaseScore}>Move: Increase Score</button>
      <button onClick={handleClickEndTurn}>Event: End Turn</button>
    </div>
  ) : (
    <div>NOT YOUR TURN</div>
  );
};
