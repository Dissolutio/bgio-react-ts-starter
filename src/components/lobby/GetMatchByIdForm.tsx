import { useState } from "react";
import { LobbyAPI } from "boardgame.io";
interface Props {
  getMatchDataByIDForSelectedGame: (matchID: string) => Promise<LobbyAPI.Match>;
  getMatchByIDError: string;
}

export const GetMatchByIdForm = (props: Props) => {
  const { getMatchDataByIDForSelectedGame, getMatchByIDError } = props;

  const [inputText, setInputText] = useState("");
  const [erroredMatchID, setErroredMatchID] = useState("");
  const handleTextInputChange = (e) => {
    if (e.target.value !== inputText) {
      setErroredMatchID("");
    }
    setInputText(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedText = inputText.trim();
    if (trimmedText) {
      const match = await getMatchDataByIDForSelectedGame(trimmedText);
      if (!match || !match?.matchID) {
        setErroredMatchID(trimmedText);
      }
    }
  };
  const inputHtmlId = `get-match-matchID-input`;

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor={inputHtmlId}>
          {`Find a match by ID: `}
          <input
            type="text"
            onChange={handleTextInputChange}
            value={inputText}
            id={inputHtmlId}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {erroredMatchID && getMatchByIDError ? (
        <p style={{ color: "red" }}>
          Error - The search for match <code>{erroredMatchID}</code> has failed:{" "}
          {getMatchByIDError}
        </p>
      ) : null}
    </>
  );
};
