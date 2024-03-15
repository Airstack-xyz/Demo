import { Image } from '@/Components/Image';
import { Link } from './Link';

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
    link: 'https://warpcast.com/betashop.eth'
  },
  {
    name: 'linkedin',
    link: 'https://www.linkedin.com/in/jasonsethgoldberg/'
  },
  {
    name: 'twitter',
    link: 'https://twitter.com/betashop'
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
    name: 'Gopi Bathala',
    title: 'Lead Backend & Blockchain Developer'
  },
  {
    name: 'Litsa Vintzileou',
    title: 'Senior Designer'
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
    name: 'Hrishikesh Thakkar',
    title: 'Senior Full Stack Blockchain Developer'
  },
  {
    name: 'Manjeet Thadani',
    title: 'Lead DevOps Engineer'
  },
  {
    name: 'Vigneshwaran',
    title: 'Senior Full Stack Blockchain Developer'
  },
  {
    name: 'Sarvesh Singh',
    title: 'Senior SDET',
    image: 'sarvesh-singh.png'
  },
  {
    name: 'Aadil Hasan',
    title: 'Lead Frontend Developer'
  },
  {
    name: 'Himanshu Bisht',
    title: 'Senior DevOps Engineer'
  },
  {
    name: 'Deepak Kumar',
    title: 'Talent Acquisition Manager'
  },
  {
    name: 'Felipe Estrella',
    title: 'Senior DevOps Engineer'
  },
  {
    name: 'Alex Comeau',
    title: 'Business Development Lead'
  },
  {
    name: 'Prashant Garg',
    title: 'Lead Backend & AI/ML Developer'
  },
  {
    name: 'Yoseph Soenggoro',
    title: 'Senior Developer Success Engineer'
  },
  {
    name: 'Tim Mustafin',
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
    name: 'David Wu Finkelstein',
    title: 'Head of Growth'
  },
  {
    name: 'Arjun Dhar',
    title: 'Software Development Engineer'
  },
  {
    name: 'Akash Yadav',
    title: 'Software Development Engineer'
  },
  {
    name: 'Bhasker Jha',
    title: 'Senior SDET'
  },
  {
    name: 'Harshit Ajmani',
    title: 'Senior ML/AI developer'
  }
];

const imageBasePath = 'images/team/';
export function Team() {
  return (
    <div>
      <h2 className="text-center text-[22px] sm:text-3xl mb-16 font-semibold">
        Meet Our Team
      </h2>
      <ul className="flex items-center justify-center gap-12 flex-wrap text-left">
        {teamMembers.map((member, index) => {
          const img = member.image
            ? `${imageBasePath}${member.image}`
            : `${imageBasePath}${member.name.split(' ')[0].toLowerCase()}.png`;
          return (
            <li key={index} className="w-[148px] h-[200px] leading-4">
              <Image
                src={img}
                height={148}
                width={148}
                loading="lazy"
                className="rounded-18 mb-2"
              />
              <h3 className="text-sm font-bold">{member.name}</h3>
              <p className="text-xs text-[#868D94]">{member.title}</p>
              {member.socials && (
                <ul className="mt-1 flex-row-h-center">
                  {member.socials?.map((social, index) => {
                    return (
                      <li key={index} className="mr-2.5">
                        <Link to={social.link}>
                          <Image
                            src={`images/team/socials/${social.name}.svg`}
                            height={16}
                            width={16}
                            loading="lazy"
                            className="h-auto"
                          />
                        </Link>
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
