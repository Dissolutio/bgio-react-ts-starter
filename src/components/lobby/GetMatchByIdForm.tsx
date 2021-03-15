import { useState } from "react";
interface Props {
  getMatchDataByIDForSelectedGame: (string) => void;
  getMatchByIDError: string;
  selectedMatch: any;
}

export const GetMatchByIdForm = (props: Props) => {
  const {
    getMatchDataByIDForSelectedGame,
    getMatchByIDError,
    selectedMatch,
  } = props;
  const createdAt = selectedMatch?.createdAt;
  const updatedAt = selectedMatch?.updatedAt;
  const gameName = selectedMatch?.gameName;
  const matchID = selectedMatch?.matchID;
  const players = selectedMatch?.players ?? [];
  const setupData = selectedMatch?.setupData;
  const unlisted = selectedMatch?.unlisted;

  const [inputText, setInputText] = useState("");

  const handleTextInputChange = (e) => {
    setInputText(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getMatchDataByIDForSelectedGame(inputText);
    setInputText("");
  };
  const inputHtmlId = `get-match-match-id-input`;

  return (
    <div>
      <h3>Get Match by ID Form</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor={inputHtmlId}>
          Match ID:
          <input
            type="text"
            onChange={handleTextInputChange}
            value={inputText}
            id={inputHtmlId}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {getMatchByIDError && (
        <p style={{ color: "red" }}>
          Error - Failed to get match by ID: {`${getMatchByIDError}`}
        </p>
      )}
      {selectedMatch && (
        <ul>
          <li>game name: {gameName}</li>
          <li>matchID: {matchID}</li>
          <li>createdAt: {`${new Date(createdAt).toLocaleTimeString()}`}</li>
          <li>updatedAt: {`${new Date(updatedAt).toLocaleTimeString()}`}</li>
          <li>
            PLAYER SLOTS:
            <PlayerDataDisplay players={players} />
          </li>
          <li>{unlisted ? "Private match" : "Public match"}</li>
          {/* <li>setupData: {getMatchByIDSuccess.setupData}</li> */}
        </ul>
      )}
    </div>
  );
};

const PlayerDataDisplay = (props: { players }) => {
  const playersJSX = props.players.map((playerSlot) => (
    <li key={playerSlot.id}>{`${playerSlot.id}: ${
      playerSlot.name || "EMPTY"
    }`}</li>
  ));
  return <ul>{playersJSX}</ul>;
};
