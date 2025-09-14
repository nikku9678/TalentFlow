import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

async function enableMocksAndRender() {
  if (process.env.NODE_ENV === 'development') {
    // Dynamically import MSW worker + seed
    const { initMocks } = await import('./mock/browser')
    await initMocks()
  }
  
  // Once MSW & seed are ready, mount React
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}

enableMocksAndRender()
