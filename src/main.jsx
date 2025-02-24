import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import CrowdbopApp from './structural/CrowdbopApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CrowdbopApp />
  </StrictMode>,
)
