import { useState, useEffect } from "react";
import { Redirect, useLocation, Link } from "react-router-dom";

import { useAuth } from "hooks";

export const Login = () => {
  const [inputText, setInputText] = useState("");
  const handleTextInputChange = (e) => {
    setInputText(e.target.value);
  };
  const { isAuthenticated, storedCredentials, signin, signout } = useAuth();
  //   if we were redirected here, we'll redirect back once authenticated
  const location = useLocation();
  const wasRedirected = location?.state?.from?.pathname;
  const [redirect, setRedirect] = useState("");
  // when we weren't redirected, we're just changing our name then
  const [success, setSuccess] = useState("");

  // effect -- auto-fill input on auth change
  useEffect(() => {
    setInputText(storedCredentials?.playerName ?? "");
  }, [storedCredentials]);

  const handleSubmit = (e) => {
    e.preventDefault();
    signin(inputText);
    if (wasRedirected) {
      setRedirect(wasRedirected);
    } else {
      setSuccess(`Welcome ${inputText}!`);
    }
  };

  const inputHtmlId = `playerName`;

  if (redirect) {
    return (
      <Redirect
        to={{
          pathname: wasRedirected,
        }}
      />
    );
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        {wasRedirected && <p>You must sign in to go to "{wasRedirected}"</p>}
        <label htmlFor={inputHtmlId}>
          {isAuthenticated ? "Change your " : "Choose a "} player name:
          <input
            type="text"
            onChange={handleTextInputChange}
            value={inputText}
            id={inputHtmlId}
          />
        </label>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
      {success && (
        <p>
          {success}{" "}
          <Link to="/lobby" as="button">
            Go to Lobby
          </Link>
        </p>
      )}
      {isAuthenticated ? (
        <p>
          <button onClick={signout}>
            Sign out {`${storedCredentials?.playerName}`}
          </button>
        </p>
      ) : (
        <p>You are not signed in.</p>
      )}
    </div>
  );
};
