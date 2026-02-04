# 📱 Slack Command Quick Reference

## Essential Commands

### Status Checks
```
/agent git status
/agent git log -n 5
```

### Testing
```
/agent flutter test
/agent npm test
/agent make ci
```

### Building
```
/agent npm run build
/agent flutter build web
```

### Code Quality
```
/agent flutter analyze
/agent npm run lint
/agent dart format .
```

### Database
```
/agent supabase db push
/agent make db_verify_rls
```

## Response Format

✅ **Success**: Inline (≤20 lines) or file attachment (>20 lines)  
❌ **Error**: Always inline with error details

## Security

🔒 **Protected**: No `.git/config`, auth files, or secrets exposure  
🛡️ **Sanitized**: Tokens/passwords automatically redacted

## Need Help?

See full docs: `docs/operational/SLACK_INTEGRATION.md`
