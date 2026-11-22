import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import './App.css'
import App from './App.tsx'

document.documentElement.classList.add('js');

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 2, refetchOnReconnect: true } },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}><App /></QueryClientProvider>
  </StrictMode>,
)
