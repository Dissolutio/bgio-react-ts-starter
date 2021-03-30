import { useMultiplayerLobby } from "./useMultiplayerLobby"

export function CreateMatchButton() {
  const { createMatchError, handleCreateMatchButton } = useMultiplayerLobby()
  return (
    <div>
      <button onClick={handleCreateMatchButton}>Create new match</button>
      {createMatchError && (
        <span style={{ color: "red" }}>
          Sorry! Failed to create match: {`${createMatchError}`}
        </span>
      )}
    </div>
  )
}
