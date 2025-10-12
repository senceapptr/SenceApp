import { useState } from 'react';

interface WriteQuestionPageProps {
  onBack: () => void;
}

interface SubmittedQuestion {
  id: number;
  title: string;
  description: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  rejectionReason?: string;
}

export function WriteQuestionPage({ onBack }: WriteQuestionPageProps) {
  const [activeTab, setActiveTab] = useState<'write' | 'status'>('write');
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock submitted questions data
  const [submittedQuestions] = useState<SubmittedQuestion[]>([
    {
      id: 1,
      title: "2024 yılında Türkiye'de elektrikli araç satışları %50 artacak mı?",
      description: "Türkiye'de elektrikli araç pazarının büyüme trendi devam edecek mi?",
      endDate: "2024-12-31",
      status: 'approved',
      submittedAt: "2024-01-15"
    },
    {
      id: 2,
      title: "ChatGPT-5 2024 yılında çıkacak mı?",
      description: "OpenAI'ın yeni modeli bu yıl piyasaya çıkacak mı?",
      endDate: "2024-12-31",
      status: 'pending',
      submittedAt: "2024-01-20"
    },
    {
      id: 3,
      title: "Bitcoin 2024'te 100.000$ seviyesini görecek mi?",
      description: "Kripto para piyasasındaki gelişmeler",
      endDate: "2024-12-31",
      status: 'rejected',
      submittedAt: "2024-01-10",
      rejectionReason: "Soru çok spekülatiif ve belirsiz kriterler içeriyor."
    }
  ]);

  const handleSubmit = async () => {
    if (!question.trim() || !description.trim() || !endDate) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      
      // Reset form
      setQuestion('');
      setDescription('');
      setEndDate('');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Onaylandı
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Bekliyor
          </div>
        );
      case 'rejected':
        return (
          <div className="inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Reddedildi
          </div>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F2F3F5]">
      {/* Header */}
      <div className="bg-white border-b border-[#F2F3F5] px-5 py-4 pt-16">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-[#F2F3F5] flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-[#202020]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 className="font-black text-xl text-[#202020]">Soru Yaz</h1>
            <p className="text-[#202020]/70 text-sm">Toplulukla paylaşmak istediğin soruları yaz</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 py-4">
        <div className="bg-white rounded-2xl p-1 flex border border-[#F2F3F5] shadow-sm">
          <button
            onClick={() => setActiveTab('write')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'write'
                ? 'bg-[#432870] text-white shadow-md'
                : 'text-[#202020]/70 hover:text-[#202020]'
            }`}
          >
            <span className="text-lg">✍️</span>
            Soru Yaz
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
              activeTab === 'status'
                ? 'bg-[#432870] text-white shadow-md'
                : 'text-[#202020]/70 hover:text-[#202020]'
            }`}
          >
            <span className="text-lg">📋</span>
            Durumlar
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-xl animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <p className="font-bold">Sorun başarıyla gönderildi!</p>
          </div>
        </div>
      )}

      {/* Tab Content */}
      <div className="px-5 pb-24">
        {activeTab === 'write' ? (
          <div className="space-y-6">
            {/* Write Question Form */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F2F3F5]">
              <div className="mb-6">
                <h2 className="font-black text-lg text-[#202020] mb-2">Yeni Soru Oluştur</h2>
                <p className="text-[#202020]/70 text-sm">
                  Sorun incelendikten sonra yayınlanacak. Topluluk kurallarına uygun sorular yazın.
                </p>
              </div>

              <div className="space-y-6">
                {/* Question Field */}
                <div>
                  <label className="text-[#202020] font-bold text-sm mb-2 block">
                    Soru <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Örn: 2024 yılında Bitcoin 100.000$ seviyesini aşacak mı?"
                    className="w-full bg-[#F2F3F5] border-2 border-[#432870]/20 rounded-2xl p-4 focus:border-[#432870] transition-colors resize-none h-24"
                    maxLength={200}
                  />
                  <div className="text-right text-xs text-[#202020]/50 mt-1">
                    {question.length}/200
                  </div>
                </div>

                {/* Description Field */}
                <div>
                  <label className="text-[#202020] font-bold text-sm mb-2 block">
                    Soru Açıklaması <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Sorunuz hakkında daha detaylı bilgi verin. Kriterler ve koşulları açıklayın."
                    className="w-full bg-[#F2F3F5] border-2 border-[#432870]/20 rounded-2xl p-4 focus:border-[#432870] transition-colors resize-none h-32"
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-[#202020]/50 mt-1">
                    {description.length}/500
                  </div>
                </div>

                {/* End Date Field */}
                <div>
                  <label className="text-[#202020] font-bold text-sm mb-2 block">
                    Bitiş Tarihi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#F2F3F5] border-2 border-[#432870]/20 rounded-2xl p-4 focus:border-[#432870] transition-colors"
                  />
                </div>

                {/* Options Info */}
                <div className="bg-[#432870]/10 rounded-2xl p-4 border border-[#432870]/20">
                  <h3 className="font-bold text-[#202020] mb-2 flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    Seçenekler
                  </h3>
                  <div className="space-y-2 text-sm text-[#202020]/80">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span><strong>EVET</strong> - Sorunuzun gerçekleşeceğini düşünenler</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span><strong>HAYIR</strong> - Sorunuzun gerçekleşmeyeceğini düşünenler</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Guidelines */}
            <div className="bg-gradient-to-r from-[#432870]/10 to-[#B29EFD]/10 rounded-3xl p-6 border border-[#432870]/20">
              <h3 className="font-black text-[#202020] mb-4 flex items-center gap-2">
                <span className="text-xl">📋</span>
                Soru Yazım Kuralları
              </h3>
              <div className="space-y-3 text-sm text-[#202020]/80">
                <div className="flex items-start gap-2">
                  <span className="text-[#432870] mt-0.5">•</span>
                  <span>Sorular net ve anlaşılır olmalı</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#432870] mt-0.5">•</span>
                  <span>Ölçülebilir ve doğrulanabilir kriterler içermeli</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#432870] mt-0.5">•</span>
                  <span>Küfür, hakaret ve uygunsuz içerik yasak</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#432870] mt-0.5">•</span>
                  <span>Soruların bitiş tarihi en az 1 hafta olmalı</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!question.trim() || !description.trim() || !endDate || isSubmitting}
              className={`w-full py-4 px-6 rounded-2xl font-black text-lg transition-all duration-300 ${
                !question.trim() || !description.trim() || !endDate || isSubmitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#432870] to-[#B29EFD] hover:from-[#5A3A8B] hover:to-[#C9A8FF] text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Gönderiliyor...
                </div>
              ) : (
                'Soruyu Gönder'
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Status Tab */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#F2F3F5]">
              <h2 className="font-black text-lg text-[#202020] mb-4">Gönderdiğin Sorular</h2>
              
              {submittedQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="font-bold text-[#202020] mb-2">Henüz soru göndermemişsin</h3>
                  <p className="text-[#202020]/70 text-sm">İlk sorununu yazmak için "Soru Yaz" sekmesine geç</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submittedQuestions.map((q) => (
                    <div key={q.id} className="bg-[#F2F3F5] rounded-2xl p-4 border border-white">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-[#202020] mb-1 leading-tight">{q.title}</h3>
                          <p className="text-[#202020]/70 text-sm">{q.description}</p>
                        </div>
                        <div className="ml-3">
                          {getStatusBadge(q.status)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-[#202020]/50">
                        <span>Gönderilme: {formatDate(q.submittedAt)}</span>
                        <span>Bitiş: {formatDate(q.endDate)}</span>
                      </div>
                      
                      {q.status === 'rejected' && q.rejectionReason && (
                        <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3">
                          <h4 className="font-bold text-red-700 text-sm mb-1">Red Sebebi:</h4>
                          <p className="text-red-600 text-sm">{q.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}