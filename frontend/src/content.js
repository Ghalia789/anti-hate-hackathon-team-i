/**
 * HeartShield AI - Advanced Content Protection
 * Real-time hate speech detection with multilingual support
 * Features: Word highlighting, content blur, child mode, multi-language alerts
 */

let isActive = false
let isChildMode = false
let debounceTimer = null
let fabElement = null
let isAnalyzing = false
const DEBOUNCE_DELAY = 500

// Hate speech keywords for instant detection (basic filter before API)
const HATE_KEYWORDS = {
  en: ['fuck', 'shit', 'bitch', 'asshole', 'nigger', 'faggot', 'retard', 'cunt', 'whore', 'slut', 'bastard', 'damn', 'hate you', 'kill yourself', 'die', 'idiot', 'stupid', 'moron', 'dumb'],
  fr: ['merde', 'putain', 'salope', 'connard', 'enculé', 'pute', 'nique', 'batard', 'con', 'fdp', 'ta gueule', 'je te hais', 'crève', 'débile', 'abruti', 'imbécile'],
  ar: ['كس', 'زب', 'شرموط', 'عاهر', 'ابن الكلب', 'منيوك', 'كلب', 'حمار', 'غبي', 'أحمق', 'اخرس', 'موت'],
  it: ['cazzo', 'merda', 'puttana', 'stronzo', 'vaffanculo', 'troia', 'bastardo', 'idiota', 'stupido', 'cretino', 'ti odio', 'muori']
}

// Warning messages in each language
const WARNING_MESSAGES = {
  en: {
    title: '⚠️ Warning: Harmful Content',
    description: 'This content may contain hate speech or offensive language.',
    blocked: '🚫 Content Blocked for Safety',
    sending: '⚠️ Your message contains potentially harmful content. Are you sure you want to send it?',
    childBlock: '🛡️ This content has been blocked to protect you.'
  },
  fr: {
    title: '⚠️ Attention : Contenu Nuisible',
    description: 'Ce contenu peut contenir des propos haineux ou offensants.',
    blocked: '🚫 Contenu Bloqué pour Votre Sécurité',
    sending: '⚠️ Votre message contient du contenu potentiellement nuisible. Êtes-vous sûr de vouloir l\'envoyer?',
    childBlock: '🛡️ Ce contenu a été bloqué pour votre protection.'
  },
  ar: {
    title: '⚠️ تحذير: محتوى ضار',
    description: 'قد يحتوي هذا المحتوى على خطاب كراهية أو لغة مسيئة.',
    blocked: '🚫 تم حظر المحتوى لسلامتك',
    sending: '⚠️ رسالتك تحتوي على محتوى قد يكون ضاراً. هل أنت متأكد من إرسالها؟',
    childBlock: '🛡️ تم حظر هذا المحتوى لحمايتك.'
  },
  it: {
    title: '⚠️ Avviso: Contenuto Dannoso',
    description: 'Questo contenuto potrebbe contenere linguaggio offensivo o incitamento all\'odio.',
    blocked: '🚫 Contenuto Bloccato per Sicurezza',
    sending: '⚠️ Il tuo messaggio contiene contenuti potenzialmente dannosi. Sei sicuro di volerlo inviare?',
    childBlock: '🛡️ Questo contenuto è stato bloccato per proteggerti.'
  }
}

