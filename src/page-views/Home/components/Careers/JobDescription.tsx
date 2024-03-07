import { Job, defaultBenifits, defaultLocationInfo } from './data';

function ListWithHeading({
  heading,
  options
}: {
  heading: string;
  options: string[];
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold text-white">{heading}</h2>
      <ul className="list-disc pl-5 text-[13px] mb-3 leading-7">
        {options.map((option, index) => (
          <li className="list-item" key={index}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function JobDescription({
  title,
  description,
  responsibilities,
  requirements,
  locationInfo,
  benifites
}: Job) {
  return (
    <div className="[&>*]:mb-5 leading-6 text-[13px] text-[#c3c5c6]">
      <h1 className=" text-lg font-bold text-white">{title}</h1>
      {description && (
        <div className="">
          <ul>
            {description.map((line, index) => (
              <li key={index} className="mb-5">
                {line}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="text-base">
        <span className="text-white">Send in your resume to</span> <br />
        <a
          href="malto:careers@airstack.xyz"
          className="text-text-button font-semibold"
        >
          careers@airstack.xyz
        </a>
      </div>
      <ListWithHeading heading="Responsibility" options={responsibilities} />
      <ListWithHeading heading="Requirements" options={requirements} />
      <ListWithHeading
        heading="Where"
        options={locationInfo || defaultLocationInfo}
      />
      <ListWithHeading
        heading="Benefits"
        options={benifites || defaultBenifits}
      />
      <div className="text-base">
        <span className="text-white">Send in your resume to</span> <br />
        <a
          href="malto:careers@airstack.xyz"
          className="text-text-button font-semibold"
        >
          careers@airstack.xyz
        </a>
      </div>
      <div className="pt-5">
        Airstack is committed to a diverse and inclusive workplace and is an
        equal opportunity employer. We do not discriminate on the basis of race,
        national origin, gender, gender identity, sexual orientation, protected
        veteran status, disability, age, or other legally protected status. ‍
      </div>
    </div>
  );
}
