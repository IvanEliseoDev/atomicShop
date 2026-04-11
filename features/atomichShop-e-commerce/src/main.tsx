import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {AtomicShopEcommerce} from './AtomicShopEcommerce-app.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AtomicShopEcommerce />
  </StrictMode>,
)