// Inject styles
const injectStyles = () => {
  if (document.getElementById('heartshield-styles')) return
  
  const style = document.createElement('style')
  style.id = 'heartshield-styles'
  style.textContent = `
    /* Floating Action Button - HeartShield Edition */
    #heartshield-fab {
      position: fixed;
      bottom: 24px;
      right: 24px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: linear-gradient(135deg, #00d4ff 0%, #5b7fff 50%, #a855f7 100%);
      box-shadow: 0 4px 20px rgba(91, 127, 255, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 2147483647;
      transition: all 0.3s ease;
      border: none;
      outline: none;
      opacity: 0;
      transform: scale(0.5);
      pointer-events: none;
    }
    
    #heartshield-fab.visible {
      opacity: 1;
      transform: scale(1);
      pointer-events: auto;
    }
    
    #heartshield-fab:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 28px rgba(91, 127, 255, 0.6), 0 0 30px rgba(168, 85, 247, 0.3);
    }
    
    #heartshield-fab.active {
      background: linear-gradient(135deg, #00d4ff 0%, #5b7fff 50%, #a855f7 100%);
      box-shadow: 0 4px 20px rgba(0, 212, 255, 0.5);
    }
    
    #heartshield-fab.child-mode {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4);
    }
    
    #heartshield-fab.analyzing {
      animation: fabPulse 1.5s ease-in-out infinite;
    }
    
    #heartshield-fab.toxic {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
      box-shadow: 0 4px 20px rgba(239, 68, 68, 0.4);
      animation: fabShake 0.5s ease;
    }
    
    @keyframes fabPulse {
      0%, 100% { box-shadow: 0 4px 20px rgba(91, 127, 255, 0.4); }
      50% { box-shadow: 0 4px 35px rgba(91, 127, 255, 0.7), 0 0 40px rgba(168, 85, 247, 0.5); }
    }
    
    @keyframes fabShake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-4px); }
      40% { transform: translateX(4px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
    
    #heartshield-fab svg {
      width: 32px;
      height: 32px;
      transition: transform 0.3s ease;
    }
    
    #heartshield-fab.analyzing svg {
      animation: fabSpin 1s linear infinite;
    }
    
    @keyframes fabSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    /* Status Ring */
    #heartshield-fab .status-ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 3px solid transparent;
      border-top-color: white;
      opacity: 0;
    }
    
    #heartshield-fab.analyzing .status-ring {
      opacity: 0.6;
      animation: ringRotate 1s linear infinite;
    }
    
    @keyframes ringRotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    
    /* Tooltip */
    #heartshield-fab .fab-tooltip {
      position: absolute;
      right: 70px;
      background: rgba(17, 24, 39, 0.95);
      color: white;
      padding: 10px 14px;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      transform: translateX(10px);
      transition: all 0.2s ease;
      pointer-events: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    #heartshield-fab .fab-tooltip::after {
      content: '';
      position: absolute;
      right: -6px;
      top: 50%;
      transform: translateY(-50%);
      border-width: 6px;
      border-style: solid;
      border-color: transparent transparent transparent rgba(17, 24, 39, 0.95);
    }
    
    #heartshield-fab:hover .fab-tooltip {
      opacity: 1;
      transform: translateX(0);
    }
    
    /* Highlighted hate word */
    .safeguard-hate-word {
      background: linear-gradient(135deg, #fecaca, #fee2e2);
      color: #dc2626 !important;
      border-bottom: 2px solid #ef4444;
      padding: 0 2px;
      border-radius: 3px;
      font-weight: 600;
      animation: wordPulse 1s ease-in-out infinite;
    }
    
    @keyframes wordPulse {
      0%, 100% { background: linear-gradient(135deg, #fecaca, #fee2e2); }
      50% { background: linear-gradient(135deg, #fca5a5, #fecaca); }
    }
    
    /* Hate word with blur effect (for existing content) */
    .safeguard-hate-word-blur {
      background: linear-gradient(135deg, #ef4444, #dc2626) !important;
      color: transparent !important;
      text-shadow: 0 0 8px rgba(220, 38, 38, 0.8) !important;
      filter: blur(4px) !important;
      padding: 2px 4px !important;
      border-radius: 4px !important;
      transition: all 0.3s ease !important;
      cursor: pointer !important;
      user-select: none !important;
    }
    
    .safeguard-hate-word-blur:hover {
      filter: blur(2px) !important;
      text-shadow: 0 0 4px rgba(220, 38, 38, 0.6) !important;
    }
    
    .safeguard-hate-word-blur.revealed {
      filter: none !important;
      color: #dc2626 !important;
      text-shadow: none !important;
      background: linear-gradient(135deg, #fecaca, #fee2e2) !important;
    }
    
    /* Blurred toxic content in feed */
    .safeguard-blurred {
      filter: blur(8px) !important;
      user-select: none !important;
      pointer-events: none !important;
      position: relative !important;
    }
    
    .safeguard-blurred-container {
      position: relative !important;
      border: 3px solid #ef4444 !important;
      border-radius: 12px !important;
      overflow: hidden !important;
    }
    
    /* Warning overlay for blurred content */
    .safeguard-blur-overlay {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: rgba(239, 68, 68, 0.15) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 1000 !important;
      backdrop-filter: blur(2px) !important;
    }
    
    .safeguard-blur-warning {
      background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
      color: white !important;
      padding: 16px 24px !important;
      border-radius: 12px !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      text-align: center !important;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
      max-width: 300px !important;
    }
    
    .safeguard-blur-warning h4 {
      font-size: 16px !important;
      font-weight: 700 !important;
      margin: 0 0 8px 0 !important;
    }
    
    .safeguard-blur-warning p {
      font-size: 13px !important;
      margin: 0 0 12px 0 !important;
      opacity: 0.9 !important;
    }
    
    .safeguard-reveal-btn {
      background: rgba(255, 255, 255, 0.2) !important;
      border: 1px solid rgba(255, 255, 255, 0.3) !important;
      color: white !important;
      padding: 8px 16px !important;
      border-radius: 8px !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
    }
    
    .safeguard-reveal-btn:hover {
      background: rgba(255, 255, 255, 0.3) !important;
    }
    
    /* Child mode - complete block */
    .safeguard-child-block {
      filter: blur(20px) grayscale(100%) !important;
      user-select: none !important;
      pointer-events: none !important;
    }
    
    .safeguard-child-overlay {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: linear-gradient(135deg, #1f2937, #111827) !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 1000 !important;
      border-radius: 12px !important;
    }
    
    .safeguard-child-warning {
      text-align: center !important;
      color: white !important;
      padding: 24px !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    
    .safeguard-child-warning .shield-icon {
      width: 64px !important;
      height: 64px !important;
      margin-bottom: 16px !important;
      color: #f59e0b !important;
    }
    
    .safeguard-child-warning h4 {
      font-size: 18px !important;
      font-weight: 700 !important;
      margin: 0 0 8px 0 !important;
      color: #f59e0b !important;
    }
    
    .safeguard-child-warning p {
      font-size: 14px !important;
      margin: 0 !important;
      opacity: 0.8 !important;
    }
    
    /* Sending alert modal */
    .safeguard-send-alert {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: rgba(0, 0, 0, 0.7) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 2147483646 !important;
      animation: fadeIn 0.3s ease !important;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    .safeguard-send-alert-box {
      background: linear-gradient(135deg, #12122a 0%, #0a0a1a 100%) !important;
      border-radius: 16px !important;
      padding: 24px !important;
      max-width: 400px !important;
      width: 90% !important;
      box-shadow: 0 25px 50px rgba(233, 30, 140, 0.2), 0 0 60px rgba(0, 0, 0, 0.5) !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      animation: slideUp 0.3s ease !important;
      border: 1px solid rgba(233, 30, 140, 0.3) !important;
    }
    
    @keyframes slideUp {
      from { transform: translateY(20px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
    
    .safeguard-send-alert-header {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      margin-bottom: 16px !important;
    }
    
    .safeguard-send-alert-icon {
      width: 48px !important;
      height: 48px !important;
      background: linear-gradient(135deg, rgba(233, 30, 140, 0.2), rgba(255, 51, 102, 0.1)) !important;
      border-radius: 12px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #e91e8c !important;
    }
    
    .safeguard-send-alert-title {
      font-size: 18px !important;
      font-weight: 700 !important;
      color: #ffffff !important;
      margin: 0 !important;
    }
    
    .safeguard-send-alert-text {
      font-size: 14px !important;
      color: #9999bb !important;
      line-height: 1.6 !important;
      margin: 0 0 20px 0 !important;
    }
    
    .safeguard-send-alert-words {
      background: rgba(233, 30, 140, 0.1) !important;
      border: 1px solid rgba(233, 30, 140, 0.3) !important;
      border-radius: 8px !important;
      padding: 12px !important;
      margin-bottom: 20px !important;
    }
    
    .safeguard-send-alert-words-title {
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #e91e8c !important;
      margin-bottom: 8px !important;
    }
    
    .safeguard-send-alert-words-list {
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 6px !important;
    }
    
    .safeguard-flagged-word {
      background: linear-gradient(135deg, #e91e8c, #c41874) !important;
      color: white !important;
      padding: 4px 10px !important;
      border-radius: 6px !important;
      font-size: 12px !important;
      font-weight: 600 !important;
    }
    
    .safeguard-send-alert-buttons {
      display: flex !important;
      gap: 12px !important;
    }
    
    .safeguard-btn-cancel {
      flex: 1 !important;
      padding: 12px !important;
      background: rgba(255, 255, 255, 0.1) !important;
      border: 1px solid rgba(255, 255, 255, 0.2) !important;
      border-radius: 10px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      color: #fff !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
    }
    
    .safeguard-btn-cancel:hover {
      background: rgba(255, 255, 255, 0.2) !important;
    }
    
    .safeguard-btn-send {
      flex: 1 !important;
      padding: 12px !important;
      background: linear-gradient(135deg, #e91e8c, #c41874) !important;
      border: none !important;
      border-radius: 10px !important;
      font-size: 14px !important;
      font-weight: 600 !important;
      color: white !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
    }
    
    .safeguard-btn-send:hover {
      transform: translateY(-1px) !important;
      box-shadow: 0 4px 20px rgba(233, 30, 140, 0.5) !important;
    }
    
    /* Toast notification */
    .safeguard-toast {
      position: fixed !important;
      bottom: 100px !important;
      right: 24px !important;
      max-width: 340px !important;
      background: linear-gradient(135deg, #12122a 0%, #0a0a1a 100%) !important;
      border-radius: 16px !important;
      box-shadow: 0 10px 40px rgba(233, 30, 140, 0.2), 0 4px 20px rgba(0, 0, 0, 0.4) !important;
      z-index: 2147483645 !important;
      overflow: hidden !important;
      transform: translateX(120%) !important;
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    
    .safeguard-toast.visible {
      transform: translateX(0) !important;
    }
    
    .safeguard-toast.toxic {
      border-left: 4px solid #e91e8c !important;
    }
    
    .safeguard-toast.safe {
      border-left: 4px solid #00d4ff !important;
    }
    
    .safeguard-toast-header {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      padding: 16px 16px 12px !important;
    }
    
    .safeguard-toast-icon {
      width: 44px !important;
      height: 44px !important;
      border-radius: 12px !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
    }
    
    .safeguard-toast.toxic .safeguard-toast-icon {
      background: linear-gradient(135deg, rgba(233, 30, 140, 0.2), rgba(196, 24, 116, 0.1)) !important;
      color: #e91e8c !important;
    }
    
    .safeguard-toast.safe .safeguard-toast-icon {
      background: linear-gradient(135deg, rgba(0, 212, 255, 0.2), rgba(0, 168, 204, 0.1)) !important;
      color: #00d4ff !important;
    }
    
    .safeguard-toast-icon svg {
      width: 24px !important;
      height: 24px !important;
    }
    
    .safeguard-toast-content {
      flex: 1 !important;
    }
    
    .safeguard-toast-title {
      font-size: 15px !important;
      font-weight: 700 !important;
      margin-bottom: 2px !important;
    }
    
    .safeguard-toast.toxic .safeguard-toast-title { color: #e91e8c !important; }
    .safeguard-toast.safe .safeguard-toast-title { color: #00d4ff !important; }
    
    .safeguard-toast-desc {
      font-size: 13px !important;
      color: #9999bb !important;
    }
    
    .safeguard-toast-close {
      position: absolute !important;
      top: 12px !important;
      right: 12px !important;
      width: 28px !important;
      height: 28px !important;
      border: none !important;
      background: rgba(255, 255, 255, 0.1) !important;
      border-radius: 8px !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      color: #9999bb !important;
      transition: all 0.2s ease !important;
    }
    
    .safeguard-toast-close:hover {
      background: rgba(255, 255, 255, 0.2) !important;
      color: #fff !important;
    }
    
    /* Input highlight borders */
    .safeguard-input-warning {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5) !important;
      border-color: #ef4444 !important;
    }
    
    .safeguard-input-safe {
      box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.4) !important;
      border-color: #00d4ff !important;
    }
    
    /* Warning bar for hate speech content */
    .safeguard-warning-bar {
      background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
      color: white !important;
      padding: 8px 12px !important;
      font-size: 13px !important;
      font-weight: 600 !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      border-radius: 8px 8px 0 0 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    }
    
    /* Mirror overlay to highlight hate words RED while typing */
    .safeguard-mirror-container {
      position: relative !important;
    }
    
    .safeguard-mirror-overlay {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      pointer-events: none !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      overflow: hidden !important;
      color: transparent !important;
      z-index: 1 !important;
    }
    
    .safeguard-mirror-overlay .safeguard-mirror-hate {
      color: #ef4444 !important;
      background: rgba(239, 68, 68, 0.15) !important;
      border-bottom: 2px solid #ef4444 !important;
      border-radius: 2px !important;
      font-weight: 700 !important;
      padding: 0 1px !important;
    }
    
    /* Child mode blocked alert - no send option */
    .safeguard-child-blocked-alert {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      background: rgba(0, 0, 0, 0.8) !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 2147483646 !important;
      animation: fadeIn 0.3s ease !important;
    }
    
    .safeguard-child-blocked-box {
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%) !important;
      border-radius: 20px !important;
      padding: 32px !important;
      max-width: 380px !important;
      width: 90% !important;
      text-align: center !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      animation: slideUp 0.3s ease !important;
      border: 2px solid #f59e0b !important;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(245, 158, 11, 0.2) !important;
    }
    
    .safeguard-child-blocked-box .shield-big {
      width: 72px !important;
      height: 72px !important;
      margin: 0 auto 16px !important;
      color: #f59e0b !important;
    }
    
    .safeguard-child-blocked-box h3 {
      color: #f59e0b !important;
      font-size: 20px !important;
      font-weight: 700 !important;
      margin: 0 0 12px 0 !important;
    }
    
    .safeguard-child-blocked-box p {
      color: #9ca3af !important;
      font-size: 14px !important;
      line-height: 1.6 !important;
      margin: 0 0 20px 0 !important;
    }
    
    .safeguard-child-blocked-box .btn-ok {
      background: linear-gradient(135deg, #f59e0b, #d97706) !important;
      border: none !important;
      color: white !important;
      padding: 12px 40px !important;
      border-radius: 10px !important;
      font-size: 15px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      transition: all 0.2s ease !important;
    }
    
    .safeguard-child-blocked-box .btn-ok:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 4px 20px rgba(245, 158, 11, 0.4) !important;
    }
  `
  document.head.appendChild(style)
}

