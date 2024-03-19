import Accordion from '@/Components/Accordion';
import { isMobileDevice } from '@/utils/isMobileDevice';
import { useState } from 'react';

const faqs: {
  question: string;
  answer: string;
}[] = [
  {
    question: 'How are prizes awarded?',
    answer:
      'The top 50 point earners at 12pm ET on 25 March, 2024 will share 100,000 $DEGEN proportionally. Future prizes to be announced.'
  },
  {
    question: 'How do I earn points?',
    answer:
      'You earn points every time you swap in the Airstack Degen Alpha frame on Farcaster, or if other users swap from your referrals.'
  },
  {
    question: 'How are referral points earned?',
    answer:
      'Click “share frame” in the Airstack Degen Alpha frame to create an original cast with the Frame. Whenever someone swaps from your frame you will automatically earn referral points.'
  },
  {
    question: 'What if I recast the Frame?',
    answer:
      'Referral points accrue to the person whose cast the Frame is originally in. If someone recasts your original cast of the frame, you get the points.'
  },
  {
    question: 'How many points are earned?',
    answer: `Points are earned at the rate of 40,000 per ETH swapped.
    If you swap:
    .001 ETH = 40 points
    0.1 ETH = 4,000 points
    1 ETH = 40,000 points

    Referral points are earned at the same rate.
    If they swap .001 ETH = you get 40 points
    If they swap 0.1 ETH = you get 4,000 points
    If they swap 1 ETH = you get 40,000 points`
  },
  {
    question: 'How can I trust this?',
    answer:
      'ItU+2019s backed by Airstack, all transactions are onchain, and is entirely safe.'
  }
];

const FaqIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
  >
    <path
      d="M13.6363 1H4.36361C3.33929 1.00123 2.35728 1.40868 1.63298 2.13298C0.908679 2.85728 0.501227 3.83929 0.5 4.86361V11.0454C0.501124 11.9357 0.809158 12.7984 1.37219 13.4882C1.93521 14.1779 2.7188 14.6524 3.59089 14.8317V17.2272C3.59087 17.3671 3.62882 17.5043 3.70071 17.6243C3.7726 17.7444 3.87572 17.8426 3.99907 17.9086C4.12242 17.9746 4.26137 18.0059 4.4011 17.9991C4.54083 17.9923 4.6761 17.9477 4.79247 17.8701L9.23176 14.909H13.6363C14.6606 14.9078 15.6426 14.5003 16.3669 13.776C17.0912 13.0517 17.4987 12.0697 17.4999 11.0454V4.86361C17.4987 3.83929 17.0912 2.85728 16.3669 2.13298C15.6426 1.40868 14.6606 1.00123 13.6363 1ZM8.99994 12.5908C8.84711 12.5908 8.69771 12.5455 8.57064 12.4606C8.44357 12.3757 8.34453 12.255 8.28604 12.1138C8.22755 11.9726 8.21225 11.8173 8.24207 11.6674C8.27188 11.5175 8.34548 11.3798 8.45355 11.2717C8.56161 11.1636 8.6993 11.09 8.84919 11.0602C8.99908 11.0304 9.15445 11.0457 9.29565 11.1042C9.43685 11.1627 9.55753 11.2617 9.64244 11.3888C9.72734 11.5159 9.77266 11.6653 9.77266 11.8181C9.77266 12.023 9.69125 12.2196 9.54634 12.3645C9.40143 12.5094 9.20488 12.5908 8.99994 12.5908ZM10.37 7.50632C10.1985 7.61824 10.0554 7.76838 9.95172 7.94496C9.84808 8.12154 9.78679 8.31974 9.77266 8.52399V9.49994C9.77266 9.70488 9.69125 9.90143 9.54634 10.0463C9.40143 10.1913 9.20488 10.2727 8.99994 10.2727C8.795 10.2727 8.59846 10.1913 8.45355 10.0463C8.30863 9.90143 8.22722 9.70488 8.22722 9.49994V8.52399C8.23821 8.07633 8.3554 7.63768 8.56915 7.24418C8.78289 6.85068 9.08707 6.51359 9.45662 6.26069C9.56313 6.18266 9.64787 6.07863 9.70275 5.95854C9.75763 5.83844 9.78083 5.70629 9.77012 5.57469C9.75941 5.44308 9.71516 5.31642 9.64158 5.20678C9.56801 5.09714 9.46756 5.00818 9.34984 4.94839C9.23211 4.88861 9.10103 4.85998 8.96909 4.86525C8.83716 4.87052 8.70878 4.90951 8.5962 4.9785C8.48361 5.04749 8.39059 5.14418 8.326 5.25934C8.2614 5.3745 8.2274 5.50429 8.22722 5.63633C8.22722 5.84127 8.14581 6.03782 8.0009 6.18273C7.85598 6.32764 7.65944 6.40905 7.4545 6.40905C7.24956 6.40905 7.05301 6.32764 6.9081 6.18273C6.76319 6.03782 6.68178 5.84127 6.68178 5.63633C6.68177 5.24009 6.78334 4.85045 6.97678 4.50463C7.17022 4.15881 7.44908 3.86835 7.78673 3.66097C8.12438 3.45359 8.50955 3.33623 8.90547 3.32008C9.30139 3.30393 9.69483 3.38954 10.0483 3.56873C10.4017 3.74792 10.7033 4.0147 10.9242 4.34362C11.1452 4.67254 11.2781 5.05261 11.3104 5.44754C11.3427 5.84247 11.2732 6.23908 11.1085 6.59951C10.9439 6.95993 10.6896 7.27214 10.37 7.50632Z"
      fill="white"
    />
  </svg>
);

export function FAQs() {
  const [activeFaqIndexes, setActiveFaqIndexes] = useState([0]);
  const isMobile = isMobileDevice();
  return (
    <div className="ml-0 sm:ml-16 mt-5 sm:-mt-[38px]">
      {!isMobile && (
        <div className="font-bold flex items-center mb-5">
          <FaqIcon /> <span className="ml-1.5">FAQs</span>
        </div>
      )}
      <div className="text-sm w-80 bg-primary border border-solid border-[#10365E] rounded-lg p-5">
        {faqs.map((faq, index) => (
          <div className="pb-7" key={index}>
            <Accordion
              heading={<div className="font-semibold">{faq.question}</div>}
              isOpen={activeFaqIndexes.includes(index)}
              onToggle={() => {
                setActiveFaqIndexes(indexes =>
                  indexes.includes(index)
                    ? indexes.filter(i => i !== index)
                    : [...indexes, index]
                );
              }}
            >
              <div className="text-text-secondary">{faq.answer}</div>
            </Accordion>
          </div>
        ))}
        <div className="font-medium">
          <div className="mb-1.5">Disclaimer</div>
          <div className="text-text-secondary">
            Airstack points have no inherent value and cannot be sold, swapped,
            or traded.
          </div>
        </div>
      </div>
    </div>
  );
}
