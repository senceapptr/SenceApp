interface CircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  majorityVote: 'yes' | 'no';
}

export function CircularProgress({ 
  percentage, 
  size = 80, 
  strokeWidth = 8,
  majorityVote 
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Half circle circumference
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const color = majorityVote === 'yes' ? '#10B981' : '#EF4444'; // Green for yes, red for no
  const displayPercentage = majorityVote === 'yes' ? percentage : 100 - percentage;

  return (
    <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
      {/* Background half-circle */}
      <svg
        className="absolute top-0 left-0"
        width={size}
        height={size / 2 + 20}
        viewBox={`0 0 ${size} ${size / 2 + 20}`}
      >
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress half-circle */}
        <path
          d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${size / 2}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: 'stroke-dashoffset 0.5s ease-in-out',
          }}
        />
      </svg>
      
      {/* Percentage text */}
      <div 
        className="absolute flex flex-col items-center justify-center"
        style={{
          top: size / 4,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <span className="text-white font-bold text-lg drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          {Math.round(displayPercentage)}%
        </span>
        <span className="text-white text-xs font-medium drop-shadow-lg" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
          {majorityVote === 'yes' ? 'evet' : 'hayır'}
        </span>
      </div>
    </div>
  );
}