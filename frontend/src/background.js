/**
 * Background service worker for the extension
 * Handles messages between content scripts and popup
 */

chrome.runtime.onInstalled.addListener(() => {
  console.log('Anti-Hate Speech Extension installed')
  
  // Set default settings
  chrome.storage.sync.set({ 
    isActive: false,
    apiUrl: 'http://localhost:5000/api'
  })
})

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeText') {
    // Forward analysis request to API
    analyzeText(request.text)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }))
    
    return true // Keep channel open for async response
  }
})

async function analyzeText(text) {
  const { apiUrl } = await chrome.storage.sync.get(['apiUrl'])
  
  const response = await fetch(`${apiUrl}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  })
  
  if (!response.ok) {
    throw new Error('Failed to analyze text')
  }
  
  return await response.json()
}
