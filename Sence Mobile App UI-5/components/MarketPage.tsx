import { useState } from 'react';

interface MarketPageProps {
  onBack: () => void;
  userCredits: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  featured: boolean;
  badge?: string;
}

export function MarketPage({ onBack, userCredits }: MarketPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const products: Product[] = [
    {
      id: 1,
      name: 'MacBook Pro 16" M3',
      description: 'Apple M3 Pro chip, 18GB RAM, 512GB SSD',
      price: 5000000,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=300&fit=crop',
      category: 'elektronik',
      featured: true,
      badge: 'En Popüler'
    },
    {
      id: 2,
      name: 'Dyson V15 Detect',
      description: 'Laser teknolojisi ile kablosuz süpürge',
      price: 1200000,
      originalPrice: 1500000,
      image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop',
      category: 'ev',
      featured: true,
      badge: 'İndirimli'
    },
    {
      id: 3,
      name: 'MacFit Gold Üyelik',
      description: '1 yıllık premium spor salonu üyeliği',
      price: 800000,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      category: 'hizmet',
      featured: false,
    },
    {
      id: 4,
      name: 'iPhone 15 Pro Max',
      description: 'Titanium, 256GB, Doğal Titanyum',
      price: 3500000,
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&h=300&fit=crop',
      category: 'elektronik',
      featured: true,
    },
    {
      id: 5,
      name: 'Netflix Hediye Çeki',
      description: '1 yıllık Netflix Premium üyeliği',
      price: 150000,
      image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop',
      category: 'hediye',
      featured: false,
    },
    {
      id: 6,
      name: 'AirPods Pro 2',
      description: 'USB-C, Active Noise Cancellation',
      price: 600000,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c5c7c0?w=400&h=300&fit=crop',
      category: 'elektronik',
      featured: false,
    }
  ];

  const categories = [
    { id: 'all', name: 'Tümü', icon: '🛍️' },
    { id: 'elektronik', name: 'Elektronik', icon: '📱' },
    { id: 'ev', name: 'Ev & Yaşam', icon: '🏠' },
    { id: 'hizmet', name: 'Hizmetler', icon: '💼' },
    { id: 'hediye', name: 'Hediye Çekleri', icon: '🎁' }
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const featuredProducts = products.filter(p => p.featured);

  const handlePurchase = (product: Product) => {
    setSelectedProduct(product);
    setShowPurchaseModal(true);
  };

  const confirmPurchase = () => {
    if (selectedProduct && userCredits >= selectedProduct.price) {
      alert(`${selectedProduct.name} başarıyla satın alındı! 🎉`);
      setShowPurchaseModal(false);
      setSelectedProduct(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR').format(price);
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header - iPhone 16 Optimized */}
        <div className="bg-gradient-to-br from-[#432870] via-[#5A3A8B] to-[#B29EFD] p-4 pt-16">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <div className="text-center">
              <h1 className="text-white font-black text-xl">Market</h1>
              <p className="text-white/90 text-sm">Kredilerinle gerçek ürünler kazan</p>
            </div>
            
            <div className="text-right bg-white/15 backdrop-blur-md rounded-xl p-2 border border-white/20">
              <div className="text-white font-black text-sm">{formatPrice(userCredits)}</div>
              <div className="text-white/80 text-xs">kredi</div>
            </div>
          </div>
        </div>

        {/* Categories - Horizontal Scroll */}
        <div className="p-4 bg-[#F2F3F5]">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-[#432870] text-white shadow-lg'
                    : 'bg-white text-[#202020] border border-[#F2F3F5]'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Products - iPhone 16 Grid */}
        <div className="p-4">
          <h2 className="text-[#202020] font-black text-lg mb-4">⭐ Öne Çıkanlar</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-6">
            {featuredProducts.slice(0, 4).map((product) => (
              <div 
                key={product.id}
                className="relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-[#F2F3F5]"
                onClick={() => handlePurchase(product)}
              >
                {product.badge && (
                  <div className="absolute top-2 left-2 z-10">
                    <div className="bg-[#432870] text-white px-2 py-1 rounded-lg text-xs font-bold">
                      {product.badge}
                    </div>
                  </div>
                )}
                
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-3">
                  <h3 className="text-[#202020] font-bold text-sm mb-1 line-clamp-1">{product.name}</h3>
                  <p className="text-[#202020]/70 text-xs mb-2 line-clamp-1">{product.description}</p>
                  
                  <div className="space-y-1">
                    {product.originalPrice && (
                      <div className="text-[#202020]/50 text-xs line-through">{formatPrice(product.originalPrice)} 💎</div>
                    )}
                    <div className="text-[#432870] font-black text-sm">{formatPrice(product.price)} 💎</div>
                  </div>
                  
                  <div className={`mt-2 px-2 py-1 rounded-lg text-xs font-bold text-center ${
                    userCredits >= product.price 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {userCredits >= product.price ? '✓ Alabilir' : '✗ Yetersiz'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Products - List View for iPhone 16 */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#202020] font-black text-lg">
              {selectedCategory === 'all' ? 'Tüm Ürünler' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <div className="text-[#432870] font-bold text-sm">
              {filteredProducts.length} ürün
            </div>
          </div>
          
          <div className="space-y-4 pb-24">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-[#F2F3F5]"
                onClick={() => handlePurchase(product)}
              >
                <div className="flex p-4 gap-4">
                  <div className="w-24 h-24 flex-shrink-0 relative overflow-hidden rounded-xl">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.badge && (
                      <div className="absolute top-1 left-1">
                        <div className="bg-[#432870] text-white px-1.5 py-0.5 rounded text-xs font-bold">
                          {product.badge}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[#202020] font-black text-base mb-1 line-clamp-1">{product.name}</h3>
                    <p className="text-[#202020]/70 text-sm mb-3 line-clamp-2">{product.description}</p>
                    
                    <div className="flex items-end justify-between">
                      <div>
                        {product.originalPrice && (
                          <div className="text-[#202020]/50 text-sm line-through mb-1">{formatPrice(product.originalPrice)} 💎</div>
                        )}
                        <div className="text-[#432870] font-black text-lg">{formatPrice(product.price)} 💎</div>
                      </div>
                      
                      <div className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                        userCredits >= product.price 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {userCredits >= product.price ? '✓ Satın Al' : '✗ Yetersiz'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Purchase Modal - iPhone 16 Optimized */}
      {showPurchaseModal && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full animate-in zoom-in-95 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-xl overflow-hidden mx-auto mb-4 border-2 border-[#F2F3F5]">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-[#202020] font-black text-lg mb-2">{selectedProduct.name}</h3>
                <p className="text-[#202020]/70 text-sm">{selectedProduct.description}</p>
              </div>

              <div className="bg-[#F2F3F5] rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[#202020] font-bold">Fiyat</span>
                  <span className="text-[#432870] font-black text-xl">{formatPrice(selectedProduct.price)} 💎</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#202020] font-bold">Mevcut Kredi</span>
                  <span className={`font-black text-lg ${userCredits >= selectedProduct.price ? 'text-green-600' : 'text-red-600'}`}>
                    {formatPrice(userCredits)} 💎
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowPurchaseModal(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-[#202020] font-bold py-3 rounded-xl transition-all duration-300"
                >
                  İptal
                </button>
                <button 
                  onClick={confirmPurchase}
                  disabled={userCredits < selectedProduct.price}
                  className={`flex-1 font-bold py-3 rounded-xl transition-all duration-300 ${
                    userCredits >= selectedProduct.price
                      ? 'bg-[#432870] hover:bg-[#5A3A8B] text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Satın Al
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}