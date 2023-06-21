import "../App.css";

import { Tokens } from "../Components/Tokens";
import { Header } from "../Components/Header";
import { useState } from "react";
import { POAPs } from "../Components/POAPs";

function TokenList() {
  const [owner, setOwner] = useState("");

  const handleSubmit = (owner: string) => {
    setOwner(owner);
  };

  return (
    <>
      <Header onSubmit={handleSubmit} disabled={false} />
      {owner && (
        <main>
          <div className="lists-wrapper">
            <Tokens owner={owner} />
            <POAPs owner={owner} />
          </div>
        </main>
      )}
    </>
  );
}

export default TokenList;
