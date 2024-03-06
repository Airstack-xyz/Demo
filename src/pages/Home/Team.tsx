import { Image } from '@/Components/Image';

type Social = {
  name: string;
  link: string;
};
type Member = {
  name: string;
  title: string;
  image?: string;
  socials?: Social[];
};

const jasonSocials: Social[] = [
  {
    name: 'farcaster',
    link: ''
  },
  {
    name: 'linkedin',
    link: ''
  },
  {
    name: 'twitter',
    link: ''
  }
];

const teamMembers: Member[] = [
  {
    name: 'Jason Goldberg',
    title: 'Product Lead & CEO',
    socials: jasonSocials
  },
  {
    name: 'Deepesh KN',
    title: 'Chief Technology Officer'
  },
  {
    name: 'Sarvesh Jain',
    title: 'Director Blockchain',
    image: 'sarvesh-jain.png'
  },
  {
    name: 'Ignas Peciura',
    title: 'Head of Operations'
  },
  {
    name: 'Vysakh G Nair',
    title: 'Senior Product Designer'
  },
  {
    name: 'Litsa Vintzileou',
    title: 'Senior Designer'
  },
  {
    name: 'David Wu Finkelstein',
    title: 'Head of Growth'
  },
  {
    name: 'Alex Comeau',
    title: 'Business Development Lead'
  },
  {
    name: 'Gopi Bathala',
    title: 'Lead Backend & Blockchain Developer'
  },
  {
    name: 'Manjeet Thadani',
    title: 'Lead DevOps Engineer'
  },
  {
    name: 'Prashant Garg',
    title: 'Lead Backend & AI/ML Developer'
  },
  {
    name: 'Aadil Hasan',
    title: 'Lead Frontend Developer'
  },
  {
    name: 'Sarvesh Singh',
    title: 'Senior SDET',
    image: 'sarvesh-singh.png'
  },
  {
    name: 'Vigneshwaran',
    title: 'Senior Full Stack Blockchain Developer'
  },
  {
    name: 'Hrishikesh Thakkar',
    title: 'Senior Full Stack Blockchain Developer'
  },
  {
    name: 'Yoseph Soenggoro',
    title: 'Senior Developer Success Engineer'
  },
  {
    name: 'Deepak Kumar',
    title: 'Talent Acquisition Manager'
  },
  {
    name: 'Himanshu Bisht',
    title: 'Senior DevOps Engineer'
  },
  {
    name: 'Tim Mustafin',
    title: 'Senior DevOps Engineer'
  },
  {
    name: 'Felipe Estrella',
    title: 'Senior DevOps Engineer'
  },
  {
    name: 'Chetan Kumar',
    title: 'Senior Blockchain Developer'
  },
  {
    name: 'Yash Choube',
    title: 'Senior SDET'
  },
  {
    name: 'Kaushal Meena',
    title: 'Senior Software Development Engineer'
  },
  {
    name: 'Harshit Ajmani',
    title: 'Senior ML/AI developer'
  },
  {
    name: 'Bhasker Jha',
    title: 'Senior SDET'
  },
  {
    name: 'Sharath V',
    title: 'Full Stack Blockchain Developer'
  },
  {
    name: 'Rahul Gupta',
    title: 'Full Stack Blockchain Developer'
  },
  {
    name: 'Arjun Dhar',
    title: 'Software Development Engineer'
  },
  {
    name: 'Akash Yadav',
    title: 'Software Development Engineer'
  }
];

const imageBasePath = 'images/team/';
export function Team() {
  return (
    <div>
      <h2 className="text-center text-3xl mb-16">Meet Our Team</h2>
      <ul className="flex items-center justify-center gap-12 flex-wrap text-left">
        {teamMembers.map((member, index) => {
          const img = member.image
            ? `${imageBasePath}${member.image}`
            : `${imageBasePath}${member.name.split(' ')[0].toLowerCase()}.png`;
          return (
            <li key={index} className="w-[148px] leading-4">
              <Image
                src={img}
                height={148}
                width={148}
                className="rounded-18 mb-2"
              />
              <h3 className="text-xs font-bold">{member.name}</h3>
              <p className="text-[10px] text-[#868D94]">{member.title}</p>
              {member.socials && (
                <ul className="mt-0.5 flex-row-h-center">
                  {member.socials?.map((social, index) => {
                    return (
                      <li key={index} className="mr-1">
                        <a href={social.link}>
                          <Image
                            src={`images/team/socials/${social.name}.svg`}
                            height={11}
                            width={11}
                          />
                        </a>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
