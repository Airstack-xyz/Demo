import "../App.css";

import { List } from "../Components/List";
import { Header } from "../Components/Header";
import { useState } from "react";
import { POAPs } from "../Components/POAPs";

function TokenList() {
  const [owner, setOwner] = useState("");

  const handleSubmit = (owner: string) => {
    console.log(" owner ", owner);
    setOwner(owner);
  };

  return (
    <>
      <Header onSubmit={handleSubmit} disabled={false} />
      <main>
        {owner && (
          <div className="lists-wrapper">
            <List owner={owner} />
            <POAPs owner={owner} />
          </div>
        )}
      </main>
    </>
  );
}

export default TokenList;
