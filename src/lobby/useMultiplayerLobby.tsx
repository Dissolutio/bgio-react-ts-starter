import React, { useState, useEffect } from "react"
import { LobbyAPI } from "boardgame.io"

import { useBgioLobbyApi } from "../bgio-contexts/useBgioLobbyApi"
import { useAuth } from "hooks"
import { defaultSetupData, MYGAME_NUMPLAYERS } from "game/game"

type MultiplayerLobbyCtxValue = {
  // lobby state
  lobbyGames: string[]
  lobbyMatches: { [gameName: string]: LobbyAPI.Match[] }
  lobbyMatchesError: {
    [gameName: string]: string
  }
  selectedGame: string
  selectedMatch: LobbyAPI.Match
  // requests
  updateLobbyMatchesForSelectedGame: () => Promise<LobbyAPI.MatchList>
  updateLobbyGames: () => Promise<void>
  handleSelectGameChange: (e) => void
  handleCreateMatchButton: () => Promise<void>
  handleJoinMatch: (params: {
    playerID: string
    matchID?: string
  }) => Promise<void>
  handleLeaveJoinedMatch: () => Promise<void>
  handleVerifyJoinedMatch: () => Promise<void>
  // request statuses
  lobbyGamesError: string
  createMatchError: string
  verifyMatchSuccess: string
  verifyMatchError: string
}
type MultiplayerLobbyProviderProps = {
  children: React.ReactNode
}

const MultiplayerLobbyContext = React.createContext<
  MultiplayerLobbyCtxValue | undefined
>(undefined)

