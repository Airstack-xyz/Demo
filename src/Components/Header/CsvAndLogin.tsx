'use client';
import { useAuth } from '@/hooks/useAuth';
import { CSVDownloads } from '../CSVDownload/CSVDownloads';
import { Profile } from '../Profile';
import { AuthProvider } from '@/context/auth';

function CsvAndLoginComponent() {
  const { user, login } = useAuth();
  return (
    <>
      {user && <CSVDownloads />}
      {user ? (
        <Profile />
      ) : (
        <button
          className="h-[30px] border border-solid border-white px-5 rounded-18 hover:opacity-90"
          onClick={() => {
            login();
          }}
        >
          Sign In
        </button>
      )}
    </>
  );
}

export function CsvAndLogin() {
  return (
    <AuthProvider>
      <CsvAndLoginComponent />
    </AuthProvider>
  );
}
