import { createRoot } from 'react-dom/client'
import './shared/styles/index.scss'
import App from './App.tsx'
import './i18n.js'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
