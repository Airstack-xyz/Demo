import { useState } from "react";

export function Header({
  onSubmit,
  disabled,
}: {
  onSubmit: (query: string) => void;
  disabled: boolean;
}) {
  const [query, setQuery] = useState("vitalik.eth");
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onSubmit(query);
  };
  return (
    <header>
      <a
        className="get-sdk-link"
        href="https://docs.airstack.xyz/airstack-docs-and-faqs/quick-start-and-sdks"
        target="_blank"
      >
        Get SDKs
      </a>
      <div className="logo-n-heading-wrapper">
        <img className="logo" src="/logo.svg" width="190" />
        <h1>Get NFTs owned by any wallet</h1>
      </div>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Enter any wallet address/identity"
          type="text"
          required
          minLength={3}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          disabled={disabled}
        />
        <button disabled={disabled}>Go</button>
      </form>
    </header>
  );
}
