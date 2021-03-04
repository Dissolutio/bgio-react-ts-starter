import { usePlayerID, useG, useCtx, useMoves } from 'contexts';

export const ExampleUI = () => {
  const { playerID } = usePlayerID();
  const { G } = useG();
  return (
    <div>
      <h1 style={{ margin: 0 }}>{`Player ${playerID}'s UI`}</h1>
      <p>{`Player 0 score: ${G.player0Score}`}</p>
      <p>{`Player 1 score: ${G.player1Score}`}</p>
      <Buttons />
    </div>
  );
};

const Buttons = () => {
  const { ctx } = useCtx();
  const { isMyTurn } = ctx;
  const { events, moves, undo, redo } = useMoves();
  const { endTurn } = events;
  const { increaseScore } = moves;

  return isMyTurn ? (
    <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      <button onClick={undo}>UNDO</button>
      <button onClick={redo}>REDO</button>
      <button onClick={increaseScore}>Move: Increase Score</button>
      <button onClick={() => endTurn()}>Event: End Turn</button>
    </div>
  ) : (
    <div>NOT YOUR TURN</div>
  );
};
