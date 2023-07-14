import { HomeSearch } from '../Components/SearchForHome';
import { Layout } from '../Components/layout';

export function Home() {
  return (
    <Layout>
      <div className="flex-1 h-full w-full flex flex-col items-center pt-[30%] text-center">
        <h1 className="text-2xl">AI-powered web3 developer APIs</h1>
        <HomeSearch />
      </div>
    </Layout>
  );
}
