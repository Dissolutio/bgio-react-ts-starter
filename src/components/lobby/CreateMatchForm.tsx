export function CreateMatchForm({
  availableGames,
  createMatchSuccess,
  createMatchError,
  selectedGame,
  handleGameSelectChange,
  handleCreateMatchSubmit,
}) {
  const createMatchGameSelectHtmlID = `create-match-game-select`;

  return (
    <form onSubmit={handleCreateMatchSubmit}>
      <h5>Create a New Match</h5>
      <label htmlFor={createMatchGameSelectHtmlID}>
        Choose game:
        <select
          onChange={handleGameSelectChange}
          value={selectedGame}
          id={createMatchGameSelectHtmlID}
        >
          {availableGames.map((gameName) => (
            <option key={gameName} value={gameName}>
              {gameName}
            </option>
          ))}
        </select>
      </label>
      <div>
        <button type="submit">CREATE GAME</button>
        {createMatchError && (
          <p style={{ color: "red" }}>
            Error - Failed to create game: {`${createMatchError}`}
          </p>
        )}
        {createMatchSuccess && (
          <p style={{ color: "green" }}>
            Created Match with ID: {`${createMatchSuccess}`}
          </p>
        )}
      </div>
    </form>
  );
}
