import './App.css';
/*
  STEP 1: Import init function from airstack-web-sdk
*/
import { init } from '@airstack/airstack-react';
import { Router } from './router/router';
import { SearchProvider } from './context/search';
import { apiKey } from './constants';

/*
  STEP 2:
  Init the Airstack SDK with the API key. The API key can be found here https://app.airstack.xyz/
  Please note read the API key from environment variable. This is just for demo purpose.
*/
init(apiKey, {
  env: 'dev',
  cancelHookRequestsOnUnmount: true
}); // for demo "ef3d1cdeafb642d3a8d6a44664ce566c"

function App() {
  return (
    <SearchProvider>
      <Router />
    </SearchProvider>
  );
}

export default App;
