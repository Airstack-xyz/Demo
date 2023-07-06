function Poap() {
  return (
    <div className="flex rounded-lg glass-effect border border-solid border-stroke-color mb-5 overflow-hidden">
      <div className="h-36 w-36">
        <img src="images/temp-poap.png" />
      </div>
      <div className="flex flex-1 flex-col justify-center p-4 glass-effect">
        <div className="font-semibold">Adidas event day</div>
        <div className="text-sm text-text-secondary mt-1.5">
          09 August, 2022{' '}
        </div>
        <div className="text-sm text-text-secondary mt-1.5">
          Bangalore, India
        </div>
      </div>
    </div>
  );
}

export function Poaps() {
  return (
    <div className="mt-11">
      <div className="mb-3.5">POAPs</div>
      <div>
        <Poap />
        <Poap />
        <Poap />
      </div>
    </div>
  );
}
