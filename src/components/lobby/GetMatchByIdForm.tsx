import { useState } from "react";
interface Props {
  getMatchDataByIDForSelectedGame: (string) => void;
  getMatchByIDError: string;
}

export const GetMatchByIdForm = (props: Props) => {
  const { getMatchDataByIDForSelectedGame, getMatchByIDError } = props;

  const [inputText, setInputText] = useState("");

  const handleTextInputChange = (e) => {
    setInputText(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    getMatchDataByIDForSelectedGame(inputText.trim());
    // setInputText("");
  };
  const inputHtmlId = `get-match-match-id-input`;

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
      {getMatchByIDError && (
        <p style={{ color: "red" }}>
          Error - Failed to find match by ID: {`${getMatchByIDError}`}
        </p>
      )}
    </>
  );
};
