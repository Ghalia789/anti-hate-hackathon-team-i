# Backend API Examples

## Using curl

### Health Check
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000000",
  "gdpr_compliant": true,
  "stateless": true
}
```

### Analyze Single Text
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a test message to analyze."
  }'
```

**Response:**
```json
{
  "analysis": [
    [
      {
        "label": "nothate",
        "score": 0.9234
      },
      {
        "label": "hate",
        "score": 0.0766
      }
    ]
  ],
  "text_length": 37,
  "timestamp": "2024-01-01T12:00:00.000000",
  "privacy_note": "No data stored - stateless processing"
}
```

### Batch Analyze
```bash
curl -X POST http://localhost:5000/api/batch-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "texts": [
      "First text to analyze",
      "Second text to analyze",
      "Third text to analyze"
    ]
  }'
```

**Response:**
```json
{
  "results": [
    {
      "index": 0,
      "analysis": [[...]],
      "text_length": 21
    },
    {
      "index": 1,
      "analysis": [[...]],
      "text_length": 22
    },
    {
      "index": 2,
      "analysis": [[...]],
      "text_length": 21
    }
  ],
  "timestamp": "2024-01-01T12:00:00.000000",
  "privacy_note": "No data stored - stateless processing"
}
```

## Using Python requests

```python
import requests

# Base URL
BASE_URL = "http://localhost:5000/api"

# Health check
response = requests.get(f"{BASE_URL}/health")
print(response.json())

# Analyze text
response = requests.post(
    f"{BASE_URL}/analyze",
    json={"text": "Your text here"}
)
print(response.json())

# Batch analyze
response = requests.post(
    f"{BASE_URL}/batch-analyze",
    json={"texts": ["Text 1", "Text 2", "Text 3"]}
)
print(response.json())
```

## Using JavaScript fetch

```javascript
// Base URL
const BASE_URL = '/api';

// Health check
fetch(`${BASE_URL}/health`)
  .then(res => res.json())
  .then(data => console.log(data));

// Analyze text
fetch(`${BASE_URL}/analyze`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Your text here'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));

// Batch analyze
fetch(`${BASE_URL}/batch-analyze`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    texts: ['Text 1', 'Text 2', 'Text 3']
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required field: text"
}
```

### 504 Gateway Timeout
```json
{
  "error": "Request timeout - API took too long to respond"
}
```

### 503 Service Unavailable
```json
{
  "error": "Failed to connect to analysis service",
  "details": "Connection error details"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

## Input Validation

- **Maximum text length**: 5000 characters
- **Minimum text length**: 1 character (non-empty)
- **Batch maximum**: 10 texts per request
- **Content-Type**: Must be `application/json`

## Rate Limiting

Currently no rate limiting implemented (stateless architecture).

For production, consider:
- API gateway rate limiting
- Per-IP rate limiting (without storing data)
- Token bucket algorithm

## Privacy Notes

Every API response includes:
```json
{
  "privacy_note": "No data stored - stateless processing"
}
```

This reminds users that:
- No text is stored on the server
- No logs are kept of user inputs
- Each request is independent
- All processing is in-memory only

## Testing the API

### Test Empty Text
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": ""}'
```

Expected: 400 error

### Test Too Long Text
```bash
# Text longer than 5000 characters
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "'$(python3 -c 'print("a" * 5001)')'"}'
```

Expected: 400 error

### Test Missing Field
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{}'
```

Expected: 400 error

### Test Batch Too Large
```bash
curl -X POST http://localhost:5000/api/batch-analyze \
  -H "Content-Type: application/json" \
  -d '{"texts": ["1","2","3","4","5","6","7","8","9","10","11"]}'
```

Expected: 400 error (max 10 texts)
