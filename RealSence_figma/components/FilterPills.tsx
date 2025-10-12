interface FilterPillsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function FilterPills({ selectedCategory, onCategoryChange }: FilterPillsProps) {
  const filters = [
    { id: 'ending-soon', label: 'Bitmek Üzere', color: '#F5A623' },
    { id: 'all', label: 'Tümü', color: '#D6D6F5' },
    { id: 'spor', label: 'Spor', color: '#D6D6F5' },
    { id: 'kripto', label: 'Kripto', color: '#D6D6F5' },
    { id: 'teknoloji', label: 'Teknoloji', color: '#D6D6F5' }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onCategoryChange(filter.id)}
          className={`
            flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95
            ${selectedCategory === filter.id 
              ? 'bg-gradient-to-r from-[#00AF54] to-green-600 text-white shadow-lg' 
              : filter.id === 'all'
                ? 'text-[#6B46F0] shadow-sm hover:shadow-md'
                : 'text-gray-700 hover:bg-gray-200'
            }
          `}
          style={selectedCategory !== filter.id ? { backgroundColor: filter.color } : {}}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}