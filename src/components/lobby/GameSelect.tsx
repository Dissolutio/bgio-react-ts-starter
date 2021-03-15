type Props = {
  availableGames: any[];
  selectedGame: string;
  handleGameSelectChange: (e: any) => void;
};

export const GameSelect = (props: Props) => {
  const { availableGames, selectedGame, handleGameSelectChange } = props;
  const createMatchGameSelectHtmlID = `game-select`;
  return (
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
  );
};
