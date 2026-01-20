# Send Verification OTP Edge Function

## Açıklama
Bu Edge Function, kullanıcılara email doğrulama için 6 haneli OTP kodu gönderir.

## Environment Variables
Supabase Dashboard → Project Settings → Edge Functions → Secrets:
- `SENDGRID_API_KEY`: SendGrid API anahtarı (zorunlu)
- `SENDGRID_FROM_EMAIL`: Gönderen email adresi (opsiyonel, default: noreply@sence.app)

## Kullanım

```typescript
const { data, error } = await supabase.functions.invoke('send-verification-otp', {
  body: { 
    userId: 'user-uuid',
    email: 'user@example.com'
  }
})
```

## Response
```json
{
  "success": true,
  "message": "Verification code sent successfully",
  "expiresIn": 600
}
```

## Hatalar
- `400`: userId veya email eksik, email formatı geçersiz
- `404`: Kullanıcı bulunamadı
- `500`: SendGrid hatası veya database hatası


