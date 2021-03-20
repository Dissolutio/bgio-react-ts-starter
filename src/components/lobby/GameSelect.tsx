type Props = {
  selectLabelText: string;
  lobbyGames: any[];
  selectedGame: string;
  handleSelectGameChange: (e: any) => void;
};

export const GameSelect = (props: Props) => {
  const {
    lobbyGames,
    selectedGame,
    handleSelectGameChange,
    selectLabelText,
  } = props;
  const createMatchGameSelectHtmlID = `game-select`;
  return (
    <label htmlFor={createMatchGameSelectHtmlID}>
      {`${selectLabelText}:`}
      <select
        onChange={handleSelectGameChange}
        value={selectedGame}
        id={createMatchGameSelectHtmlID}
      >
        {lobbyGames.map((gameName) => (
          <option key={gameName} value={gameName}>
            {gameName}
          </option>
        ))}
      </select>
    </label>
  );
};
