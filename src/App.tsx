import { GameProvider } from './ui/GameProvider'
import { PlayScreen } from './ui/screens/PlayScreen'

export default function App() {
  return (
    <GameProvider>
      <PlayScreen />
    </GameProvider>
  )
}
