import {
  PrivyClientConfig,
  PrivyInterface,
  PrivyProvider,
  useLogin,
  usePrivy
} from '@privy-io/react-auth';
import {
  ReactNode,
  createContext,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import { useAppQuery } from '../hooks/useAppQuery';
import { MeQuery as MeQueryType, Mutation } from '../../__generated__/types';
import { MeQuery } from '../queries/auth/me';
import { LoginMutation } from '../queries/auth/login';

// eslint-disable-next-line
function noop() {}

export type User = MeQueryType['Me'];

export type AuthContext = Omit<PrivyInterface, 'user' | 'login'> & {
  user?: User;
  loading: boolean;
  loggedIn: boolean;
  getUser: () => void;
  privyUser?: PrivyInterface['user'];
  login: () => void;
};

const defaultState = {
  user: null,
  loading: false,
  getUser: noop
} as AuthContext;

// eslint-disable-next-line react-refresh/only-export-components
export const authContext = createContext<AuthContext>(defaultState);

const newLocal = '/images/icons/logo-login.svg';
const config: PrivyClientConfig = {
  appearance: {
    theme: 'dark',
    logo: newLocal
  }
};

type AuthProviderProps = {
  children: ReactNode;
};

function Provider({ children }: AuthProviderProps) {
  const auth = usePrivy();
  const loginCompleted = useRef(false);

  const [me, setMe] = useState<User>(null);

  const [_getUser, { loading: userLoading }] =
    useAppQuery<MeQueryType>(MeQuery);

  const [loginMutation, { loading: loginInProgress }] =
    useAppQuery<Mutation>(LoginMutation);

  const authenticated = auth?.authenticated;
  const user = authenticated ? me : null;
  // eslint-disable-next-line no-console
  console.log({ auth });

  useLogin({
    onComplete: async (user, a, b) => {
      // eslint-disable-next-line no-console
      console.log(' login completed', user, a, b);
      if (loginCompleted.current) {
        return;
      }

      loginCompleted.current = true;
      const res = await loginMutation();

      if (res.data?.Login) {
        setMe(res.data.Login);
      }
    },
    onError: error => {
      // eslint-disable-next-line no-console
      console.log('error when login with privy, ', error);
    }
  });

  const getUser = useCallback(async () => {
    const { data } = await _getUser();
    if (data?.Me) {
      setMe(data.Me);
    }
  }, [_getUser]);

  const logout = useCallback(async () => {
    await auth.logout();
    setMe(null);
  }, [auth]);

  const value: AuthContext = useMemo(
    (): AuthContext => ({
      ...auth,
      privyUser: auth.user,
      user: user,
      loading: userLoading || loginInProgress,
      getUser,
      login: () => {
        location.href =
          'https://app.dev.airstack.xyz/login?origin=' + location.href;
      },
      logout,
      loggedIn: (user && user?.isProfileCompleted) || false
    }),
    [auth, user, userLoading, loginInProgress, getUser, logout]
  );

  return (
    <authContext.Provider value={value}>
      {auth.ready ? children : null}
    </authContext.Provider>
  );
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <PrivyProvider appId={process.env.PRIVY_APP_ID as string} config={config}>
      <Provider>{children}</Provider>
    </PrivyProvider>
  );
}
