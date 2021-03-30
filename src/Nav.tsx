import { useAuth } from "hooks";
import { NavLink } from "react-router-dom";

export const MultiplayerNav = () => {
  const { storedCredentials } = useAuth();
  const isJoinedInMatch = Boolean(storedCredentials.matchID);
  return (
    <nav>
      <ul>
        <li>
          <NavLink exact to="/">
            Multiplayer Lobby
          </NavLink>
        </li>
        <li>
          <NavLink to="/demo">Demo</NavLink>
        </li>
        {isJoinedInMatch ? (
          <li>
            <NavLink to="/play">Play</NavLink>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};
