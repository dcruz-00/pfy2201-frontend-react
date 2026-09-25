import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Bootstrap antes que los estilos propios, para que estos lo sobrescriban.
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles.css'

// Build ESM de Bootstrap (no el bundle): los componentes importan Collapse y
// Carousel desde el mismo módulo. Cargar ambos duplicaría los listeners.
import 'bootstrap'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
