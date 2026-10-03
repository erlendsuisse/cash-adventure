import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import { campaign } from '../content/campaign'
import { newGame } from '../engine/init'
import { reduce } from '../engine/reduce'
import type { Action, GameState } from '../engine/types'
import { createSave, loadFromLocalStorage, replay, saveToLocalStorage } from '../persist/save'

const CONTENT_VERSION = 'slice1'
const DEFAULT_SEED = 42

interface GameContextValue {
  state: GameState
  actions: Action[]
  dispatch: (action: Action) => void
  exportSave: () => string
}

const GameContext = createContext<GameContextValue | undefined>(undefined)

function loadInitial(): { state: GameState; actions: Action[]; seed: number } {
  const loaded = loadFromLocalStorage()
  if (loaded?.ok) {
    const { envelope } = loaded
    const state = replay(envelope.seed, envelope.actions, campaign)
    return { state, actions: envelope.actions, seed: envelope.seed }
  }
  return { state: newGame(DEFAULT_SEED, campaign), actions: [], seed: DEFAULT_SEED }
}

interface GameAndActions {
  state: GameState
  actions: Action[]
  seed: number
}

function gameReducer(prev: GameAndActions, action: Action): GameAndActions {
  const state = reduce(prev.state, action, campaign)
  const seed = action.type === 'restart' ? action.seed : prev.seed
  const actions = action.type === 'restart' ? [] : [...prev.actions, action]
  return { state, actions, seed }
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [{ state, actions, seed }, dispatch] = useReducer(gameReducer, undefined, loadInitial)
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      saveToLocalStorage(createSave(seed, actions, state, CONTENT_VERSION))
    }, 300)
    return () => clearTimeout(saveTimer.current)
  }, [state, actions, seed])

  const value = useMemo<GameContextValue>(
    () => ({
      state,
      actions,
      dispatch,
      exportSave: () => JSON.stringify(createSave(seed, actions, state, CONTENT_VERSION), null, 2),
    }),
    [state, actions, seed],
  )

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame(): GameContextValue {
  const value = useContext(GameContext)
  if (!value) throw new Error('useGame must be used within a GameProvider')
  return value
}
