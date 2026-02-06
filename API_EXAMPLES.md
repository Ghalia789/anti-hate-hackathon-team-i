# API Examples

## Using cURL

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Analyze Single Text
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "This is a wonderful day!"
  }'
```

### Analyze Toxic Text
```bash
curl -X POST http://localhost:5000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "text": "I hate you and everything you stand for!"
  }'
```

### Batch Analysis
```bash
curl -X POST http://localhost:5000/api/batch-analyze \
  -H "Content-Type: application/json" \
  -d '{
    "texts": [
      "Great product!",
      "Terrible service, worst experience ever!",
      "It was okay, nothing special"
    ]
  }'
```

## Using Python

```python
import requests

API_URL = "http://localhost:5000/api"

# Analyze text
def analyze_text(text):
    response = requests.post(
        f"{API_URL}/analyze",
        json={"text": text}
    )
    return response.json()

# Example
result = analyze_text("This is amazing!")
print(f"Sentiment: {result['sentiment']['label']}")
print(f"Score: {result['sentiment']['score']}")
print(f"Is Toxic: {result['toxicity']['is_toxic']}")
```

## Using JavaScript

```javascript
const API_URL = 'http://localhost:5000/api';

async function analyzeText(text) {
  const response = await fetch(`${API_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  });
  
  return await response.json();
}

// Example
analyzeText('This is fantastic!')
  .then(result => {
    console.log('Sentiment:', result.sentiment.label);
    console.log('Is Toxic:', result.toxicity.is_toxic);
  });
```

## Response Examples

### Positive Sentiment
```json
{
  "sentiment": {
    "label": "positive",
    "score": 0.9876
  },
  "toxicity": {
    "is_toxic": false,
    "scores": {
      "toxic": 0.0023,
      "severe_toxic": 0.0001,
      "obscene": 0.0012,
      "threat": 0.0005,
      "insult": 0.0018,
      "identity_hate": 0.0003
    }
  },
  "text_length": 20,
  "timestamp": "2026-02-06T12:00:00.000Z"
}
```

### Toxic Content
```json
{
  "sentiment": {
    "label": "negative",
    "score": 0.9534
  },
  "toxicity": {
    "is_toxic": true,
    "scores": {
      "toxic": 0.8756,
      "severe_toxic": 0.1234,
      "obscene": 0.6543,
      "threat": 0.3421,
      "insult": 0.7890,
      "identity_hate": 0.2345
    }
  },
  "text_length": 35,
  "timestamp": "2026-02-06T12:00:00.000Z"
}
```

## Using Postman

1. **Import Collection**
   - Create new request
   - Set method to POST
   - URL: `http://localhost:5000/api/analyze`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "text": "Your text here"
   }
   ```

2. **Save and Test**
   - Click Send
   - View response in the body section

## Rate Limits

- **Single analysis**: No limit
- **Batch analysis**: Max 50 texts per request
- **Text length**: Max 5000 characters
- **Concurrent requests**: Depends on server capacity

## Error Responses

### Invalid Request
```json
{
  "error": "Missing required field: text"
}
```

### Text Too Long
```json
{
  "error": "Text too long (max 5000 characters)"
}
```

### Server Error
```json
{
  "error": "Internal server error",
  "details": "Error message here"
}
```
