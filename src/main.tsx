import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
//import App from './App.tsx'
import { SpriteExample } from './components/SpriteExample.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpriteExample />
  </StrictMode>,
)
