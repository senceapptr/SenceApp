# Verify OTP Edge Function

## Açıklama
Bu Edge Function, kullanıcının girdiği OTP kodunu doğrular ve email adresini verified olarak işaretler.

## Kullanım

```typescript
const { data, error } = await supabase.functions.invoke('verify-otp', {
  body: { 
    userId: 'user-uuid',
    email: 'user@example.com',
    code: '123456'
  }
})
```

## Response

### Başarılı
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### Hata
```json
{
  "error": "Invalid or expired code",
  "remainingAttempts": 2
}
```

## Güvenlik Özellikleri
- Kod sadece 10 dakika geçerlidir
- Her kod sadece 1 kez kullanılabilir
- 3'ten fazla yanlış denemede yeni kod istenmesi gerekir
- Kod format kontrolü (6 haneli sayı)

## Hata Kodları
- `400`: Eksik parametre, geçersiz kod, süresi dolmuş kod
- `404`: Kullanıcı bulunamadı
- `429`: Çok fazla yanlış deneme
- `500`: Server hatası


