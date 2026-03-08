import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AtomicShopApp } from './AtomicShop-App'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AtomicShopApp />
  </StrictMode>,
)
