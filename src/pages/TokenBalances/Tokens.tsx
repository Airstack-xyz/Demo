function Token() {
  return (
    <div className="h-72 w-72 rounded-xl bg-secondary p-2.5 flex flex-col justify-between bg-[url('/images/temp.png')]">
      <div className="flex justify-end">
        <div className="rounded-full h-9 w-9 border-solid border-stroke-color border glass-effect"></div>
        <div className="h-9 rounded-3xl ml-2.5 border border-solid border-stroke-color flex justify-center items-center px-2 glass-effect">
          ERC721
        </div>
      </div>
      <div className="h-14 rounded-3xl ml-2.5 border border-solid border-stroke-color flex flex-col px-3.5 py-2 text-sm glass-effect">
        <div>Swing swingers</div>
        <div className="flex items-center justify-between">
          <div>#6721</div>
          <div>SSW</div>
        </div>
      </div>
    </div>
  );
}

export function Tokens() {
  return (
    <div>
      <div>Tokens</div>
      <div className="grid grid-cols-3 gap-11 mt-3.5">
        <Token />
        <Token />
        <Token />
      </div>
    </div>
  );
}
