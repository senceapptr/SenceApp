# coupon-service

Privileged coupon operations behind a single authenticated edge function.

## Actions

- `get_user_coupons`
- `get_active_coupons`
- `create_coupon`
- `claim_coupon_reward`
- `resolve_coupon` (admin only)
- `check_coupon_status`

## Request payload

```json
{
  "action": "create_coupon",
  "stake_amount": 100,
  "selections": [
    {
      "question_id": "uuid",
      "vote": "yes",
      "odds": 1.8,
      "is_boosted": false
    }
  ]
}
```