// Detect language from text
const detectLanguage = (text) => {
  const arabicPattern = /[\u0600-\u06FF]/
  const frenchPattern = /[àâäéèêëïîôùûüÿçœæ]/i
  const italianPattern = /[àèéìíîòóùú]/i
  
  if (arabicPattern.test(text)) return 'ar'
  
  // Check for French-specific words
  const frenchWords = ['je', 'tu', 'nous', 'vous', 'ils', 'les', 'une', 'des', 'est', 'sont', 'avec', 'pour', 'dans', 'sur', 'mais', 'que', 'qui']
  const italianWords = ['io', 'tu', 'noi', 'voi', 'loro', 'sono', 'sei', 'siamo', 'essere', 'avere', 'della', 'quello', 'questa', 'molto', 'anche', 'solo', 'perché']
  
  const words = text.toLowerCase().split(/\s+/)
  const frenchCount = words.filter(w => frenchWords.includes(w) || frenchPattern.test(w)).length
  const italianCount = words.filter(w => italianWords.includes(w) || italianPattern.test(w)).length
  
  if (frenchCount > italianCount && frenchCount > 0) return 'fr'
  if (italianCount > frenchCount && italianCount > 0) return 'it'
  
  return 'en' // Default to English
}

// Find hate words in text
const findHateWords = (text) => {
  const foundWords = []
  const lowerText = text.toLowerCase()
  const lang = detectLanguage(text)
  
  // Check all languages
  Object.entries(HATE_KEYWORDS).forEach(([language, words]) => {
    words.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      let match
      while ((match = regex.exec(lowerText)) !== null) {
        foundWords.push({
          word: match[0],
          index: match.index,
          length: word.length,
          language
        })
      }
    })
  })
  
  return { foundWords, detectedLang: lang }
}

