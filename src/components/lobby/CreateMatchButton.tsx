import { useBgioLobby } from "contexts";

export function CreateMatchButton() {
  const {
    createMatchSuccess,
    createMatchError,
    handleCreateMatchButton,
  } = useBgioLobby();
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
