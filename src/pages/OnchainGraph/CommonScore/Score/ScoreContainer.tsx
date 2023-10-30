export function ScoreContainer({ score }: { score: number }) {
  return (
    <div className="relative flex items-center justify-center mx-5">
      <span className="absolute text-3xl font-semibold">{score}</span>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="202"
        height="82"
        viewBox="0 0 202 82"
        fill="none"
      >
        <mask
          id="mask0_2461_128244"
          style={{ maskType: 'alpha' }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="202"
          height="82"
        >
          <rect
            x="0.5"
            y="-0.5"
            width="81"
            height="81"
            rx="40.5"
            transform="matrix(-1 0 0 1 122 1)"
            stroke="url(#paint0_linear_2461_128244)"
          />
          <rect
            opacity="0.75"
            x="0.5"
            y="-0.5"
            width="81"
            height="81"
            rx="40.5"
            transform="matrix(-1 0 0 1 102 1)"
            stroke="url(#paint1_linear_2461_128244)"
          />
          <rect
            opacity="0.5"
            x="0.5"
            y="-0.5"
            width="81"
            height="81"
            rx="40.5"
            transform="matrix(-1 0 0 1 82 1)"
            stroke="url(#paint2_linear_2461_128244)"
          />
          <rect
            x="80.5"
            y="0.5"
            width="81"
            height="81"
            rx="40.5"
            stroke="url(#paint3_linear_2461_128244)"
          />
          <rect
            opacity="0.75"
            x="100.5"
            y="0.5"
            width="81"
            height="81"
            rx="40.5"
            stroke="url(#paint4_linear_2461_128244)"
          />
          <rect
            opacity="0.5"
            x="120.5"
            y="0.5"
            width="81"
            height="81"
            rx="40.5"
            stroke="url(#paint5_linear_2461_128244)"
          />
          <circle cx="101" cy="40" r="38.5" stroke="white" strokeWidth="3" />
        </mask>
        <g mask="url(#mask0_2461_128244)">
          <rect
            x="-4"
            y="-2"
            width="211"
            height="85"
            fill="url(#paint6_linear_2461_128244)"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_2461_128244"
            x1="80"
            y1="40"
            x2="0"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.346334" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_2461_128244"
            x1="80"
            y1="40"
            x2="0"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.169249" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_2461_128244"
            x1="80"
            y1="40"
            x2="0"
            y2="40"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.0859152" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_2461_128244"
            x1="161"
            y1="41"
            x2="81"
            y2="41"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.346334" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_2461_128244"
            x1="181"
            y1="41"
            x2="101"
            y2="41"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.169249" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_2461_128244"
            x1="201"
            y1="41"
            x2="121"
            y2="41"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="white" />
            <stop offset="0.0859152" stopColor="white" stopOpacity="0" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint6_linear_2461_128244"
            x1="-4"
            y1="42.5239"
            x2="207"
            y2="42.5239"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#4B97F7" />
            <stop offset="1" stopColor="#FF284B" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
