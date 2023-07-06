export function Search() {
  return (
    <div>
      <div className="my-6 text-center">
        <button className="mr-8">wallet</button>
        <button>token</button>
      </div>
      <div className="flex">
        <div className="flex items-center rounded-xl bg-secondary overflow-hidden h-[50px] w-[645px] border">
          <span className="bg-tertiary h-full flex justify-center items-center px-4">
            Token Blaances
          </span>
          <input
            placeholder="Enter 0x, name.eth, fc_fname:name, or name.lens"
            type="text"
            className="h-full flex-1 bg-secondary px-4 text-text-secondary"
          />
        </div>
        <button className="bg-button-primary rounded-xl ml-5 px-6">Go</button>
      </div>
    </div>
  );
}
