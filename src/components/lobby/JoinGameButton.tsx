export const JoinGameButton = ({
  playerID,
  playerName,
  handleJoinSelectedMatch,
  children,
}) => {
  return (
    <div>
      <button
        onClick={(e) =>
          handleJoinSelectedMatch({ playerID: `${playerID}`, playerName })
        }
      >
        {children}
      </button>
    </div>
  );
};