// Highlight hate words in text - returns HTML with highlighted words
const highlightHateWordsInText = (text, foundWords) => {
  if (!foundWords || foundWords.length === 0) return text
  
  // Sort by index descending to replace from end to start
  const sortedWords = [...foundWords].sort((a, b) => b.index - a.index)
  let result = text
  
  sortedWords.forEach(({ index, word }) => {
    const before = result.substring(0, index)
    const after = result.substring(index + word.length)
    result = before + `<span class="safeguard-hate-word">${word}</span>` + after
  })
  
  return result
}

// Highlight hate words with blur effect for existing content
const highlightAndBlurHateWords = (element, foundWords) => {
  if (!foundWords || foundWords.length === 0) return
  
  const text = element.innerText || element.textContent
  const sortedWords = [...foundWords].sort((a, b) => b.index - a.index)
  
  // Create a temporary container with highlighted words
  let htmlContent = text
  sortedWords.forEach(({ index, word }) => {
    const before = htmlContent.substring(0, index)
    const after = htmlContent.substring(index + word.length)
    htmlContent = before + `<span class="safeguard-hate-word-blur">${word}</span>` + after
  })
  
  element.innerHTML = htmlContent
}

// Create FAB element
const createFAB = () => {
  if (document.getElementById('heartshield-fab')) return
  
  fabElement = document.createElement('div')
  fabElement.id = 'heartshield-fab'
  fabElement.innerHTML = `
    <div class="status-ring"></div>
    <svg viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="fabShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00d4ff"/>
          <stop offset="50%" stop-color="#5b7fff"/>
          <stop offset="100%" stop-color="#a855f7"/>
        </linearGradient>
      </defs>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="url(#fabShieldGrad)" opacity="0.9"/>
      <path d="M12 8c-1.2-1.2-3-1.2-3 1.2 0 1.5 3 3.3 3 3.3s3-1.8 3-3.3c0-2.4-1.8-2.4-3-1.2z" fill="white" opacity="0.95"/>
    </svg>
    <div class="fab-tooltip">HeartShield AI - Protection Active</div>
  `
  
  document.body.appendChild(fabElement)
}

