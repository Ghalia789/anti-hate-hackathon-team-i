/**
 * Background service worker for HeartShield AI extension
 * Handles messages between content scripts and popup
 */

const DEFAULT_API_URL = 'http://localhost:5000/api'

chrome.runtime.onInstalled.addListener(() => {
  console.log('💜 HeartShield AI Extension installed')
  
  // Set default settings
  chrome.storage.sync.set({ 
    isActive: false,
    apiUrl: DEFAULT_API_URL,
    stats: { analyzed: 0, blocked: 0 }
  })
})

// Listen for messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeText') {
    analyzeText(request.text)
      .then(result => {
        // Update stats
        chrome.storage.sync.get(['stats'], (data) => {
          const stats = data.stats || { analyzed: 0, blocked: 0 }
          stats.analyzed++
          if (result.toxicity?.is_toxic) stats.blocked++
          chrome.storage.sync.set({ stats })
        })
        
        sendResponse({ success: true, result })
      })
      .catch(error => {
        console.error('Analysis error:', error)
        sendResponse({ success: false, error: error.message })
      })
    
    return true // Keep channel open for async response
  }
  
  if (request.action === 'openPopup') {
    // Can't programmatically open popup, but we can show notification
    chrome.action.openPopup?.() // Only works in some contexts
  }
  
  if (request.action === 'getStats') {
    chrome.storage.sync.get(['stats'], (data) => {
      sendResponse({ stats: data.stats || { analyzed: 0, blocked: 0 } })
    })
    return true
  }
})

async function analyzeText(text) {
  const { apiUrl } = await chrome.storage.sync.get(['apiUrl'])
  const url = apiUrl || DEFAULT_API_URL
  
  const response = await fetch(`${url}/analyze`, {
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

// Update badge when extension is active/inactive
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.isActive) {
    const isActive = changes.isActive.newValue
    
    // Update badge
    chrome.action.setBadgeText({ 
      text: isActive ? 'ON' : '' 
    })
    chrome.action.setBadgeBackgroundColor({ 
      color: isActive ? '#10b981' : '#ef4444' 
    })
  }
})
