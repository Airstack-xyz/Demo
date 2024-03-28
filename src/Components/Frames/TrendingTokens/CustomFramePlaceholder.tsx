export function CustomFramePlaceholder() {
  return (
    <div className="w-full h-full flex flex-col justify-between gap-5">
      <div className="flex-1 flex-col-center">
        <h2 className="pb-3 pt-3  text-bold leading-6 text-base font-bold">
          Swap Tokens on Base!
        </h2>
        <div className="size-56 border border-solid border-white rounded-18 flex-col-center text-xs">
          Select tokens above
        </div>
      </div>
      <div className="bg-[#292431] py-2 px-4">
        <button className="w-full rounded-lg h-9 font-semibold text-xs bg-[#3F3A46]">
          Placeholder button
        </button>
      </div>
    </div>
  );
}
