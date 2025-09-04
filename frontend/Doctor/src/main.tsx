import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import './index.css';
import App from './App.tsx';
import appConfig from '../AppConfig.json';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

function loadApp() {
  document.title = "CareBridge - Doctor's Portal";
  document.head.innerHTML += `<meta name='version' content='${appConfig.version}+${appConfig.versionNumber}' />`;
  document.head.innerHTML += `<meta name='tob' content='${appConfig.timeOfBuild}'/>`;
}

loadApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);