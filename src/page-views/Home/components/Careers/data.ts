export type Job = {
  title: string;
  description?: string[];
  responsibilities: string[];
  requirements: string[];
  locationInfo?: string[];
  benifites?: string[];
};

export const defaultLocationInfo = [
  'We are a distributed workforce enabling everyone to find a work mode that is best for them! However, we prefer candidates located in the India IST timezone.'
];

export const defaultBenifits = [
  'Flexible vacation policy',
  'Competitive Salary',
  'Company stock options'
];

export const jobs: Job[] = [
  {
    title: 'Backend Developer with Blockchain Experience',
    responsibilities: [
      'This position requires a strong engineer to build out backend systems and API infrastructure for high-performance scalable systems',
      'Participate in all phases of the software development life cycle including the development of technical requirements, prototyping, coding, testing, deployment, and support',
      'Participate in defining the operating model including platform support, code reviews, production deployments, and implementing the security and infrastructure standards',
      'Interpret requirements to develop APIs and integrations using agile methodology',
      'Build, orchestrate, and deploy complex integration patterns between system, process, and experience layers of APIs',
      'Ensure that all code, configurations, and other work products are thoroughly unit-tested prior to delivery',
      'Perform code reviews and other quality checks as requested'
    ],
    requirements: [
      '3+ years of experience working within a similar role, building, testing, and deploying web services',
      'Good working knowledge of Go is a strong plus',
      'Experience working with Graphql APIs',
      'Comfortable building infrastructure components from (almost) scratch',
      'Comfortable debugging code in multiple languages (e.g. nodejs, go, python)',
      'Solid existing understanding of Web3 and blockchain technologies'
    ]
  },
  {
    title: 'Lead backend Engineer with Blockchain Experience',
    description: [
      'We are seeking a highly skilled and experienced Senior Backend Engineer to join our team and help us continue to innovate and develop world-class solutions for the web3 ecosystem.'
    ],
    responsibilities: [
      'Participate in the architecture and development of backend systems capable of handling terabytes of data on a daily basis',
      'Prepare and lead product releases while ensuring quality and performance',
      'Mentor other team members and contribute to their professional growth',
      'Design, architect, and implement engineering solutions to complex challenges',
      'Write high-performance distributed services and APIs',
      'Collaborate with cross-functional teams to deliver high-quality solutions'
    ],
    requirements: [
      '5+ years of experience developing back-end systems that have scaled to thousands of users',
      '5+ years of experience writing APIs and microservices',
      'Proficient in Golang',
      'Know how to write distributed, high-performance services',
      'Experience designing, architecting, and implementing engineering solutions',
      'Professional experience with git, code reviews, testing',
      'Experience working with Graphql APIs',
      'Strong interest in solving complex challenges and questioning the status quo',
      'Collaborative energy and ability to work well in teams',
      'Hands-on approach with a focus on delivering high-quality code',
      'A deep understanding of web3 verticals such as DeFi, NFTs, DAOs is a plus'
    ]
  },
  {
    title: 'Senior Blockchain Developer with Expertise in Subgraphs',
    description: [
      'We are looking for an experienced and highly motivated Senior Subgraph Developer who wants to lead Subgraph Development projects for Airstack.',
      'In this role you will be responsible for developing Subgraphs to the Airstack schemas, helping team members write better Subgraphs, and developing new Airstack schemas that enable consistent and unified indexing across projects in a vertical (e.g. NFT Marketplace, DeFi, Games, etc.)',
      'Important: this is a full-time position. We are only willing to employ team members who are 100% fully committed to Airstack. No freelance or contract work.'
    ],
    responsibilities: [
      'Developing, testing, deploying, publishing and maintaining high quality subgraphs to the Airstack schemas',
      'Translating customer requirements into Subgraphs that enable proper indexing to achieve those requirements',
      'Defining what data will be indexed from the blockchain and how it will be stored and made available',
      'Mentoring developers and helping them write better Subgraphs',
      'Authoring schemas that can be utilized across all dApps in a specified vertical (e.g. Social, DeFi, Marketplaces)',
      'Maintaining open source subgraph repository, facilitating & reviewing contributions from external developers'
    ],
    requirements: [
      'Previous experience building subgraphs at the senior developer level',
      'Strong understanding of blockchain technology, especially Ethereum/EVM based ones, Solidity, etc.',
      'Knowledge in AssemblyScript/TypeScript/GraphQL'
    ]
  },
  {
    title: 'Senior Rust Developer with Blockchain Expertise',
    description: [
      'We are seeking an experienced and highly motivated Senior Rust Developer to lead Subgraph development projects for Airstack. This full-time role requires a 100% commitment to Airstack, and we are not considering freelance or contract work.'
    ],
    responsibilities: [
      'Develop, test, deploy, publish, and maintain high-quality Subgraphs for Airstack schemas',
      'Translate customer requirements into Subgraphs & Substreams that enable proper indexing to achieve those requirements',
      'Define the data to be indexed from the blockchain, and how it will be stored and made available',
      'Mentor developers and help them write better Subgraphs',
      'Author schemas that can be utilized across all dApps in a specified vertical (e.g., Social, DeFi, Marketplaces)',
      'Maintain open-source subgraph repositories, facilitate and review contributions from external developers'
    ],
    requirements: [
      'Previous experience building subgraphs at the senior developer level',
      'Good working knowledge of Rust',
      'Strong understanding of blockchain technology, especially Ethereum/EVM-based ones, Solidity, etc.',
      'Knowledge in AssemblyScript/TypeScript/GraphQL',
      'Bonus: working knowledge of Substream technology'
    ]
  },
  {
    title: 'Software Engineer in Test',
    description: [
      'We are seeking an SDET to join our team and support the Senior SDET in the development and implementation of automated test frameworks for our blockchain API platform. The ideal candidate will have 2-3 years of hands-on experience with automated tests and frameworks for APIs, familiarity with GraphQL, automation testing (preferably python/Go), popular cloud technologies, and have at least basic knowledge of web3. You will fit into this role if you have an eye for delivering high-quality, high-performance & scalable software driven by automation.'
    ],
    responsibilities: [
      'You will assist the Senior SDET in ensuring the availability and reliability of our platform by implementing automated tests that run 24/7.',
      'Assist in writing and performing functional, system, performance, and scale tests.',
      'Support the maintenance of the Automation Framework and execute the Automation suite, reporting the results to all stakeholders.',
      'Assist in debugging and reporting test failures, and help identify the root cause of failures whenever possible.',
      'Contribute to setting cross-functional product testing standards.',
      'Ensure all test results are properly documented and capture all relevant information.',
      'Support the bi-weekly software development release cycle, ensuring proper testing is completed on new releases in a timely and accurate manner.',
      'Own product features end-to-end beginning with testing, automation, script error-free run in regression testing, and handling any related customer issues.'
    ],
    requirements: [
      'To be successful in this role you should have experience working in a fast-paced startup development environment.',
      'Proficiency with Python/go, Postman, GraphQL',
      'Have a working knowledge of how services are deployed/running on the cloud like AWS/GCP',
      'Sound knowledge of Blockchain. What is it and how does it work?',
      'Sense of ownership, passion to build, support, and maintain quality products on a massive scale in a collaborative, agile environment, and excitement to learn.',
      'Bonus: Experience with Ethereum EVM technologies'
    ]
  }
];
