type Props = {
  selectLabelText: string;
  availableGames: any[];
  selectedGame: string;
  handleSelectGameChange: (e: any) => void;
};

export const GameSelect = (props: Props) => {
  const {
    availableGames,
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
        {availableGames.map((gameName) => (
          <option key={gameName} value={gameName}>
            {gameName}
          </option>
        ))}
      </select>
    </label>
  );
};
