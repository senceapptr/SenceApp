interface QuestionCardProps {
  id: number;
  title: string;
  image: string;
  yesPercentage: number;
  votes: string;
  timeLeft: string;
  yesOdds: number;
  noOdds: number;
  onQuestionClick: () => void;
  onVote: (vote: 'yes' | 'no', odds: number) => void;
}

export function QuestionCard({ 
  title, 
  image, 
  yesPercentage, 
  votes, 
  timeLeft, 
  yesOdds, 
  noOdds,
  onQuestionClick,
  onVote 
}: QuestionCardProps) {
  const noPercentage = 100 - yesPercentage;
  
  // Minimum genişlik hesaplama - text'in sığması için
  const minYesWidth = Math.max(yesPercentage, 25); // En az %25
  const minNoWidth = Math.max(noPercentage, 25); // En az %25
  
  // Oranları yeniden normalize et
  const totalMinWidth = minYesWidth + minNoWidth;
  const normalizedYesWidth = (minYesWidth / totalMinWidth) * 100;
  const normalizedNoWidth = (minNoWidth / totalMinWidth) * 100;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-gray-200">
      <div className="flex items-start gap-4">
        {/* Question Image */}
        <div 
          className="flex-shrink-0 w-32 h-28 rounded-2xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={onQuestionClick}
        >
          <img 
            src={image} 
            alt=""
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 
            className="text-[#071013] font-bold text-base leading-5 mb-3 cursor-pointer hover:text-[#6B46F0] transition-colors line-clamp-2"
            onClick={onQuestionClick}
          >
            {title}
          </h3>

          {/* Dynamic Voting Buttons - Minimum genişlik ile */}
          <div className="flex rounded-lg overflow-hidden mb-3 border border-gray-200 h-10 shadow-sm">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote('yes', yesOdds);
              }}
              className="bg-gradient-to-r from-[#00AF54] to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold transition-all duration-200 flex items-center justify-center text-xs hover:shadow-md transform active:scale-95"
              style={{ width: `${normalizedYesWidth}%`, minWidth: '80px' }}
            >
              <div className="flex items-center gap-1 px-2">
                <span className="truncate font-bold">Evet</span>
                <span className="text-xs bg-white/25 rounded px-1 font-bold whitespace-nowrap">{yesOdds}x</span>
              </div>
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onVote('no', noOdds);
              }}
              className="bg-gradient-to-r from-[#FF4E4E] to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold transition-all duration-200 flex items-center justify-center text-xs hover:shadow-md transform active:scale-95"
              style={{ width: `${normalizedNoWidth}%`, minWidth: '80px' }}
            >
              <div className="flex items-center gap-1 px-2">
                <span className="truncate font-bold">Hayır</span>
                <span className="text-xs bg-white/25 rounded px-1 font-bold whitespace-nowrap">{noOdds}x</span>
              </div>
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-between items-center text-[#888888] text-sm">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              {votes}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z"/>
              </svg>
              {timeLeft}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}