// Update FAB state
const updateFAB = (state, tooltipText) => {
  if (!fabElement) return
  
  fabElement.className = 'visible'
  
  if (isChildMode) fabElement.classList.add('child-mode')
  else if (state === 'active') fabElement.classList.add('active')
  else if (state === 'analyzing') fabElement.classList.add('analyzing')
  else if (state === 'toxic') fabElement.classList.add('toxic')
  
  const tooltip = fabElement.querySelector('.fab-tooltip')
  if (tooltip && tooltipText) tooltip.textContent = tooltipText
}

// Show send alert modal
const showSendAlert = (text, foundWords, lang, onConfirm, onCancel) => {
  const messages = WARNING_MESSAGES[lang] || WARNING_MESSAGES.en
  
  const modal = document.createElement('div')
  modal.className = 'safeguard-send-alert'
  modal.innerHTML = `
    <div class="safeguard-send-alert-box">
      <div class="safeguard-send-alert-header">
        <div class="safeguard-send-alert-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <h3 class="safeguard-send-alert-title">${messages.title}</h3>
      </div>
      <p class="safeguard-send-alert-text">${messages.sending}</p>
      <div class="safeguard-send-alert-words">
        <div class="safeguard-send-alert-words-title">🚫 ${lang === 'fr' ? 'Mots détectés' : lang === 'ar' ? 'الكلمات المكتشفة' : lang === 'it' ? 'Parole rilevate' : 'Detected words'}:</div>
        <div class="safeguard-send-alert-words-list">
          ${[...new Set(foundWords.map(w => w.word))].map(w => `<span class="safeguard-flagged-word">${w}</span>`).join('')}
        </div>
      </div>
      <div class="safeguard-send-alert-buttons">
        <button class="safeguard-btn-cancel">${lang === 'fr' ? 'Modifier' : lang === 'ar' ? 'تعديل' : lang === 'it' ? 'Modifica' : 'Edit'}</button>
        <button class="safeguard-btn-send">${lang === 'fr' ? 'Envoyer quand même' : lang === 'ar' ? 'إرسال على أي حال' : lang === 'it' ? 'Invia comunque' : 'Send Anyway'}</button>
      </div>
    </div>
  `
  
  document.body.appendChild(modal)
  
  modal.querySelector('.safeguard-btn-cancel').addEventListener('click', () => {
    modal.remove()
    onCancel()
  })
  
  modal.querySelector('.safeguard-btn-send').addEventListener('click', () => {
    modal.remove()
    onConfirm()
  })
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove()
      onCancel()
    }
  })
}

