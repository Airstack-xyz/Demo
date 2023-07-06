function Social() {
  return (
    <div className="flex items-center text-sm mb-7">
      <div className="flex items-center flex-1">
        <div className="rounded-full h-6 w-6 border border-solid border-stroke-color mr-2"></div>
        Primary ENS
      </div>
      <div className="text-text-secondary w-1/3">vitalik.eth</div>
    </div>
  );
}

export function Socials() {
  return (
    <div>
      <div>Socials</div>
      <div className="bg-secondary rounded-lg p-5 border border-solid border-stroke-color mt-3.5">
        <Social />
        <Social />
        <Social />
      </div>
    </div>
  );
}
