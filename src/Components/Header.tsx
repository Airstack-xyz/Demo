export function Header() {
  return (
    <header className="fixed bg-secondary py-4 w-full z-10 flex justify-center top-0">
      <div className="max-w-[1440px] w-full flex items-center justify-between px-8">
        <img src="/logo.svg" className="h-[33px]" />
        <div className="flex-row-center">
          <a
            className="text-text-button font-bold hover:bg-primary px-7 py-2 rounded-md  mr-2"
            href="https://app.airstack.xyz/"
            target="_blank"
          >
            API
          </a>
          <a
            className="text-text-button font-bold hover:bg-primary px-7 py-2 rounded-md"
            href="https://docs.airstack.xyz/airstack-docs-and-faqs/quick-start-and-sdks"
            target="_blank"
          >
            SDK
          </a>
        </div>
      </div>
    </header>
  );
}