// Blur content with warning overlay - now also highlights hate words
const blurContent = (element, lang, foundWords = []) => {
  if (element.classList.contains('safeguard-processed')) return
  element.classList.add('safeguard-processed')
  
  const messages = WARNING_MESSAGES[lang] || WARNING_MESSAGES.en
  
  // First, highlight the hate words in the content
  if (foundWords.length > 0 && !isChildMode) {
    highlightAndBlurHateWords(element, foundWords)
    
    // Add click handlers to reveal individual words
    element.querySelectorAll('.safeguard-hate-word-blur').forEach(wordEl => {
      wordEl.addEventListener('click', () => {
        wordEl.classList.toggle('revealed')
      })
    })
  }
  
  // Wrap in container
  const container = document.createElement('div')
  container.className = 'safeguard-blurred-container'
  container.style.position = 'relative'
  element.parentNode.insertBefore(container, element)
  container.appendChild(element)
  
  if (isChildMode) {
    // Complete block for children - NO access at all
    element.classList.add('safeguard-child-block')
    element.style.visibility = 'hidden'
    
    const overlay = document.createElement('div')
    overlay.className = 'safeguard-child-overlay'
    overlay.innerHTML = `
      <div class="safeguard-child-warning">
        <svg class="shield-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
        <h4>${messages.blocked}</h4>
        <p>${messages.childBlock}</p>
        <div style="margin-top: 12px; font-size: 12px; opacity: 0.7;">
          🔒 ${lang === 'fr' ? 'Mode enfant activé - contenu masqué' : lang === 'ar' ? 'وضع الطفل مفعل - المحتوى مخفي' : lang === 'it' ? 'Modalità bambino attiva - contenuto nascosto' : 'Child mode active - content hidden'}
        </div>
      </div>
    `
    container.appendChild(overlay)
  } else {
    // For adults: words are already highlighted and blurred individually
    // Add a subtle warning bar at the top
    const warningBar = document.createElement('div')
    warningBar.className = 'safeguard-warning-bar'
    warningBar.innerHTML = `
      <span style="display: flex; align-items: center; gap: 6px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        ${messages.title}
      </span>
      <span style="font-size: 11px; opacity: 0.8;">${lang === 'fr' ? 'Cliquez sur les mots flous pour révéler' : lang === 'ar' ? 'انقر على الكلمات المموهة للكشف' : lang === 'it' ? 'Clicca sulle parole sfocate per rivelare' : 'Click blurred words to reveal'}</span>
    `
    container.insertBefore(warningBar, element)
  }
}

// Show toast notification  
const showToast = (result, lang) => {
  const existing = document.querySelector('.safeguard-toast')
  if (existing) existing.remove()
  
  const messages = WARNING_MESSAGES[lang] || WARNING_MESSAGES.en
  const isToxic = result.toxicity?.is_toxic
  
  const toast = document.createElement('div')
  toast.className = `safeguard-toast ${isToxic ? 'toxic' : 'safe'}`
  toast.innerHTML = `
    <button class="safeguard-toast-close">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
    <div class="safeguard-toast-header">
      <div class="safeguard-toast-icon">
        ${isToxic ? `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        ` : `
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        `}
      </div>
      <div class="safeguard-toast-content">
        <div class="safeguard-toast-title">${isToxic ? messages.title : (lang === 'fr' ? '✓ Contenu sûr' : lang === 'ar' ? '✓ محتوى آمن' : lang === 'it' ? '✓ Contenuto sicuro' : '✓ Content is Safe')}</div>
        <div class="safeguard-toast-desc">${lang.toUpperCase()} ${result.language?.dialect ? '(' + result.language.dialect + ')' : ''}</div>
      </div>
    </div>
  `
  
  document.body.appendChild(toast)
  requestAnimationFrame(() => toast.classList.add('visible'))
  
  toast.querySelector('.safeguard-toast-close').addEventListener('click', () => {
    toast.classList.remove('visible')
    setTimeout(() => toast.remove(), 400)
  })
  
  setTimeout(() => {
    toast.classList.remove('visible')
    setTimeout(() => toast.remove(), 400)
  }, 5000)
}

// Load settings
chrome.storage.sync.get(['isActive', 'isChildMode'], (data) => {
  isActive = data.isActive || false
  isChildMode = data.isChildMode || false
  if (isActive) {
    initializeDetection()
  }
})

// Listen for messages
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleDetection') {
    isActive = request.isActive
    if (isActive) initializeDetection()
    else removeDetection()
  }
  if (request.action === 'toggleChildMode') {
    isChildMode = request.isChildMode
    chrome.storage.sync.set({ isChildMode })
    if (fabElement) {
      updateFAB(isActive ? 'active' : '', isChildMode ? '🛡️ Child Mode Active' : 'SafeGuard AI - Protection Active')
    }
  }
})

