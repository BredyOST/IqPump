import { createRoot } from 'react-dom/client'
import './shared/styles/index.scss'
import App from './App.tsx'
import './i18n.js'
import {StrictMode} from "react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
   </StrictMode>,
)
