import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are bundled, not loaded from Google: the app works offline and makes no outside requests
import '@fontsource/cinzel/600.css'
import '@fontsource/cinzel/700.css'
import '@fontsource/cinzel-decorative/700.css'
import './theme.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
