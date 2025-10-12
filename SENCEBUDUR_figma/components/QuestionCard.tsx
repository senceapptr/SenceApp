import { CircularProgress } from './CircularProgress';

interface QuestionCardProps {
  question: {
    id: number;
    title: string;
    image: string;
    yesPercentage: number;
    votes: string;
    timeLeft: string;
    yesOdds: number;
    noOdds: number;
  };
  onQuestionClick: (id: number) => void;
  onVote: (questionId: number, vote: 'yes' | 'no', odds: number) => void;
  isExpanded?: boolean;
  onToggleExpansion?: () => void;
  isCompact?: boolean;
}

export function QuestionCard({ 
  question,
  onQuestionClick,
  onVote,
  isExpanded,
  onToggleExpansion,
  isCompact = false
}: QuestionCardProps) {
  if (isCompact) {
    return (
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
        {/* Question Title */}
        <h3 
          className="text-[#202020] font-bold text-sm leading-4 mb-2 cursor-pointer hover:text-[#9368B7] transition-colors line-clamp-2"
          onClick={() => onQuestionClick(question.id)}
        >
          {question.title}
        </h3>
        
        {/* Circular Progress - Centered */}
        <div className="flex justify-center mb-3">
          <CircularProgress 
            percentage={question.yesPercentage}
            size={50}
            strokeWidth={5}
          />
        </div>
        
        {/* Vote and Time Info */}
        <div className="flex items-center justify-between text-[#202020]/70 text-xs mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            {question.votes}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
            </svg>
            {question.timeLeft}
          </span>
        </div>

        {/* Compact Voting Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote(question.id, 'yes', question.yesOdds);
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all duration-200 transform active:scale-95"
          >
            <div className="text-center">
              <div>EVET</div>
              <div className="text-xs opacity-90">{question.yesOdds}x</div>
            </div>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onVote(question.id, 'no', question.noOdds);
            }}
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold text-xs py-2 px-3 rounded-lg transition-all duration-200 transform active:scale-95"
          >
            <div className="text-center">
              <div>HAYIR</div>
              <div className="text-xs opacity-90">{question.noOdds}x</div>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start gap-4 mb-4">
        {/* Question Text - Left Side */}
        <div className="flex-1 min-w-0">
          <h3 
            className="text-[#202020] font-bold text-base leading-5 mb-2 cursor-pointer hover:text-[#9368B7] transition-colors line-clamp-2"
            onClick={() => onQuestionClick(question.id)}
          >
            {question.title}
          </h3>
          
          {/* Vote and Time Info - Left Aligned */}
          <div className="flex items-center gap-4 text-[#202020]/70 text-sm mb-3">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {question.votes}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
              </svg>
              {question.timeLeft}
            </span>
          </div>
        </div>

        {/* Circular Progress - Right Side */}
        <div className="flex-shrink-0">
          <CircularProgress 
            percentage={question.yesPercentage}
            size={60}
            strokeWidth={6}
          />
        </div>
      </div>

      {/* Full Width Voting Buttons - Bottom */}
      <div className="flex rounded-lg overflow-hidden border border-gray-200 h-12 shadow-sm">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVote(question.id, 'yes', question.yesOdds);
          }}
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold transition-all duration-200 flex items-center justify-center transform active:scale-95"
        >
          <div className="flex items-center gap-2">
            <span>EVET</span>
            <span className="text-sm bg-white/25 rounded px-2 py-1 font-bold">{question.yesOdds}x</span>
          </div>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVote(question.id, 'no', question.noOdds);
          }}
          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold transition-all duration-200 flex items-center justify-center transform active:scale-95"
        >
          <div className="flex items-center gap-2">
            <span>HAYIR</span>
            <span className="text-sm bg-white/25 rounded px-2 py-1 font-bold">{question.noOdds}x</span>
          </div>
        </button>
      </div>
    </div>
  );
}