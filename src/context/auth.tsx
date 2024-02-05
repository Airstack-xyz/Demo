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
import { LoginMutationMutation, MeQuery } from '../../__generated__/types';
import { meQuery } from '../queries/auth/me';
import { loginMutation } from '../queries/auth/login';
import { SignInModal } from '../Components/SignInModal';
import { encode } from '../utils/encode';

// eslint-disable-next-line
function noop() {}

export type User = MeQuery['Me'];

export type AuthContext = Omit<PrivyInterface, 'user' | 'login'> & {
  user?: User;
  loading: boolean;
  loggedIn: boolean;
  getUser: () => void;
  privyUser?: PrivyInterface['user'];
  login: (showModal?: boolean) => void;
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
  const [showLoginModal, setShowLoginModal] = useState(false);
  const auth = usePrivy();
  const loginCompleted = useRef(false);

  const [me, setMe] = useState<User>(null);

  const [_getUser, { loading: userLoading }] = useAppQuery<MeQuery>(meQuery);

  const [login, { loading: loginInProgress }] =
    useAppQuery<LoginMutationMutation>(loginMutation);

  const authenticated = auth?.authenticated;
  const user = authenticated ? me : null;

  useLogin({
    onComplete: async (user, a, b) => {
      // eslint-disable-next-line no-console
      console.log(' login completed', user, a, b);
      if (loginCompleted.current) {
        return;
      }

      loginCompleted.current = true;
      const res = await login();

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

  const onLoginClick = useCallback(() => {
    setShowLoginModal(false);
    if (process.env.NODE_ENV === 'development') {
      auth.login();
      return;
    }
    const encodedUrl = encode(location.href);
    location.href = 'https://app.uat.airstack.xyz/login?origin=' + encodedUrl;
  }, [auth]);

  const value: AuthContext = useMemo(
    (): AuthContext => ({
      ...auth,
      privyUser: auth.user,
      user: user,
      loading: userLoading || loginInProgress,
      getUser,
      login: (showModal?: boolean) => {
        if (showModal) {
          setShowLoginModal(true);
          return;
        }
        onLoginClick();
      },
      logout,
      loggedIn: (user && user?.isProfileCompleted) || false
    }),
    [auth, user, userLoading, loginInProgress, getUser, logout, onLoginClick]
  );

  return (
    <authContext.Provider value={value}>
      {showLoginModal && (
        <SignInModal
          onRequestClose={() => {
            setShowLoginModal(false);
          }}
          onLogin={onLoginClick}
        />
      )}
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