function initializeDetection() {
  console.log('🛡️ SafeGuard AI: Protection activated')
  
  injectStyles()
  createFAB()
  updateFAB('active', isChildMode ? '🛡️ Child Mode Active' : 'SafeGuard AI - Protection Active')
  
  // Monitor text inputs
  document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(el => {
    el.addEventListener('input', handleTextInput)
    el.addEventListener('keydown', handleKeyDown)
  })
  
  // Scan existing content
  scanPageContent()
  
  // Observe DOM changes
  observeDOM()
}

function removeDetection() {
  console.log('🛡️ SafeGuard AI: Protection disabled')
  
  if (fabElement) fabElement.classList.remove('visible')
  
  document.querySelectorAll('input[type="text"], textarea, [contenteditable="true"]').forEach(el => {
    el.removeEventListener('input', handleTextInput)
    el.removeEventListener('keydown', handleKeyDown)
    el.classList.remove('safeguard-input-warning', 'safeguard-input-safe')
  })
  
  document.querySelectorAll('.safeguard-toast, .safeguard-send-alert').forEach(el => el.remove())
}

// Create or update mirror overlay to show hate words in RED while typing
function updateMirrorOverlay(element, text, foundWords) {
  let mirror = element._safeguardMirror
  
  if (!mirror) {
    // Make parent relative if needed
    const parent = element.parentElement
    if (parent && getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative'
    }
    
    mirror = document.createElement('div')
    mirror.className = 'safeguard-mirror-overlay'
    
    // Copy styles from the input
    const styles = getComputedStyle(element)
    mirror.style.font = styles.font
    mirror.style.padding = styles.padding
    mirror.style.lineHeight = styles.lineHeight
    mirror.style.letterSpacing = styles.letterSpacing
    mirror.style.border = '2px solid transparent'
    
    element.parentElement.insertBefore(mirror, element.nextSibling)
    element._safeguardMirror = mirror
  }
  
  if (foundWords.length === 0) {
    mirror.innerHTML = ''
    return
  }
  
  // Build highlighted HTML - hate words in red, rest transparent
  const sortedWords = [...foundWords].sort((a, b) => a.index - b.index)
  let html = ''
  let lastIndex = 0
  
  sortedWords.forEach(({ index, word }) => {
    // Transparent text before the hate word
    html += `<span style="color: transparent;">${escapeHtml(text.substring(lastIndex, index))}</span>`
    // Hate word in RED
    html += `<span class="safeguard-mirror-hate">${escapeHtml(word)}</span>`
    lastIndex = index + word.length
  })
  // Remaining text
  html += `<span style="color: transparent;">${escapeHtml(text.substring(lastIndex))}</span>`
  
  mirror.innerHTML = html
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function removeMirrorOverlay(element) {
  if (element._safeguardMirror) {
    element._safeguardMirror.remove()
    delete element._safeguardMirror
  }
}

function handleTextInput(event) {
  if (!isActive) return
  
  const text = event.target.value || event.target.innerText || ''
  if (!text || text.length < 3) {
    removeMirrorOverlay(event.target)
    return
  }
  
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const { foundWords, detectedLang } = findHateWords(text)
    
    if (foundWords.length > 0) {
      event.target.classList.add('safeguard-input-warning')
      event.target.classList.remove('safeguard-input-safe')
      updateFAB('toxic', `⚠️ ${foundWords.length} ${detectedLang === 'fr' ? 'mot(s) détecté(s)' : detectedLang === 'ar' ? 'كلمة مكتشفة' : detectedLang === 'it' ? 'parola/e rilevata/e' : 'word(s) detected'}`)
      
      // Highlight hate words in RED using mirror overlay
      updateMirrorOverlay(event.target, text, foundWords)
      
      // Store for submit interception
      event.target.dataset.safeguardWords = JSON.stringify(foundWords)
      event.target.dataset.safeguardLang = detectedLang
    } else {
      event.target.classList.remove('safeguard-input-warning')
      event.target.classList.add('safeguard-input-safe')
      updateFAB('active', isChildMode ? '🛡️ Child Mode Active' : '✓ Content looks safe')
      removeMirrorOverlay(event.target)
      delete event.target.dataset.safeguardWords
      delete event.target.dataset.safeguardLang
    }
    
    // Also send to API for deeper analysis
    analyzeWithAPI(text, event.target)
  }, DEBOUNCE_DELAY)
}

