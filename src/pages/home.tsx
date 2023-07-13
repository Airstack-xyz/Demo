import { HomeSearch } from '../Components/SearchForHome';

export function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center text-center">
      <h1 className="text-2xl font-bold">AI-powered web3 developer APIs</h1>
      <HomeSearch />
    </div>
  );
}
