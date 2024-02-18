import { useContext } from 'react';
import { AuthContext, authContext } from '../context/auth';

export function useAuth(): AuthContext {
  return useContext(authContext);
}
