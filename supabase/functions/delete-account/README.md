# delete-account

Authenticated user account deletion endpoint.

## Request body

```json
{
  "userId": "optional-user-id"
}
```

- If `userId` is omitted, the current user is deleted.
- Deleting another user requires `profiles.is_admin = true` for the requester.

## Response

```json
{
  "success": true,
  "userId": "uuid"
}
```
