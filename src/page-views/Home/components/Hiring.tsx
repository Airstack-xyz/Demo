const openings = [
  {
    role: 'Backend Dev with Blockchain Experience',
    link: ''
  },
  {
    role: 'Lead Backend Dev with Blockchain Experience',
    link: ''
  },
  {
    role: 'Senior Blockchain Dev with Expertise in Subgraphs',
    link: ''
  },
  {
    role: 'Senior Rust Dev with Blockchain Experience',
    link: ''
  },
  {
    role: 'Software engineer in test',
    link: ''
  }
];

export function Hiring() {
  return (
    <div>
      <h2 className="text-center text-3xl mb-16"> We are hiring </h2>
      <ul className="grid grid-cols-2 gap-8">
        {openings.map((opening, index) => (
          <li key={index} className="card rounded-full">
            <a href={opening.link} className="px-7 h-14 flex-row-h-center">
              {opening.role} {'->'}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
