export function CreateMatchButton({
  createMatchSuccess,
  createMatchError,
  handleCreateMatchButton,
}) {
  return (
    <div>
      <button onClick={handleCreateMatchButton}>Create new match</button>
      {createMatchError && (
        <p style={{ color: "red" }}>
          Sorry! Failed to create match: {`${createMatchError}`}
        </p>
      )}
      {createMatchSuccess && (
        <p style={{ color: "green" }}>
          Last match created: {`${createMatchSuccess}`}
        </p>
      )}
    </div>
  );
}
