/**
 * Content script for real-time hate speech detection
 * Monitors text input and textarea elements on web pages
 */

let isActive = false
let debounceTimer = null
const DEBOUNCE_DELAY = 1000 // Wait 1 second after user stops typing

// Load settings
chrome.storage.sync.get(['isActive'], (data) => {
  isActive = data.isActive || false
  if (isActive) {
    initializeDetection()
  }
})

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleDetection') {
    isActive = request.isActive
    if (isActive) {
      initializeDetection()
    } else {
      removeDetection()
    }
  }
})

function initializeDetection() {
  console.log('Anti-hate detection initialized')
  
  // Monitor all text inputs and textareas
  const textElements = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]')
  
  textElements.forEach(element => {
    element.addEventListener('input', handleTextInput)
  })
  
  // Also monitor dynamically added elements
  observeDOM()
}

function removeDetection() {
  console.log('Anti-hate detection disabled')
  
  const textElements = document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]')
  
  textElements.forEach(element => {
    element.removeEventListener('input', handleTextInput)
  })
}

function handleTextInput(event) {
  if (!isActive) return
  
  const text = event.target.value || event.target.innerText
  
  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  // Set new timer
  debounceTimer = setTimeout(() => {
    if (text && text.length > 10) {
      analyzeText(text, event.target)
    }
  }, DEBOUNCE_DELAY)
}

async function analyzeText(text, element) {
  try {
    // Send message to background script
    chrome.runtime.sendMessage(
      { action: 'analyzeText', text },
      (response) => {
        if (response && response.success) {
          displayResult(response.result, element)
        }
      }
    )
  } catch (error) {
    console.error('Analysis error:', error)
  }
}

function displayResult(result, element) {
  // Remove any existing warning
  const existingWarning = element.parentElement.querySelector('.hate-speech-warning')
  if (existingWarning) {
    existingWarning.remove()
  }
  
  // Only show warning if toxic content detected
  if (result.toxicity.is_toxic) {
    const warning = document.createElement('div')
    warning.className = 'hate-speech-warning'
    warning.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #ff4444, #cc0000);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        margin-top: 4px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(255, 68, 68, 0.3);
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <span>Warning: Potentially toxic content detected</span>
      </div>
    `
    
    element.parentElement.insertBefore(warning, element.nextSibling)
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      warning.remove()
    }, 5000)
  }
}

function observeDOM() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) { // Element node
          const textElements = node.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]')
          textElements.forEach(element => {
            element.addEventListener('input', handleTextInput)
          })
        }
      })
    })
  })
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  })
}