export function MultiplayerLobbyProvider({
  children,
}: MultiplayerLobbyProviderProps) {
  const { updateCredentials, storedCredentials, isAuthenticated } = useAuth()
  const {
    getLobbyGames,
    getLobbyMatches,
    getMatch,
    createMatch,
    joinMatch,
    leaveMatch,
    updatePlayer,
  } = useBgioLobbyApi()
  const joinedMatchID = storedCredentials?.matchID

  // STATE
  const [lobbyGames, setLobbyGames] = useState<string[]>([])
  const [lobbyGamesError, setLobbyGamesError] = useState("")
  const [lobbyMatches, setLobbyMatches] = useState<{
    [gameName: string]: LobbyAPI.Match[]
  }>({})
  const [lobbyMatchesError, setLobbyMatchesError] = useState<{
    [gameName: string]: string
  }>({})
  const [verifyMatchSuccess, setVerifyMatchSuccess] = useState("")
  const [verifyMatchError, setVerifyMatchError] = useState("")
  const [createMatchError, setCreateMatchError] = useState("")
  const [selectedGame, setSelectedGame] = useState("")
  const [selectedMatch, setSelectedMatch] = useState<
    LobbyAPI.Match | undefined
  >(undefined)

  // effect -- initial fetch games
  useEffect(() => {
    updateLobbyGames()
    // eslint reason: Only want to fetch games on mount for now.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // effect -- auto-select first game (once they're fetched)
  useEffect(() => {
    const firstAvailableGame = lobbyGames?.[0]
    if (firstAvailableGame && !selectedGame) {
      setSelectedGame(firstAvailableGame)
    }
  }, [lobbyGames, selectedGame])

  // effect -- fetch matches on game select (including initial auto-selection)
  useEffect(() => {
    if (selectedGame) {
      updateLobbyMatchesForSelectedGame()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGame])

  // effect - verify currently joined match once games list is received (and first is auto-selected)
  React.useEffect(() => {
    if (Boolean(storedCredentials.matchID)) {
      handleVerifyJoinedMatch()
    }
  }, [storedCredentials])

  async function updateLobbyGames() {
    setLobbyGamesError("")
    try {
      const games = await getLobbyGames()
      if (games) {
        setLobbyGamesError("")
        setLobbyGames(games)
      }
    } catch (error) {
      setLobbyGamesError(error.message)
      console.log(`🚀 ~ getLobbyGames ~ error`, error)
    }
  }
  async function updateLobbyMatchesForSelectedGame() {
    try {
      const matches = await getLobbyMatches(selectedGame)
      if (matches) {
        setLobbyMatchesError((s) => ({
          ...s,
          [selectedGame]: undefined,
        }))
        setLobbyMatches((s) => ({ ...s, [selectedGame]: matches.matches }))
        return matches
      }
    } catch (error) {
      setLobbyMatchesError((s) => ({ ...s, [selectedGame]: error.message }))
      console.log(`🚀 ~ getLobbyMatches ~ error`, error)
    }
  }
  // handler verify currently joined match
  async function handleVerifyJoinedMatch() {
    const {
      playerName,
      gameName,
      matchID,
      playerID,
      playerCredentials,
    } = storedCredentials
    // refresh our credentials with no changes (ping)
    return updatePlayer(gameName, matchID, {
      playerID,
      credentials: playerCredentials,
      newName: playerName,
      // data: {},
    }).then(
      (success) => {
        setVerifyMatchSuccess(`You have a game to play!`)
        setVerifyMatchError("")
      },
      (failure) => {
        setVerifyMatchSuccess("")
        setVerifyMatchError(`${failure}`)
      }
    )
  }
  // handler select game
  const handleSelectGameChange = (e) => {
    setSelectedGame(e.target.value)
  }

  // handler createMatch- create a match, then select it (which refreshes the match), then join it
  async function handleCreateMatchButton() {
    // requires a username first
    if (!isAuthenticated) {
      setCreateMatchError(
        "You must login with a username before you can create a game"
      )
      return
    }
    try {
      const { matchID } = await createMatch(`${selectedGame}`, {
        setupData: defaultSetupData,
        numPlayers: MYGAME_NUMPLAYERS,
        unlisted: false,
      })
      if (matchID) {
        setCreateMatchError("")
        await handleJoinMatch({ playerID: "0", matchID })
        await updateLobbyMatchesForSelectedGame()
      }
    } catch (error) {
      setCreateMatchError(error.message)
      console.log(`🚀 ~ createMatch ~ error`, error)
    }
  }

  // join match, then save credentials, refresh match and confirm
  async function handleJoinMatch({
    playerID,
    matchID,
  }: {
    playerID: string
    matchID: string
  }) {
    const playerName = storedCredentials.playerName
    const gameName = selectedGame
    const { playerCredentials } = await joinMatch({
      gameName,
      matchID,
      options: {
        playerID,
        playerName,
      },
    })
    if (playerCredentials) {
      const newCredentials = {
        playerName,
        matchID,
        gameName,
        playerCredentials: `${playerCredentials}`,
        playerID,
      }
      //save joined match
      updateCredentials(newCredentials)
      // refresh match info
      const refreshedMatch = await getMatch(gameName, matchID)
      if (refreshedMatch) {
        //double check the server has matching player data
        const serverPlayer = refreshedMatch.players.find(
          (playerMetadata) => playerMetadata.id.toString() === playerID
        )
        const serverPlayerName = serverPlayer?.name
        const isConfirmedJoin = serverPlayerName === playerName
      }
    } else {
      console.log(`🚀 handleJoinMatch ~ FAILED TO JOIN`)
    }
  }

  // handle leave current match
  async function handleLeaveJoinedMatch() {
    const { gameName, matchID, playerID, playerCredentials } = storedCredentials
    updateCredentials({
      gameName: "",
      matchID: "",
      playerID: "",
      playerCredentials: "",
    })
    setVerifyMatchSuccess("")
    setVerifyMatchError("")
    try {
      await leaveMatch({
        gameName,
        matchID,
        options: { playerID, credentials: playerCredentials },
      })
    } catch (error) {
      console.log(`🚀 ~ handleLeaveJoinedMatch ~ error`, error)
    }
    await updateLobbyMatchesForSelectedGame()
  }

  return (
    <MultiplayerLobbyContext.Provider
      value={{
        lobbyGames,
        lobbyMatches,
        selectedGame,
        selectedMatch,
        lobbyGamesError,
        lobbyMatchesError,
        createMatchError,
        verifyMatchSuccess,
        verifyMatchError,
        updateLobbyGames,
        updateLobbyMatchesForSelectedGame,
        handleSelectGameChange,
        handleCreateMatchButton,
        handleJoinMatch,
        handleLeaveJoinedMatch,
        handleVerifyJoinedMatch,
      }}
    >
      {children}
    </MultiplayerLobbyContext.Provider>
  )
}

export function useMultiplayerLobby() {
  const context = React.useContext(MultiplayerLobbyContext)
  if (context === undefined) {
    throw new Error(
      "useMultiplayerLobby must be used within a MultiplayerLobbyProvider"
    )
  }
  return context
}
