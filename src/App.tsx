import './App.css';

import { init } from '@airstack/airstack-react';
import { Router } from './router/router';
import { SearchProvider } from './context/search';
import { apiKey } from './constants';
import { AuthProvider } from './context/auth';

console.log('API_KEY: ', { apiKey, API_KEY: process.env.API_KEY });

init(apiKey, {
  cancelHookRequestsOnUnmount: true
});

function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <Router />
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;
