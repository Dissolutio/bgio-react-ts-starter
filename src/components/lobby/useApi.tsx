import React from "react";
// !! WORK IN PROGRESS
// ? How to accurately type the data of AsyncData ?
// ? And the params for fetchMethod to get passed to apiFunction ?
type AsyncData = {
  data: any;
  hasErrors: boolean;
  isFetching: boolean;
  isSuccess: boolean;
};

export function useApi(apiFunction): [AsyncData, () => Promise<void>] {
  const [response, setResponse] = React.useState({
    data: null,
    hasErrors: false,
    isFetching: false,
    isSuccess: false,
  });

  const fetchMethod = async () => {
    setResponse((prevState) => ({
      ...prevState,
      isFetching: true,
    }));
    try {
      const apiData = await apiFunction();
      setResponse({
        data: apiData,
        isFetching: false,
        hasErrors: false,
        isSuccess: true,
      });
    } catch (error) {
      setResponse({
        data: null,
        isFetching: false,
        hasErrors: true,
        isSuccess: false,
      });
    }
  };

  return [response, fetchMethod];
}

// const [bgioGames, getBgioGames] = useApi(lobbyClient.listGames);
//   async function bgioGetGames() {
//     try {
//       getBgioGames();
//       const games = bgioGames.data;
//       if (games) {
//         setAvailableGamesError("");
//         setAvailableGames(games);
//         return games;
//       }
//     } catch (error) {
//       console.log(`🚀 ~ bgioGetGames ~ error`, error);
//       return error;
//     }
//   }
