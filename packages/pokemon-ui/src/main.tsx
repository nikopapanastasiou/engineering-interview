import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';

import App from './app/app';
import { AuthProvider } from './app/state/auth';
import { TeamProvider } from './app/state/teams';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <AuthProvider>
      <TeamProvider>
        <App />
      </TeamProvider>
    </AuthProvider>
  </StrictMode>
);
