# 🔄 Questions Sistemi - Frontend Entegrasyonu

> **Tarih:** Ocak 2026  
> **Amaç:** Database değişikliklerinin frontend ve servislerde nasıl işlendiğini analiz etmek

---

## 📋 İçindekiler

1. [Mevcut Durum](#1-mevcut-durum)
2. [Database Değişikliklerinin Etkisi](#2-database-değişikliklerinin-etkisi)
3. [Hata Yönetimi](#3-hata-yönetimi)
4. [İyileştirme Önerileri](#4-iyileştirme-önerileri)
5. [Kod Değişiklikleri](#5-kod-değişiklikleri)

---

## 1. Mevcut Durum

### 1.1. Soru Oluşturma (WriteQuestionPage)

**Dosya:** `app/SenceFinal/components/WriteQuestionPage/`

**Akış:**
```typescript
// hooks.ts - handleSubmit
1. Form validasyonu (frontend)
2. questionsService.createQuestion() çağrılır
3. Soru draft olarak oluşturulur
4. Başarı mesajı gösterilir
```

**Durum:** ✅ Çalışıyor
- Soru `draft` olarak oluşturuluyor
- Frontend validasyonu var (end_date gelecekte olmalı)
- Hata yönetimi var (genel mesaj)

---

### 1.2. Soru Görüntüleme (StatusTab)

**Dosya:** `app/SenceFinal/components/WriteQuestionPage/components/StatusTab/`

**Akış:**
```typescript
// hooks.ts - loadUserQuestions
1. questionsService.getUserQuestions() çağrılır
2. Backend verileri frontend formatına çevrilir
3. Status mapping: draft -> pending, active -> approved
4. Sorular listelenir
```

**Durum:** ✅ Çalışıyor
- Kullanıcılar sorularını görebiliyor
- Status badge'ler gösteriliyor
- **SORUN:** Düzenleme butonu yok (sadece görüntüleme)

---

### 1.3. Admin Soru Düzenleme (AdminPanel)

**Dosya:** `app/SenceFinal/components/AdminPanel/`

**Akış:**
```typescript
// EditQuestionModal.tsx - handleSave
1. Admin soru düzenleme modal'ı açılır
2. adminService.updateQuestion() çağrılır
3. Hata durumunda genel mesaj gösterilir
```

**Durum:** ✅ Çalışıyor
- Adminler soruları düzenleyebiliyor
- Hata yönetimi var (genel mesaj)

---

## 2. Database Değişikliklerinin Etkisi

### 2.1. RLS Policy Değişikliği

**Değişiklik:**
```sql
-- ÖNCE: Kullanıcılar tüm soruları güncelleyebiliyordu
-- SONRA: Kullanıcılar sadece draft soruları güncelleyebiliyor
```

**Frontend Etkisi:**

#### ✅ Çalışan Senaryolar

1. **Kullanıcı Draft Soru Oluşturma:**
   - ✅ `createQuestion()` → `status: 'draft'` → Başarılı
   - ✅ Frontend'de sorun yok

2. **Admin Soru Düzenleme:**
   - ✅ `adminService.updateQuestion()` → Admin yetkisi var → Başarılı
   - ✅ Frontend'de sorun yok

#### ⚠️ Potansiyel Sorunlar

1. **Kullanıcı Active Soru Güncelleme Denemesi:**
   - ❌ `questionsService.updateQuestion()` → RLS policy reddeder
   - ⚠️ Frontend'de düzenleme butonu yok (sorun yok şu an)
   - ⚠️ Eğer eklenseydi, hata mesajı genel olurdu

2. **Status Transition Denemesi:**
   - ❌ Kullanıcı `draft` → `active` yapmaya çalışırsa → Trigger reddeder
   - ⚠️ Frontend'de bu işlem yok (sorun yok şu an)

---

### 2.2. Status Transition Validation

**Değişiklik:**
```sql
-- Trigger: validate_question_status_transition()
-- Draft -> Active: Sadece admin
-- Active/Resolved: Sadece admin değiştirebilir
```

**Frontend Etkisi:**

#### ✅ Çalışan Senaryolar

1. **Admin Soru Onaylama:**
   - ✅ `adminService.approveQuestion()` → Admin yetkisi var → Başarılı
   - ✅ Frontend'de sorun yok

#### ⚠️ Potansiyel Sorunlar

1. **Kullanıcı Status Değiştirme Denemesi:**
   - ❌ Kullanıcı `status: 'active'` set etmeye çalışırsa → Trigger reddeder
   - ⚠️ Frontend'de bu işlem yok (sorun yok şu an)
   - ⚠️ Eğer eklenseydi, hata mesajı parse edilmeli

---

### 2.3. End Date Validation

**Değişiklik:**
```sql
-- Trigger: validate_question_end_date()
-- Yeni sorular için end_date gelecekte olmalı
```

**Frontend Etkisi:**

#### ✅ Çalışan Senaryolar

1. **Kullanıcı Soru Oluşturma:**
   - ✅ Frontend validasyonu var (`validateQuestionForm`)
   - ✅ `end_date >= oneWeekFromNow` kontrolü var
   - ✅ Database trigger sadece ekstra güvence

2. **Admin Soru Düzenleme:**
   - ✅ Admin geçmiş tarih set edebilir (özel durumlar için)
   - ✅ Frontend'de sorun yok

#### ⚠️ Potansiyel Sorunlar

1. **Kullanıcı Geçmiş Tarih Denemesi:**
   - ❌ Frontend validasyonu zaten engelliyor
   - ✅ Database trigger ekstra güvence sağlıyor

---

## 3. Hata Yönetimi

### 3.1. Mevcut Hata Yönetimi

**Sorun:** Genel hata mesajları kullanılıyor

#### Örnekler:

```typescript
// WriteQuestionPage/hooks.ts
if (error) {
  Alert.alert('Hata', 'Soru oluşturulurken bir hata oluştu.');
}

// AdminPanel/components/EditQuestionModal.tsx
if (error) {
  Alert.alert('Hata', 'Soru güncellenirken bir hata oluştu');
}
```

**Sorun:** Database'den gelen spesifik hata mesajları parse edilmiyor

---

### 3.2. Database Hata Mesajları

**Migration'dan Gelen Hatalar:**

1. **RLS Policy Hatası:**
   ```json
   {
     "code": "42501",
     "message": "new row violates row-level security policy"
   }
   ```

2. **Status Transition Hatası:**
   ```json
   {
     "message": "Only admins can approve questions (draft -> active)"
   }
   ```

3. **End Date Hatası:**
   ```json
   {
     "message": "End date must be in the future"
   }
   ```

**Frontend'de Parse Edilmiyor:** ⚠️

---

## 4. İyileştirme Önerileri

### 4.1. Hata Mesajı Parse Etme

**Öneri:** Database hatalarını parse edip kullanıcıya anlamlı mesajlar göster

**Kod Örneği:**

```typescript
// services/questions.service.ts
async updateQuestion(questionId: string, updates: Partial<CreateQuestionData>) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', questionId)
      .select()
      .single();

    if (error) {
      // Parse error message
      let userMessage = 'Soru güncellenirken bir hata oluştu';
      
      if (error.code === '42501') {
        userMessage = 'Bu soruyu güncelleme yetkiniz yok. Sadece bekleyen sorularınızı güncelleyebilirsiniz.';
      } else if (error.message?.includes('Only admins')) {
        userMessage = 'Sadece yöneticiler soruları onaylayabilir.';
      } else if (error.message?.includes('End date must be in the future')) {
        userMessage = 'Bitiş tarihi gelecekte olmalıdır.';
      }
      
      throw new Error(userMessage);
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('updateQuestion error:', error);
    return { data: null, error: error as Error };
  }
}
```

---

### 4.2. Kullanıcı Soru Düzenleme Özelliği

**Öneri:** StatusTab'de draft sorular için düzenleme butonu ekle

**Kod Örneği:**

```typescript
// app/SenceFinal/components/WriteQuestionPage/components/StatusTab/QuestionStatusCard.tsx
export const QuestionStatusCard: React.FC<QuestionStatusCardProps> = ({ question }) => {
  const handleEdit = () => {
    // Sadece draft (pending) sorular için
    if (question.status === 'pending') {
      // Düzenleme modal'ı aç
      // veya WriteTab'e yönlendir
    } else {
      Alert.alert(
        'Düzenleme Yapılamaz',
        'Onaylanmış sorular düzenlenemez. Lütfen yeni bir soru oluşturun.'
      );
    }
  };

  return (
    <View style={styles.questionCard}>
      {/* ... mevcut içerik ... */}
      
      {question.status === 'pending' && (
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Text style={styles.editButtonText}>Düzenle</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

---

### 4.3. Hata Mesajı Utility Function

**Öneri:** Ortak hata mesajı parse fonksiyonu oluştur

**Kod Örneği:**

```typescript
// utils/errorHandler.ts
export const parseQuestionError = (error: any): string => {
  if (!error) return 'Bir hata oluştu';
  
  // RLS Policy hatası
  if (error.code === '42501') {
    return 'Bu işlem için yetkiniz yok.';
  }
  
  // Status transition hatası
  if (error.message?.includes('Only admins can approve')) {
    return 'Sadece yöneticiler soruları onaylayabilir.';
  }
  
  if (error.message?.includes('Only admins can change status')) {
    return 'Sadece yöneticiler soru durumunu değiştirebilir.';
  }
  
  // End date hatası
  if (error.message?.includes('End date must be in the future')) {
    return 'Bitiş tarihi gelecekte olmalıdır.';
  }
  
  // Genel hata
  return error.message || 'Bir hata oluştu';
};

// Kullanım:
const { error } = await questionsService.updateQuestion(id, updates);
if (error) {
  Alert.alert('Hata', parseQuestionError(error));
}
```

---

## 5. Kod Değişiklikleri

### 5.1. Servislerde Hata Parse Etme

**Dosya:** `services/questions.service.ts`

**Değişiklik:**
```typescript
// updateQuestion fonksiyonuna hata parse ekle
async updateQuestion(questionId: string, updates: Partial<CreateQuestionData>) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', questionId)
      .select()
      .single();

    if (error) {
      // Parse error message
      let userMessage = 'Soru güncellenirken bir hata oluştu';
      
      if (error.code === '42501') {
        userMessage = 'Bu soruyu güncelleme yetkiniz yok. Sadece bekleyen sorularınızı güncelleyebilirsiniz.';
      } else if (error.message?.includes('Only admins')) {
        userMessage = 'Sadece yöneticiler bu işlemi yapabilir.';
      } else if (error.message?.includes('End date must be in the future')) {
        userMessage = 'Bitiş tarihi gelecekte olmalıdır.';
      }
      
      return { data: null, error: new Error(userMessage) };
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('updateQuestion error:', error);
    return { data: null, error: error as Error };
  }
}
```

---

### 5.2. Frontend'de Hata Mesajı Gösterme

**Dosya:** `app/SenceFinal/components/WriteQuestionPage/hooks.ts`

**Değişiklik:**
```typescript
// handleSubmit fonksiyonunda hata mesajını göster
if (error) {
  console.error('Create question error:', error);
  Alert.alert('Hata', error.message || 'Soru oluşturulurken bir hata oluştu.');
  setIsSubmitting(false);
  return;
}
```

---

### 5.3. Admin Panel'de Hata Mesajı Gösterme

**Dosya:** `app/SenceFinal/components/AdminPanel/components/EditQuestionModal.tsx`

**Değişiklik:**
```typescript
// handleSave fonksiyonunda hata mesajını göster
const { error } = await adminService.updateQuestion(question.id, updateData);

if (error) {
  Alert.alert('Hata', error.message || 'Soru güncellenirken bir hata oluştu');
  return;
}
```

---

## 📊 Özet

### ✅ Çalışan Özellikler

1. ✅ Soru oluşturma (draft olarak)
2. ✅ Soru görüntüleme (StatusTab)
3. ✅ Admin soru düzenleme
4. ✅ Frontend validasyonu (end_date)

### ⚠️ İyileştirme Gereken Özellikler

1. ⚠️ Hata mesajı parse etme (spesifik mesajlar)
2. ⚠️ Kullanıcı soru düzenleme özelliği (draft sorular için)
3. ⚠️ Hata mesajı utility function

### 🔴 Potansiyel Sorunlar (Şu An Yok)

1. ✅ Kullanıcılar active soruları güncelleyemiyor (frontend'de buton yok)
2. ✅ Status transition frontend'de yok (sadece admin panel'de)
3. ✅ End date validasyonu frontend'de var

---

## 🔗 İlgili Dosyalar

- `services/questions.service.ts` - Questions servisleri
- `services/admin.service.ts` - Admin servisleri
- `app/SenceFinal/components/WriteQuestionPage/` - Soru oluşturma sayfası
- `app/SenceFinal/components/AdminPanel/` - Admin panel
- `supabase/migrations/048_fix_questions_rls_and_visibility.sql` - RLS düzeltmeleri
- `supabase/migrations/049_questions_structure_improvements.sql` - Yapı iyileştirmeleri

---

## ⚠️ ÖNEMLİ NOTLAR

1. **Hata Yönetimi:** Şu an genel mesajlar kullanılıyor, spesifik hatalar parse edilmiyor
2. **Kullanıcı Düzenleme:** StatusTab'de düzenleme butonu yok (sadece görüntüleme)
3. **Database Güvenliği:** RLS policy ve trigger'lar frontend'den bağımsız çalışıyor (güvenli)
