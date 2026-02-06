# Stateless Architecture Documentation

## Overview
This application implements a **fully stateless, GDPR-compliant** architecture for hate speech detection.

## Key Principles

### 1. No Data Persistence
- **No Database**: All processing happens in-memory
- **No Sessions**: No server-side session storage
- **No Cookies**: No tracking or persistent identifiers
- **No localStorage**: Frontend doesn't store any data locally

### 2. Stateless Processing
Every request is independent and self-contained:
- No state carried between requests
- No user tracking or profiling
- No data retention or logging of user inputs

### 3. GDPR Compliance
- ✅ Right to be forgotten: No data to forget
- ✅ Data minimization: Only process, never store
- ✅ Purpose limitation: Only used for immediate analysis
- ✅ Transparency: Clear privacy notices throughout

## Architecture Diagram

```
┌─────────────┐         ┌──────────────┐         ┌──────────────────┐
│   Browser   │ ───────>│  Flask API   │ ───────>│ Hugging Face API │
│  (React)    │         │  (Stateless) │         │   (External)     │
└─────────────┘ <───────└──────────────┘ <───────└──────────────────┘
  No Storage        In-Memory Only           AI Processing
```

## Request Flow

1. **User Input**: User enters text in React frontend
2. **API Call**: Frontend sends POST request to Flask backend
3. **Processing**: Backend forwards to Hugging Face API
4. **Response**: Results returned immediately to frontend
5. **Cleanup**: All data discarded after response sent

## Implementation Details

### Backend (Flask)
- No Flask session configuration
- No database connections
- No file system writes (except logs)
- Each request is independent
- Immediate response, no queuing

### Frontend (React)
- No localStorage or sessionStorage usage
- No cookies set
- No client-side state persistence
- Form data cleared after each analysis

### Hosting (GCP App Engine)
- `session_affinity: false` - no sticky sessions
- Autoscaling with `min_instances: 0`
- Each instance is interchangeable
- No shared state between instances

## Privacy Features

### What We DON'T Do
❌ Store text inputs
❌ Log user data
❌ Track users
❌ Use cookies
❌ Create profiles
❌ Retain search history
❌ Use analytics
❌ Set identifiers

### What We DO
✅ Process text in-memory only
✅ Return immediate results
✅ Discard data after response
✅ Use HTTPS only
✅ Provide transparent privacy notices
✅ Enable anonymous usage

## Testing Statelessness

To verify statelessness:

1. **No Session Files**: Check that no session data exists
   ```bash
   ls backend/instance/  # Should not exist
   ```

2. **No Database**: Verify no database connections
   ```bash
   grep -r "sqlite\|postgres\|mysql" backend/  # Should find nothing
   ```

3. **No localStorage**: Check browser console
   ```javascript
   localStorage.length  // Should be 0
   document.cookie      // Should be empty
   ```

4. **Multiple Requests**: Send multiple requests from different clients
   - No request should know about previous requests
   - No shared state between requests

## Deployment Considerations

### Environment Variables
Store only non-sensitive configuration:
- API endpoints
- Feature flags
- Port numbers

Store sensitive data in GCP Secret Manager:
- API tokens (Hugging Face)
- Encryption keys

### Monitoring
Monitor only aggregated metrics:
- Request count
- Response times
- Error rates

Never log:
- User inputs
- IP addresses (beyond short-term access logs)
- Any personally identifiable information

## Benefits

1. **Privacy**: Users have complete anonymity
2. **Compliance**: Meets GDPR requirements by design
3. **Simplicity**: No database management overhead
4. **Scalability**: Stateless services scale horizontally
5. **Performance**: No database queries slow down requests
6. **Cost**: No database hosting costs
7. **Security**: No stored data to breach

## Limitations

1. **No User Accounts**: Can't save preferences or history
2. **No Rate Limiting**: Without state, harder to implement per-user limits
3. **No Analytics**: Can't track individual user behavior
4. **No Caching**: Each request processes independently

## Hackathon Benefits

Perfect for 24h hackathon:
- ✅ Fast setup - no database configuration
- ✅ Easy deployment - stateless services
- ✅ Focus on features - not infrastructure
- ✅ No data management - no migrations
- ✅ Privacy-first - ethical by default
