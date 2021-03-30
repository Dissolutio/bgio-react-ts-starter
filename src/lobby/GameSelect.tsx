import { useMultiplayerLobby } from "./useMultiplayerLobby"

export const GameSelect = () => {
  const {
    lobbyGames,
    selectedGame,
    handleSelectGameChange,
  } = useMultiplayerLobby()
  const gameSelectHtmlID = `game-select`
  return (
    <label htmlFor={gameSelectHtmlID}>
      Choose a game:
      <select
        onChange={handleSelectGameChange}
        value={selectedGame}
        id={gameSelectHtmlID}
      >
        {lobbyGames.map((gameName) => (
          <option key={gameName} value={gameName}>
            {gameName}
          </option>
        ))}
      </select>
    </label>
  )
}
