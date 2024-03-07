export function ScoreBar({ scorePercentage }: { scorePercentage: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="185"
      height="14"
      viewBox="0 0 185 14"
      fill="none"
    >
      <rect width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="7" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="14" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="21" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="28" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="35" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="42" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="49" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="56" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="63" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="70" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="77" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="84" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="91" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="98" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="105" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="112" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="119" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="126" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="133" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="140" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="147" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="154" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="161" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="168" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="175" width="3" height="14" rx="1.5" fill="#24242D" />
      <rect x="182" width="3" height="14" rx="1.5" fill="#24242D" />
      <mask
        id="mask0_2246_59014"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="185"
        height="14"
      >
        <rect width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="7" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="14" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="21" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="28" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="35" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="42" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="49" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="56" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="63" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="70" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="77" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="84" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="91" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="98" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="105" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="112" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="119" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="126" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="133" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="140" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="147" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="154" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="161" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="168" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="175" width="3" height="14" rx="1.5" fill="#D9D9D9" />
        <rect x="182" width="3" height="14" rx="1.5" fill="#D9D9D9" />
      </mask>
      <g mask="url(#mask0_2246_59014)">
        <rect
          x="-1"
          y="-4"
          width={`${scorePercentage}%`}
          height="21"
          fill="url(#paint0_linear_2246_59014)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_2246_59014"
          x1="-1"
          y1="7.00002"
          x2="152"
          y2="7.00002"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3486FF" />
          <stop offset="0.447924" stopColor="#178594" />
          <stop offset="1" stopColor="#00843D" />
        </linearGradient>
      </defs>
    </svg>
  );
}
