import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { GlassesProvider } from './context/GlassesContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <GlassesProvider>
        <App />
      </GlassesProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
