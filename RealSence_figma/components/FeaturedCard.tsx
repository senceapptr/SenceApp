export function FeaturedCard() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4C1D95] via-purple-700 to-[#FE9000] p-5 shadow-lg">
      <div className="flex items-start gap-4">
        {/* Basketball Icon */}
        <div className="flex-shrink-0 w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-sm">
          <div className="w-8 h-8 bg-orange-600 rounded-full relative">
            <div className="absolute inset-0 border-2 border-orange-800 rounded-full"></div>
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-orange-800"></div>
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-orange-800"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h2 className="text-white text-lg font-bold leading-6 mb-4">
            Will the Lakers make it to the playoffs this season?
          </h2>

          {/* Vote Bar */}
          <div className="relative h-2 bg-white/20 rounded-full overflow-hidden mb-3">
            <div 
              className="absolute top-0 left-0 h-full bg-[#00AF54] rounded-full"
              style={{ width: '65%' }}
            />
          </div>

          {/* Vote Results */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-white font-bold text-base">Yes 65%</span>
            <span className="text-white font-bold text-base">No 35%</span>
          </div>

          {/* Stats */}
          <div className="text-white/80 text-sm">
            15,2K votes • 14 hr left
          </div>
        </div>
      </div>
    </div>
  );
}