interface FilterPillsProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function FilterPills({ selectedCategory, onCategoryChange }: FilterPillsProps) {
  const filters = [
    { id: 'tümü', label: 'Tümü', color: '#F2F3F5' },
    { id: 'trend', label: 'Trend', color: '#E3F2FD' },
    { id: 'yeni', label: 'Yeni', color: '#E8F5E8' },
    { id: 'yakında bitecek', label: 'Yakında Bitecek', color: '#FFF3E0' },
    { id: 'özel oranlar', label: 'Özel Oranlar', color: '#FCE4EC' },
    { id: 'spor', label: 'Spor', color: '#F3E5F5' },
    { id: 'müzik', label: 'Müzik', color: '#E1F5FE' },
    { id: 'finans', label: 'Finans', color: '#E8F5E8' },
    { id: 'magazin', label: 'Magazin', color: '#FFF8E1' },
    { id: 'politika', label: 'Politika', color: '#FCE4EC' },
    { id: 'teknoloji', label: 'Teknoloji', color: '#FFF3E0' },
    { id: 'dizi&film', label: 'Dizi&Film', color: '#F3E5F5' },
    { id: 'dünya', label: 'Dünya', color: '#E3F2FD' }
  ];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onCategoryChange(filter.id)}
          className={`
            flex-shrink-0 px-4 py-2 rounded-full font-bold text-sm transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105 active:scale-95
            ${selectedCategory === filter.id 
              ? 'bg-[#432870] text-white shadow-lg' 
              : 'text-[#202020] hover:bg-[#432870] hover:text-white'
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