# support-intake

Authenticated support and feedback intake endpoint.

## Actions

- `submit_support`
- `submit_feedback`

## submit_support payload

```json
{
  "action": "submit_support",
  "category": "technical",
  "subject": "Uygulama açılmıyor",
  "message": "Detaylı destek mesajı..."
}
```

## submit_feedback payload

```json
{
  "action": "submit_feedback",
  "type": "feature",
  "subject": "Yeni özellik önerisi",
  "message": "Detaylı geri bildirim metni..."
}
```