function handleKeyDown(event) {
  if (!isActive) return
  if (event.key !== 'Enter' || event.shiftKey) return
  
  const element = event.target
  const storedWords = element.dataset.safeguardWords
  
  if (storedWords) {
    const foundWords = JSON.parse(storedWords)
    const lang = element.dataset.safeguardLang || 'en'
    
    event.preventDefault()
    event.stopPropagation()
    
    if (isChildMode) {
      // CHILD MODE: Block completely - cannot send
      showChildBlockedAlert(lang, () => {
        // Clear the hate words from the input
        if (element.value !== undefined) {
          element.value = ''
        } else {
          element.innerText = ''
        }
        delete element.dataset.safeguardWords
        delete element.dataset.safeguardLang
        element.classList.remove('safeguard-input-warning')
        removeMirrorOverlay(element)
        element.focus()
      })
    } else {
      // ADULT MODE: Popup with Edit or Send Anyway
      showSendAlert(
        element.value || element.innerText,
        foundWords,
        lang,
        () => {
          // User chose to send anyway
          delete element.dataset.safeguardWords
          delete element.dataset.safeguardLang
          removeMirrorOverlay(element)
          
          // Simulate Enter key
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            keyCode: 13,
            which: 13,
            bubbles: true
          })
          element.dispatchEvent(enterEvent)
          
          // Try to click submit button
          const form = element.closest('form')
          if (form) {
            const submitBtn = form.querySelector('button[type="submit"], input[type="submit"], button:not([type])')
            if (submitBtn) submitBtn.click()
          }
        },
        () => {
          // User chose to edit - focus back on input
          element.focus()
        }
      )
    }
  }
}

// Child mode: completely blocked alert - NO send option
function showChildBlockedAlert(lang, onDismiss) {
  const messages = WARNING_MESSAGES[lang] || WARNING_MESSAGES.en
  
  const modal = document.createElement('div')
  modal.className = 'safeguard-child-blocked-alert'
  modal.innerHTML = `
    <div class="safeguard-child-blocked-box">
      <svg class="shield-big" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="8" y1="8" x2="16" y2="16"/>
        <line x1="16" y1="8" x2="8" y2="16"/>
      </svg>
      <h3>🚫 ${lang === 'fr' ? 'Message Bloqué' : lang === 'ar' ? 'الرسالة محظورة' : lang === 'it' ? 'Messaggio Bloccato' : 'Message Blocked'}</h3>
      <p>${lang === 'fr' ? 'Ton message contient des mots inappropriés. Il ne peut pas être envoyé. Le message a été supprimé.' : lang === 'ar' ? 'رسالتك تحتوي على كلمات غير لائقة. لا يمكن إرسالها. تم حذف الرسالة.' : lang === 'it' ? 'Il tuo messaggio contiene parole inappropriate. Non può essere inviato. Il messaggio è stato cancellato.' : 'Your message contains inappropriate words. It cannot be sent. The message has been deleted.'}</p>
      <button class="btn-ok">OK</button>
    </div>
  `
  
  document.body.appendChild(modal)
  
  modal.querySelector('.btn-ok').addEventListener('click', () => {
    modal.remove()
    if (onDismiss) onDismiss()
  })
}

async function analyzeWithAPI(text, element) {
  if (isAnalyzing || text.length < 10) return
  isAnalyzing = true
  
  try {
    chrome.runtime.sendMessage({ action: 'analyzeText', text }, (response) => {
      isAnalyzing = false
      if (response?.success && response.result?.toxicity?.is_toxic) {
        const lang = response.result.language?.detected || detectLanguage(text)
        showToast(response.result, lang)
      }
    })
  } catch (e) {
    isAnalyzing = false
  }
}

function scanPageContent() {
  // Scan posts, comments, messages on social media
  const selectors = [
    // Facebook
    '[data-ad-preview="message"]',
    '[data-testid="post_message"]',
    '.userContent',
    '._5pbx',
    // Twitter/X
    '[data-testid="tweetText"]',
    '.tweet-text',
    // Instagram
    '._aacl._aaco._aacu._aacx._aad7._aade',
    // YouTube
    '#content-text',
    'ytd-comment-renderer #content-text',
    '.comment-renderer-text-content',
    // Reddit
    '.md p',
    '[data-testid="comment"]',
    '.RichTextJSON-root',
    // TikTok
    '.tiktok-1ejylhp-DivComment',
    // LinkedIn
    '.feed-shared-update-v2__description',
    // General
    '.post-content',
    '.comment-text',
    '.message-text',
    'article p',
    '.status-body'
  ]
  
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const text = el.innerText || el.textContent
      if (!text || text.length < 10) return
      
      const { foundWords, detectedLang } = findHateWords(text)
      if (foundWords.length > 0) {
        blurContent(el, detectedLang, foundWords)
      }
    })
  })
}

function observeDOM() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType !== 1) return
        
        // Attach listeners to new inputs
        node.querySelectorAll?.('input[type="text"], textarea, [contenteditable="true"]')?.forEach(el => {
          el.addEventListener('input', handleTextInput)
          el.addEventListener('keydown', handleKeyDown)
        })
        
        // Scan new content
        if (isActive) {
          const text = node.innerText || node.textContent || ''
          if (text.length > 10) {
            const { foundWords, detectedLang } = findHateWords(text)
            if (foundWords.length > 0 && !node.classList.contains('safeguard-processed')) {
              blurContent(node, detectedLang, foundWords)
            }
          }
        }
      })
    })
  })
  
  observer.observe(document.body, { childList: true, subtree: true })
}
