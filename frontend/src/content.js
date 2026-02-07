/**
 * HateLess — HateShieldFrontendService
 * Architecture complète : détection temps réel, overlay de décision,
 * mots en rouge, mode enfant, interception envoi Gmail/réseaux sociaux
 * Multilingue : FR / EN / AR / IT
 */

;(function () {
  'use strict'

  // ================================================================
  //                   CLASSE PRINCIPALE
  // ================================================================
  class HateShieldFrontendService {
    constructor () {
      // État du système
      this.isActive = true
      this.isChildMode = false
      this.isBlocked = false
      this._overlayOpen = false
      this.detectedWords = new Set()
      this.debounceTimer = null
      this.isAnalyzing = false

      // Configuration
      this.config = {
        backendEndpoint: 'https://hate-speech-api-486614.uc.r.appspot.com/api/analyze',
        highlightColor: '#dc2626',
        blurIntensity: '8px',
        alertDuration: 10000,
        debounceMs: 500
      }

      // Mots-clés locaux (filtre rapide avant API)
      this.HATE_KEYWORDS = {
        en: ['fuck','shit','bitch','asshole','nigger','faggot','retard','cunt','whore','slut','bastard','damn','hate you','kill yourself','die','idiot','stupid','moron','dumb'],
        fr: ['merde','putain','salope','connard','enculé','pute','nique','batard','con','fdp','ta gueule','je te hais','crève','débile','abruti','imbécile','imbecile','crétin','stupide'],
        ar: ['كس','زب','شرموط','عاهر','ابن الكلب','منيوك','كلب','حمار','غبي','أحمق','اخرس','موت'],
        it: ['cazzo','merda','puttana','stronzo','vaffanculo','troia','bastardo','idiota','stupido','cretino','ti odio','muori']
      }

      // Messages multilingues
      this.MESSAGES = {
        en: {
          title: '⚠️ Hate Speech Detected',
          desc: 'Your message contains inappropriate words.',
          yourMsg: 'Your message',
          detected: 'Detected words',
          delete: '🗑️ Delete Message',
          edit: '✏️ Edit Message',
          send: '📤 Send Anyway',
          tip: '💡 Be respectful in your online communications',
          deleted: 'Message deleted successfully',
          childTitle: '🚫 Message Blocked',
          childDesc: 'This message contains inappropriate content and cannot be sent.',
          childSub: '🔒 Child Mode active — Content protected',
          childOk: 'I understand',
          alertTitle: 'Hate speech detected on page',
          safe: '✓ Content is safe'
        },
        fr: {
          title: '⚠️ Discours Haineux Détecté',
          desc: 'Votre message contient des mots inappropriés.',
          yourMsg: 'Votre message',
          detected: 'Mots détectés',
          delete: '🗑️ Supprimer le Message',
          edit: '✏️ Modifier le Message',
          send: '📤 Envoyer Malgré Tout',
          tip: '💡 Soyez respectueux dans vos communications en ligne',
          deleted: 'Message supprimé avec succès',
          childTitle: '🚫 Message Bloqué',
          childDesc: 'Ce message contient du contenu inapproprié et ne peut pas être envoyé.',
          childSub: '🔒 Mode Enfant activé — Contenu protégé',
          childOk: "J'ai compris",
          alertTitle: 'Contenu haineux détecté sur la page',
          safe: '✓ Contenu sûr'
        },
        ar: {
          title: '⚠️ تم اكتشاف خطاب كراهية',
          desc: 'رسالتك تحتوي على كلمات غير مناسبة.',
          yourMsg: 'رسالتك',
          detected: 'الكلمات المكتشفة',
          delete: '🗑️ حذف الرسالة',
          edit: '✏️ تعديل الرسالة',
          send: '📤 إرسال على أي حال',
          tip: '💡 كن محترماً في تواصلك عبر الإنترنت',
          deleted: 'تم حذف الرسالة بنجاح',
          childTitle: '🚫 الرسالة محظورة',
          childDesc: 'هذه الرسالة تحتوي على محتوى غير مناسب ولا يمكن إرسالها.',
          childSub: '🔒 وضع الطفل مفعل — المحتوى محمي',
          childOk: 'فهمت',
          alertTitle: 'تم اكتشاف محتوى مسيء في الصفحة',
          safe: '✓ محتوى آمن'
        },
        it: {
          title: '⚠️ Linguaggio d\'Odio Rilevato',
          desc: 'Il tuo messaggio contiene parole inappropriate.',
          yourMsg: 'Il tuo messaggio',
          detected: 'Parole rilevate',
          delete: '🗑️ Elimina Messaggio',
          edit: '✏️ Modifica Messaggio',
          send: '📤 Invia Comunque',
          tip: '💡 Sii rispettoso nelle tue comunicazioni online',
          deleted: 'Messaggio eliminato con successo',
          childTitle: '🚫 Messaggio Bloccato',
          childDesc: 'Questo messaggio contiene contenuto inappropriato e non può essere inviato.',
          childSub: '🔒 Modalità Bambino attiva — Contenuto protetto',
          childOk: 'Ho capito',
          alertTitle: 'Contenuto odioso rilevato nella pagina',
          safe: '✓ Contenuto sicuro'
        }
      }

      // Stats
      this.stats = { scanned: 0, flagged: 0 }
    }

    // ================================================================
    //                      INITIALISATION
    // ================================================================
    init () {
      console.log('🛡️ HateLess — HateShieldFrontendService initializing...')
      this.injectGlobalStyles()
      this.createControlPanel()
      this.setupMessageInterception()
      this.scanPageContent()
      this.observeDOM()
      console.log('🛡️ HateLess — Protection active!')
    }

    // ================================================================
    //                     STYLES GLOBAUX
    // ================================================================
    injectGlobalStyles () {
      if (document.getElementById('hateshield-styles')) return
      const s = document.createElement('style')
      s.id = 'hateshield-styles'
      s.textContent = `
/* ===== Mot surligné en rouge ===== */
.hateshield-highlighted-word {
  background-color: #dc262620 !important;
  color: #dc2626 !important;
  font-weight: 700 !important;
  border-radius: 4px !important;
  padding: 2px 6px !important;
  border: 2px solid #dc2626 !important;
  animation: hs-pulse 2s infinite !important;
  display: inline !important;
}

/* Mode enfant via toggle : les mots surlignés deviennent flous */
.hateshield-child-mode .hateshield-highlighted-word {
  color: transparent !important;
  filter: blur(6px) !important;
  user-select: none !important;
  cursor: not-allowed !important;
}

/* ===== Input warning ===== */
.hs-input-flagged {
  outline: 2px solid rgba(220,38,38,.8) !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 8px rgba(220,38,38,.4) !important;
  animation: hs-glow-red 2s infinite !important;
}
/* Facebook contenteditable fix */
.hs-input-flagged[contenteditable],
.hs-input-flagged[role="textbox"] {
  border-radius: 8px !important;
}
.hs-input-safe {
  outline: 2px solid rgba(6,182,212,.5) !important;
  outline-offset: 2px !important;
  box-shadow: 0 0 6px rgba(6,182,212,.2) !important;
}

/* ===== Overlay backdrop ===== */
.hateshield-overlay {
  position: fixed !important;
  inset: 0 !important;
  background: rgba(0,0,0,.85) !important;
  backdrop-filter: blur(10px) !important;
  z-index: 2147483647 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  animation: hs-fadeIn .3s ease !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

/* ===== Modal de décision ===== */
.hateshield-modal {
  background: linear-gradient(145deg, #1e1b4b, #0f172a) !important;
  border-radius: 24px !important;
  padding: 36px !important;
  max-width: 480px !important;
  width: 92% !important;
  box-shadow: 0 25px 60px rgba(0,0,0,.5) !important;
  animation: hs-scaleIn .3s cubic-bezier(.34,1.56,.64,1) !important;
  border: 3px solid #dc2626 !important;
  color: #fff !important;
}

.hs-modal-icon { text-align: center; font-size: 56px; margin-bottom: 8px; }
.hs-modal-title { font-size: 22px; font-weight: 800; text-align: center; margin-bottom: 8px; color: #fff; }
.hs-modal-desc { font-size: 15px; color: rgba(255,255,255,.7); text-align: center; margin-bottom: 20px; line-height: 1.5; }

.hs-modal-preview {
  background: rgba(255,255,255,.06);
  border-radius: 14px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid rgba(255,255,255,.08);
  border-left: 4px solid #dc2626;
}
.hs-modal-preview-label {
  font-size: 11px;
  color: rgba(255,255,255,.5);
  text-transform: uppercase;
  letter-spacing: .5px;
  margin-bottom: 8px;
}
.hs-modal-preview-text {
  font-size: 14px;
  color: #fff;
  line-height: 1.5;
  word-break: break-word;
  max-height: 100px;
  overflow-y: auto;
}

.hs-modal-words {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 22px;
  justify-content: center;
}
.hs-word-tag {
  background: rgba(220,38,38,.25);
  color: #fca5a5;
  padding: 4px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  border: 1px solid rgba(220,38,38,.4);
}

/* ===== Boutons du modal ===== */
.hs-modal-actions {
  display: grid;
  gap: 10px;
  margin-top: 8px;
}
.hs-btn {
  padding: 14px 16px;
  border: none !important;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer !important;
  pointer-events: all !important;
  position: relative !important;
  z-index: 2147483647 !important;
  transition: all .2s ease;
  text-align: center;
  width: 100%;
}
.hs-btn:hover { transform: translateY(-2px); filter: brightness(1.1); }
.hs-btn-delete {
  background: linear-gradient(135deg, #dc2626, #b91c1c) !important;
  color: #fff !important;
}
.hs-btn-edit {
  background: rgba(255,255,255,.12) !important;
  color: #fff !important;
  border: 1px solid rgba(255,255,255,.2) !important;
}
.hs-btn-send {
  background: linear-gradient(135deg, #7c3aed, #6d28d9) !important;
  color: #fff !important;
}

.hs-modal-tip {
  margin-top: 16px;
  padding: 12px;
  text-align: center;
  background: rgba(59,130,246,.1);
  border: 1px solid rgba(59,130,246,.15);
  border-radius: 12px;
  font-size: 13px;
  color: rgba(255,255,255,.7);
}

/* ===== Child modal ===== */
.hs-child-modal .hateshield-modal {
  border-color: #f59e0b !important;
  box-shadow: 0 25px 80px rgba(0,0,0,.5), 0 0 40px rgba(245,158,11,.15) !important;
}

/* ===== Alert banner (floating, dismissable) ===== */
.hateshield-alert-banner {
  position: fixed !important;
  top: 16px !important;
  right: 16px !important;
  left: auto !important;
  max-width: 420px !important;
  background: linear-gradient(135deg, #1e1b4b, #312e81) !important;
  color: #fff !important;
  padding: 14px 18px !important;
  text-align: left !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  z-index: 2147483646 !important;
  display: flex !important;
  align-items: center !important;
  gap: 10px !important;
  animation: hs-slideIn .4s ease !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  box-shadow: 0 8px 30px rgba(0,0,0,.4) !important;
  border-radius: 14px !important;
  border-left: 4px solid #dc2626 !important;
  cursor: pointer !important;
  transition: opacity .3s, transform .3s !important;
}
.hateshield-alert-banner:hover {
  opacity: 0.85 !important;
  transform: scale(0.98) !important;
}

/* ===== Feedback toast ===== */
.hs-feedback {
  position: fixed !important;
  top: 20px !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  padding: 14px 28px !important;
  border-radius: 12px !important;
  z-index: 2147483647 !important;
  font-weight: 700 !important;
  font-size: 14px !important;
  color: #fff !important;
  box-shadow: 0 8px 25px rgba(0,0,0,.3) !important;
  animation: hs-scaleIn .3s ease !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

/* ===== Panel de contrôle ===== */
.hateshield-control-panel {
  position: fixed !important;
  bottom: 20px;
  right: 20px;
  background: linear-gradient(145deg, #0f172a, #1e293b) !important;
  border-radius: 18px !important;
  padding: 18px !important;
  box-shadow: 0 12px 40px rgba(0,0,0,.35) !important;
  z-index: 2147483645 !important;
  border: 1px solid rgba(255,255,255,.1) !important;
  min-width: 240px !important;
  color: #fff !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
  transition: box-shadow .3s ease !important;
  animation: hs-scaleIn .4s cubic-bezier(.34,1.56,.64,1) !important;
  cursor: default;
}
.hateshield-control-panel:hover {
  box-shadow: 0 16px 50px rgba(0,0,0,.45) !important;
}
.hateshield-control-panel.hs-dragging {
  transition: none !important;
  cursor: grabbing !important;
}
.hs-panel-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
  cursor: move !important;
  cursor: grab !important;
}
.hs-panel-header:active {
  cursor: grabbing !important;
}
.hs-panel-logo {
  width: 42px; height: 42px; border-radius: 12px;
  background: transparent;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
}
.hs-panel-logo img {
  width: 100%; height: 100%; object-fit: contain;
}
.hs-panel-title {
  font-weight: 800; font-size: 15px;
  background: linear-gradient(90deg, #06b6d4, #8b5cf6);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hs-panel-sub { font-size: 11px; color: rgba(255,255,255,.5); }
.hs-panel-dot {
  width: 10px; height: 10px; border-radius: 50%; margin-left: auto;
  background: #22c55e;
  box-shadow: 0 0 8px rgba(34,197,94,.6);
  animation: hs-pulseDot 2s infinite;
}
.hs-panel-dot.flagged { background: #ef4444; box-shadow: 0 0 8px rgba(239,68,68,.6); }

.hs-panel-stats {
  display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px;
}
.hs-stat-box {
  background: rgba(255,255,255,.06); border-radius: 10px; padding: 10px;
  text-align: center; border: 1px solid rgba(255,255,255,.06);
}
.hs-stat-num { font-size: 24px; font-weight: 800; line-height: 1.1; }
.hs-stat-num.blue { color: #38bdf8; }
.hs-stat-num.red { color: #f87171; }
.hs-stat-label {
  font-size: 10px; color: rgba(255,255,255,.45);
  text-transform: uppercase; letter-spacing: .5px; margin-top: 2px;
}
.hs-panel-btn {
  width: 100%; padding: 10px; border: none; border-radius: 10px;
  font-size: 13px; font-weight: 600; cursor: pointer;
  transition: all .2s; color: #fff;
}
.hs-panel-btn:hover { filter: brightness(1.15); }

/* Mode enfant : mots haineux = totalement flous (invisibles) */
.hateshield-child-word {
  display: inline !important;
  color: #888 !important;
  -webkit-text-fill-color: #888 !important;
  text-shadow: none !important;
  filter: blur(10px) !important;
  -webkit-filter: blur(10px) !important;
  user-select: none !important;
  -webkit-user-select: none !important;
  cursor: not-allowed !important;
  opacity: 0.6 !important;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

/* ===== Animations ===== */
@keyframes hs-pulse { 0%,100%{border-color:#dc2626}50%{border-color:#fca5a5} }
@keyframes hs-glow-red { 0%,100%{box-shadow:0 0 0 6px rgba(220,38,38,.15)!important}50%{box-shadow:0 0 0 10px rgba(220,38,38,.3)!important} }
@keyframes hs-fadeIn { from{opacity:0}to{opacity:1} }
@keyframes hs-scaleIn { from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)} }
@keyframes hs-alertShake { 0%,100%{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)} }
@keyframes hs-slideIn { from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)} }
@keyframes hs-pulseDot { 0%,100%{opacity:1}50%{opacity:.35} }
      `
      document.head.appendChild(s)
    }

    // ================================================================
    //                   DÉTECTION DE LANGUE
    // ================================================================
    detectLang (text) {
      if (/[\u0600-\u06FF]/.test(text)) return 'ar'
      const fr = (text.match(/\b(le|la|les|de|du|des|un|une|est|et|que|qui|dans|pour|avec|sur|pas|mais|tout|cette|sont|nous|vous|ils|très|même|après|fait)\b/gi) || []).length
      const it = (text.match(/\b(il|la|le|di|del|un|una|che|non|per|con|sono|come|questo|quello|anche|più|tutto|molto|altro|dopo|fare|essere|avere)\b/gi) || []).length
      if (fr > 2 && fr > it) return 'fr'
      if (it > 2 && it > fr) return 'it'
      return 'en'
    }

    t (lang) { return this.MESSAGES[lang] || this.MESSAGES.en }

    esc (s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') }

    // ================================================================
    //             RECHERCHE LOCALE DE MOTS HAINEUX
    // ================================================================
    findHateWords (text) {
      const lower = text.toLowerCase()
      const found = []
      let lang = this.detectLang(text)
      const order = [lang, ...Object.keys(this.HATE_KEYWORDS).filter(k => k !== lang)]

      for (const l of order) {
        for (const kw of this.HATE_KEYWORDS[l]) {
          const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          const re = new RegExp('(^|[\\s.,!?\';:"()\\-])' + escaped + '($|[\\s.,!?\';:"()\\-])', 'gi')
          let m
          while ((m = re.exec(lower)) !== null) {
            const idx = m.index + m[1].length
            if (!found.some(f => f.index === idx)) {
              found.push({ word: text.substr(idx, kw.length), index: idx, lang: l })
              if (l !== lang && found.filter(f => f.lang === l).length >= 2) lang = l
            }
          }
        }
      }
      return { foundWords: found, detectedLang: lang }
    }

    // ================================================================
    //                     APPEL API BACKEND
    // ================================================================
    async apiAnalyze (text) {
      try {
        const r = await fetch(this.config.backendEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        })
        if (!r.ok) throw new Error(r.status)
        return await r.json()
      } catch (e) {
        console.warn('HateLess API error:', e)
        return null
      }
    }

    // ================================================================
    //              INTERCEPTION DES MESSAGES
    // ================================================================
    setupMessageInterception () {
      const self = this

      // Helper: find the editable root (walk up for nested contenteditable like Facebook)
      function findEditableRoot(el) {
        if (!el) return null
        // If it's an input/textarea, return directly
        if (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && el.type === 'text')) return el
        // Walk up to find the topmost contenteditable in this editing host
        let editable = null
        let node = el
        while (node && node !== document.body) {
          if (node.isContentEditable || (node.getAttribute && node.getAttribute('contenteditable') === 'true')) {
            editable = node
          }
          if (node.getAttribute && node.getAttribute('role') === 'textbox') {
            return node // role=textbox is the editing root
          }
          node = node.parentElement
        }
        return editable || el
      }

      // 1. Input en temps réel (event delegation — capture phase)
      document.addEventListener('input', function (e) {
        if (!self.isActive) return
        const el = findEditableRoot(e.target)
        if (!el) return
        if (el.isContentEditable || (el.matches && el.matches('input[type="text"], textarea, [contenteditable], [role="textbox"]'))) {
          self.realTimeAnalysis(el)
        }
      }, true)

      // 2. Enter interception (less aggressive on Facebook/Messenger)
      document.addEventListener('keydown', function (e) {
        if (!self.isActive || self._overlayOpen || e.key !== 'Enter' || e.shiftKey) return
        const el = findEditableRoot(e.target)
        if (!el) return
        if (!(el.isContentEditable || (el.matches && el.matches('input[type="text"], textarea, [contenteditable], [role="textbox"]')))) return
        if (!el.dataset.hsWords) return

        // On Facebook/Messenger, show warning but don't block (too many conflicts)
        const isFacebook = window.location.hostname.includes('facebook.com') || window.location.hostname.includes('messenger.com')
        if (isFacebook) {
          // Just show alert banner, don't prevent sending
          const words = JSON.parse(el.dataset.hsWords)
          const lang = el.dataset.hsLang || 'en'
          const uWords = [...new Set(words.map(w => w.word))]
          self.showAlertBanner('⚠️ ' + self.t(lang).title + ' : ' + uWords.join(', '))
          return // Let Facebook handle it naturally
        }

        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        self.interceptSend(el)
      }, true)

      // 3. Click on ANY button — check if there's a flagged input nearby
      document.addEventListener('click', function (e) {
        if (!self.isActive) return

        // If our overlay is open, do NOT intercept anything
        if (self._overlayOpen) return

        // NEVER intercept clicks inside our own modals/panels/overlays
        if (e.target.closest && e.target.closest('.hateshield-overlay, .hateshield-modal, .hateshield-control-panel, .hateshield-alert-banner, .hs-feedback, .hs-btn')) return

        const btn = e.target.closest('button, [role="button"], input[type="submit"], .T-I-atl, [data-tooltip], [aria-label], a[role="link"]')
        if (!btn) return

        // Skip our own buttons
        if (btn.id && btn.id.startsWith('hs-')) return
        if (btn.classList && (btn.classList.contains('hs-btn') || btn.classList.contains('hs-btn-delete') || btn.classList.contains('hs-btn-edit') || btn.classList.contains('hs-btn-send'))) return

        const text = (btn.textContent || '').trim().toLowerCase()
        const aria = (btn.getAttribute('aria-label') || '').toLowerCase()
        const tip = (btn.getAttribute('data-tooltip') || '').toLowerCase()
        const cls = btn.className || ''

        const sendWords = ['send','envoyer','submit','post','reply','إرسال','invia','publier','répondre','tweet','comment','poster','partager','share','publish']
        const isSend = sendWords.some(w => text.includes(w) || aria.includes(w) || tip.includes(w))
          || btn.classList.contains('T-I-atl')           // Gmail
          || cls.includes('submit')                       // Generic
          || btn.querySelector('svg[aria-label*="Send"], svg[aria-label*="Envoyer"]')  // Icon buttons
          || (btn.type === 'submit')

        if (!isSend) return

        // Find flagged input on page
        const flagged = document.querySelector('[data-hs-words]')
        if (!flagged) return

        // On Facebook/Messenger, show warning but don't block
        const isFacebook = window.location.hostname.includes('facebook.com') || window.location.hostname.includes('messenger.com')
        if (isFacebook) {
          const words = JSON.parse(flagged.dataset.hsWords)
          const lang = flagged.dataset.hsLang || 'en'
          const uWords = [...new Set(words.map(w => w.word))]
          self.showAlertBanner('⚠️ ' + self.t(lang).title + ' : ' + uWords.join(', '))
          return // Let Facebook handle it
        }

        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        self.interceptSend(flagged, btn)
      }, true)

      // 4. Form submit interception
      document.addEventListener('submit', function (e) {
        if (!self.isActive) return
        const flagged = e.target.querySelector('[data-hs-words]')
        if (!flagged) return
        
        // Skip Facebook
        const isFacebook = window.location.hostname.includes('facebook.com') || window.location.hostname.includes('messenger.com')
        if (isFacebook) return
        
        e.preventDefault()
        e.stopPropagation()
        self.interceptSend(flagged)
      }, true)
    }

    // ================================================================
    //                ANALYSE TEMPS RÉEL (pendant la frappe)
    // ================================================================
    realTimeAnalysis (el) {
      const text = el.value || el.innerText || ''
      if (!text || text.length < 3) {
        el.classList.remove('hs-input-flagged', 'hs-input-safe')
        delete el.dataset.hsWords
        delete el.dataset.hsLang
        return
      }

      clearTimeout(this.debounceTimer)
      this.debounceTimer = setTimeout(async () => {
        this.stats.scanned++
        const { foundWords, detectedLang } = this.findHateWords(text)

        if (foundWords.length > 0) {
          // FLAGGED!
          el.classList.add('hs-input-flagged')
          el.classList.remove('hs-input-safe')
          el.dataset.hsWords = JSON.stringify(foundWords)
          el.dataset.hsLang = detectedLang
          foundWords.forEach(w => this.detectedWords.add(w.word))
          this.stats.flagged++

          // Alert banner  
          const uWords = [...new Set(foundWords.map(w => w.word))]
          this.showAlertBanner(
            '⚠️ ' + this.t(detectedLang).title + ' : ' + uWords.join(', ')
          )

          // Child mode: immediately clear the input and show block
          if (this.isChildMode) {
            this.showAlertBanner('⛔ ' + this.t(detectedLang).childTitle)
            // Auto-clear after a short delay so child can't send
            setTimeout(() => {
              this.clearElement(el)
              el.classList.remove('hs-input-flagged')
              delete el.dataset.hsWords
              delete el.dataset.hsLang
              this.showChildBlockModal(detectedLang, el)
            }, 300)
          }

          this.updatePanel(true)
        } else {
          el.classList.remove('hs-input-flagged')
          el.classList.add('hs-input-safe')
          delete el.dataset.hsWords
          delete el.dataset.hsLang
          this.updatePanel(false)
        }

        // Deep API analysis (background, non-blocking)
        if (text.length >= 10 && !this.isAnalyzing) {
          this.isAnalyzing = true
          const api = await this.apiAnalyze(text)
          this.isAnalyzing = false
          if (api && api.toxicity && api.toxicity.is_toxic && foundWords.length === 0) {
            el.classList.add('hs-input-flagged')
            el.dataset.hsWords = JSON.stringify([{ word: '(API)', index: 0, lang: detectedLang }])
            el.dataset.hsLang = detectedLang
            this.stats.flagged++
            this.showAlertBanner('🔬 Contenu toxique détecté')
            this.updatePanel(true)
          }
        }
      }, this.config.debounceMs)
    }

    // ================================================================
    //               INTERCEPT SEND → SHOW MODAL
    // ================================================================
    interceptSend (el, sendBtn) {
      const stored = el.dataset.hsWords
      if (!stored) return

      const foundWords = JSON.parse(stored)
      const lang = el.dataset.hsLang || 'en'
      const text = el.value || el.innerText || ''

      if (this.isChildMode) {
        this.showChildBlockModal(lang, el)
      } else {
        this.showDecisionOverlay(text, foundWords, lang, el, sendBtn)
      }
    }

    // ================================================================
    //          OVERLAY DE DÉCISION (3 OPTIONS + PREVIEW)
    // ================================================================
    showDecisionOverlay (text, foundWords, lang, element, sendBtn) {
      const t = this.t(lang)
      const uWords = [...new Set(foundWords.map(w => w.word))]
      const self = this

      // Build highlighted preview
      let previewHtml = this.esc(text.substring(0, 300))
      uWords.forEach(w => {
        const re = new RegExp('(' + this.esc(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi')
        previewHtml = previewHtml.replace(re, '<span class="hateshield-highlighted-word">$1</span>')
      })
      if (text.length > 300) previewHtml += '…'

      self._overlayOpen = true

      const overlay = document.createElement('div')
      overlay.className = 'hateshield-overlay'

      const modal = document.createElement('div')
      modal.className = 'hateshield-modal'
      modal.innerHTML =
        '<div class="hs-modal-icon">⚠️</div>' +
        '<div class="hs-modal-title">' + t.title + '</div>' +
        '<div class="hs-modal-desc">' + t.desc + '</div>' +
        '<div class="hs-modal-preview">' +
          '<div class="hs-modal-preview-label">' + t.yourMsg + '</div>' +
          '<div class="hs-modal-preview-text">' + previewHtml + '</div>' +
        '</div>' +
        '<div style="text-align:center;margin-bottom:8px;font-size:12px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px">🚫 ' + t.detected + '</div>' +
        '<div class="hs-modal-words">' +
          uWords.map(w => '<span class="hs-word-tag">' + this.esc(w) + '</span>').join('') +
        '</div>' +
        '<div class="hs-modal-actions"></div>' +
        '<div class="hs-modal-tip">' + t.tip + '</div>'

      overlay.appendChild(modal)

      function closeOverlay () {
        self._overlayOpen = false
        if (overlay.parentNode) overlay.remove()
      }

      // Create buttons with direct event handlers
      const actionsDiv = modal.querySelector('.hs-modal-actions')

      const btnDelete = document.createElement('button')
      btnDelete.className = 'hs-btn hs-btn-delete'
      btnDelete.textContent = t.delete

      const btnEdit = document.createElement('button')
      btnEdit.className = 'hs-btn hs-btn-edit'
      btnEdit.textContent = t.edit

      const btnSend = document.createElement('button')
      btnSend.className = 'hs-btn hs-btn-send'
      btnSend.textContent = t.send

      actionsDiv.appendChild(btnDelete)
      actionsDiv.appendChild(btnEdit)
      actionsDiv.appendChild(btnSend)

      document.body.appendChild(overlay)

      // Use event delegation on the OVERLAY itself (mousedown fires before any click handler)
      overlay.addEventListener('mousedown', function (ev) {
        ev.stopPropagation()
        ev.stopImmediatePropagation()
      }, true)
      overlay.addEventListener('mouseup', function (ev) {
        ev.stopPropagation()
        ev.stopImmediatePropagation()
      }, true)
      overlay.addEventListener('click', function (ev) {
        ev.stopPropagation()
        ev.stopImmediatePropagation()

        const target = ev.target

        // DELETE
        if (target === btnDelete || target.closest('.hs-btn-delete')) {
          closeOverlay()
          self.clearElement(element)
          element.classList.remove('hs-input-flagged')
          delete element.dataset.hsWords
          delete element.dataset.hsLang
          element.focus()
          self.showFeedback(t.deleted, 'success')
          self.updatePanel(false)
          return
        }

        // EDIT
        if (target === btnEdit || target.closest('.hs-btn-edit')) {
          closeOverlay()
          element.focus()
          return
        }

        // SEND ANYWAY
        if (target === btnSend || target.closest('.hs-btn-send')) {
          closeOverlay()
          delete element.dataset.hsWords
          delete element.dataset.hsLang
          element.classList.remove('hs-input-flagged')
          if (sendBtn) {
            sendBtn.click()
          } else {
            element.dispatchEvent(new KeyboardEvent('keydown', {
              key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
            }))
            const form = element.closest('form')
            if (form) {
              const btn2 = form.querySelector('button[type="submit"],input[type="submit"],button:not([type])')
              if (btn2) btn2.click()
            }
          }
          return
        }

        // Click outside modal = edit
        if (target === overlay) {
          closeOverlay()
          element.focus()
        }
      }, true)
    }

    // ================================================================
    //            MODAL ENFANT (BLOQUÉ COMPLÈTEMENT)
    // ================================================================
    showChildBlockModal (lang, element) {
      const t = this.t(lang)
      const self = this

      self._overlayOpen = true

      const overlay = document.createElement('div')
      overlay.className = 'hateshield-overlay hs-child-modal'

      const modal = document.createElement('div')
      modal.className = 'hateshield-modal'
      modal.innerHTML =
        '<div class="hs-modal-icon">🛡️</div>' +
        '<div class="hs-modal-title">' + t.childTitle + '</div>' +
        '<div class="hs-modal-desc">' + t.childDesc + '</div>' +
        '<div style="margin:16px 0;font-size:14px;color:rgba(255,255,255,.6);text-align:center">' + t.childSub + '</div>' +
        '<div class="hs-modal-actions"></div>'

      overlay.appendChild(modal)

      function closeOverlay () {
        self._overlayOpen = false
        if (overlay.parentNode) overlay.remove()
      }

      const actionsDiv = modal.querySelector('.hs-modal-actions')
      const btnOk = document.createElement('button')
      btnOk.className = 'hs-btn hs-btn-delete'
      btnOk.textContent = t.childOk
      actionsDiv.appendChild(btnOk)

      document.body.appendChild(overlay)

      // Capture ALL mouse events on the overlay so nothing else can eat them
      overlay.addEventListener('mousedown', function (ev) {
        ev.stopPropagation()
        ev.stopImmediatePropagation()
      }, true)
      overlay.addEventListener('mouseup', function (ev) {
        ev.stopPropagation()
        ev.stopImmediatePropagation()
      }, true)
      overlay.addEventListener('click', function (ev) {
        ev.stopPropagation()
        ev.stopImmediatePropagation()
        if (ev.target === btnOk || ev.target.closest('.hs-btn-delete')) {
          closeOverlay()
          self.clearElement(element)
          element.classList.remove('hs-input-flagged')
          delete element.dataset.hsWords
          delete element.dataset.hsLang
          element.focus()
        }
      }, true)
    }

    // ================================================================
    //                    ALERT BANNER
    // ================================================================
    showAlertBanner (message) {
      const existing = document.querySelector('.hateshield-alert-banner')
      if (existing) existing.remove()

      const banner = document.createElement('div')
      banner.className = 'hateshield-alert-banner'

      const iconDiv = document.createElement('div')
      iconDiv.style.fontSize = '22px'
      iconDiv.textContent = '⚠️'
      banner.appendChild(iconDiv)

      const msgDiv = document.createElement('div')
      msgDiv.innerHTML = message
      banner.appendChild(msgDiv)

      const closeBtn = document.createElement('button')
      closeBtn.style.cssText = 'background:rgba(255,255,255,.15);color:#fff;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:auto'
      closeBtn.textContent = '✕'
      closeBtn.onclick = function (ev) {
        ev.stopPropagation()
        ev.stopImmediatePropagation()
        banner.style.opacity = '0'
        banner.style.transform = 'translateX(120%)'
        setTimeout(() => banner.remove(), 300)
      }
      banner.appendChild(closeBtn)

      // Click anywhere on banner to dismiss
      banner.onclick = function () {
        banner.style.opacity = '0'
        banner.style.transform = 'translateX(120%)'
        setTimeout(() => banner.remove(), 300)
      }

      document.body.appendChild(banner)
      setTimeout(() => {
        if (banner.parentNode) {
          banner.style.opacity = '0'
          banner.style.transform = 'translateX(120%)'
          setTimeout(() => { if (banner.parentNode) banner.remove() }, 300)
        }
      }, this.config.alertDuration)
    }

    // ================================================================
    //                  FEEDBACK TOAST
    // ================================================================
    showFeedback (message, type) {
      const colors = { success: '#10b981', error: '#dc2626', warning: '#f59e0b', info: '#3b82f6' }
      const fb = document.createElement('div')
      fb.className = 'hs-feedback'
      fb.style.background = colors[type] || colors.info
      fb.textContent = message
      document.body.appendChild(fb)
      setTimeout(() => fb.remove(), 3500)
    }

    // ================================================================
    //                PANEL DE CONTRÔLE
    // ================================================================
    createControlPanel () {
      if (document.querySelector('.hateshield-control-panel')) return
      const self = this
      const panel = document.createElement('div')
      panel.className = 'hateshield-control-panel'
      const iconBase64 = 'data:image/png;base64,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'
      panel.innerHTML = `
        <div class="hs-panel-header">
          <div class="hs-panel-logo"><img src="${iconBase64}" alt="HateLess"></div>
          <div>
            <div class="hs-panel-title">HateLess</div>
            <div class="hs-panel-sub">Protection Active</div>
          </div>
          <div class="hs-panel-dot" id="hs-dot"></div>
        </div>
        <!-- Stats section removed per request -->
        <button class="hs-panel-btn" id="hs-child-toggle" style="background:linear-gradient(135deg,#06b6d4,#8b5cf6);margin-bottom:8px;display:flex;align-items:center;justify-content:center;gap:8px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Mode Adulte
        </button>
        <div style="font-size:10px;color:rgba(255,255,255,.35);text-align:center;margin-top:4px;display:flex;align-items:center;justify-content:center;gap:4px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> RGPD Conforme · Aucune donnée stockée</div>
      `
      document.body.appendChild(panel)

      // Make panel draggable
      const header = panel.querySelector('.hs-panel-header')
      let isDragging = false
      let currentX = 0
      let currentY = 0
      let initialX = 0
      let initialY = 0

      header.addEventListener('mousedown', function(e) {
        if (e.target.closest('button')) return // Don't drag when clicking buttons
        isDragging = true
        panel.classList.add('hs-dragging')
        initialX = e.clientX - panel.offsetLeft
        initialY = e.clientY - panel.offsetTop
        // Remove right/bottom positioning to use left/top
        panel.style.right = 'auto'
        panel.style.bottom = 'auto'
        panel.style.left = panel.offsetLeft + 'px'
        panel.style.top = panel.offsetTop + 'px'
      })

      document.addEventListener('mousemove', function(e) {
        if (isDragging) {
          e.preventDefault()
          currentX = e.clientX - initialX
          currentY = e.clientY - initialY
          // Keep panel within viewport
          const maxX = window.innerWidth - panel.offsetWidth
          const maxY = window.innerHeight - panel.offsetHeight
          currentX = Math.max(0, Math.min(currentX, maxX))
          currentY = Math.max(0, Math.min(currentY, maxY))
          panel.style.left = currentX + 'px'
          panel.style.top = currentY + 'px'
          panel.style.right = 'auto'
          panel.style.bottom = 'auto'
        }
      })

      document.addEventListener('mouseup', function() {
        if (isDragging) {
          isDragging = false
          panel.classList.remove('hs-dragging')
        }
      })

      panel.querySelector('#hs-child-toggle').addEventListener('click', function () {
        self.isChildMode = !self.isChildMode
        chrome.storage.sync.set({ isChildMode: self.isChildMode })
        if (self.isChildMode) {
          this.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg> Mode Enfant ON'
          this.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)'
          document.body.classList.add('hateshield-child-mode')
        } else {
          this.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Mode Adulte'
          this.style.background = 'linear-gradient(135deg,#06b6d4,#8b5cf6)'
          document.body.classList.remove('hateshield-child-mode')
        }

        // Clear scan flags and re-process the page with new mode
        document.querySelectorAll('[data-hs-scanned]').forEach(el => {
          // Restore original HTML if we have it, otherwise just clear the flag
          if (el.dataset.hsOriginalHtml) {
            el.innerHTML = el.dataset.hsOriginalHtml
          }
          delete el.dataset.hsScanned
        })
        // Remove existing highlighted/censored words
        document.querySelectorAll('.hateshield-child-word').forEach(el => {
          el.outerHTML = el.textContent || ''
        })
        document.querySelectorAll('.hateshield-highlighted-word').forEach(el => {
          el.outerHTML = el.textContent || ''
        })
        // Clear all scan flags again (in case innerHTML restoration re-added them)
        document.querySelectorAll('[data-hs-scanned]').forEach(el => {
          delete el.dataset.hsScanned
        })
        // Re-scan with updated mode
        self.scanPageContent()
      })
    }

    updatePanel (isFlagged) {
      const d = document.getElementById('hs-dot')
      if (d) {
        if (isFlagged) d.classList.add('flagged')
        else d.classList.remove('flagged')
      }
    }

    // ================================================================
    //                 SCAN PAGE (existing content)
    // ================================================================
    scanPageContent () {
      // Use TreeWalker to find ALL text nodes on the page — works on ANY website
      const self = this
      const skipTags = new Set(['SCRIPT','STYLE','NOSCRIPT','IFRAME','SVG','MATH','CODE','PRE','TEXTAREA','INPUT'])
      const skipClasses = ['.hateshield-overlay','.hateshield-modal','.hateshield-control-panel','.hateshield-alert-banner','.hs-feedback']

      // Collect all elements that directly contain text with hate words
      const elements = new Set()
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          const parent = node.parentElement
          if (!parent) return NodeFilter.FILTER_REJECT
          if (skipTags.has(parent.tagName)) return NodeFilter.FILTER_REJECT
          if (parent.closest && parent.closest(skipClasses.join(','))) return NodeFilter.FILTER_REJECT
          if (parent.id && parent.id.startsWith('hs-')) return NodeFilter.FILTER_REJECT
          const text = (node.textContent || '').trim()
          if (text.length < 2) return NodeFilter.FILTER_SKIP
          // Quick check: does this text contain any hate keywords?
          const lower = text.toLowerCase()
          let hasHate = false
          for (const lang of ['en','fr','ar','it']) {
            if (self.HATE_KEYWORDS[lang] && self.HATE_KEYWORDS[lang].some(w => lower.includes(w.toLowerCase()))) {
              hasHate = true
              break
            }
          }
          if (!hasHate) return NodeFilter.FILTER_SKIP
          return NodeFilter.FILTER_ACCEPT
        }
      })

      while (walker.nextNode()) {
        const textNode = walker.currentNode
        const parent = textNode.parentElement
        // Use the DIRECT parent as container — don't walk up too far
        // This works better for Facebook/Gmail where everything is deeply nested
        let container = parent
        // Only go up ONE level if parent is a very small inline tag
        if (container && container.childNodes.length === 1 && container.parentElement) {
          const tag = container.tagName
          if (tag === 'SPAN' || tag === 'B' || tag === 'I' || tag === 'EM' || tag === 'STRONG' || tag === 'FONT') {
            container = container.parentElement
          }
        }
        if (container && !container.dataset.hsScanned && !container.classList.contains('hateshield-child-word') && !container.classList.contains('hateshield-highlighted-word')) {
          elements.add(container)
        }
      }

      elements.forEach(el => {
        if (el.dataset.hsScanned) return
        if (el.closest && el.closest(skipClasses.join(','))) return
        el.dataset.hsScanned = 'true'
        const text = el.innerText || el.textContent || ''
        if (text.length < 2) return
        this.stats.scanned++
        const { foundWords, detectedLang } = this.findHateWords(text)
        if (foundWords.length > 0) {
          this.stats.flagged++
          const uWords = [...new Set(foundWords.map(w => w.word))]
          if (!el.dataset.hsOriginalHtml) {
            el.dataset.hsOriginalHtml = el.innerHTML
          }
          let html = el.dataset.hsOriginalHtml
          uWords.forEach(w => {
            const re = new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi')
            if (this.isChildMode) {
              // Child mode: blur the hate word (keep text but make it invisible)
              html = html.replace(re, '<span class="hateshield-child-word" title="Contenu masqué">$1</span>')
            } else {
              // Adult mode: highlight words in red
              html = html.replace(re, '<span class="hateshield-highlighted-word">$1</span>')
            }
          })
          el.innerHTML = html
          this.updatePanel(true)
        }
      })
      this.updatePanel(false)
    }

    // ================================================================
    //                       DOM OBSERVER
    // ================================================================
    observeDOM () {
      const self = this
      const obs = new MutationObserver(muts => {
        if (!self.isActive) return
        let needScan = false
        for (const m of muts) {
          for (const n of m.addedNodes) {
            if (n.nodeType !== 1) continue
            if (n.isContentEditable || (n.matches && n.matches('[contenteditable], [role="textbox"], textarea, input[type="text"]'))) {
              // New editable added — already handled by delegation
            }
            needScan = true
          }
        }
        if (needScan) self.scanPageContent()
      })
      obs.observe(document.body, { childList: true, subtree: true })
    }

    // ================================================================
    //                       HELPERS
    // ================================================================
    clearElement (el) {
      if (!el) return
      if (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT') {
        // Native input/textarea
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype,
          'value'
        )
        if (nativeInputValueSetter && nativeInputValueSetter.set) {
          nativeInputValueSetter.set.call(el, '')
        }
        el.value = ''
      } else {
        // contenteditable (Gmail, Facebook, Twitter, etc.)
        // Multi-method approach for stubborn React/Vue editors
        el.focus()
        
        // Method 1: execCommand selectAll + delete
        try {
          document.execCommand('selectAll', false, null)
          document.execCommand('delete', false, null)
        } catch (e) { /* ignore */ }

        // Method 2: Remove all children manually
        while (el.firstChild) {
          el.removeChild(el.firstChild)
        }

        // Method 3: Direct property clearing
        el.innerHTML = ''
        el.textContent = ''
        if (el.innerText !== undefined) el.innerText = ''
        
        // Method 4: Add single <br> for contenteditable placeholder
        if (el.isContentEditable) {
          el.appendChild(document.createElement('br'))
        }

        // Method 5: Check if still has content and nuke it
        setTimeout(() => {
          const remaining = (el.innerText || el.textContent || '').trim()
          if (remaining.length > 0) {
            el.innerHTML = ''
            if (el.isContentEditable) el.appendChild(document.createElement('br'))
          }
        }, 10)
      }
      // Fire events so frameworks (React, Angular, Vue) detect the change
      el.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
      el.dispatchEvent(new Event('change', { bubbles: true, composed: true }))
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }))
      el.dispatchEvent(new KeyboardEvent('keyup', { key: 'Backspace', bubbles: true }))
    }
  }

  // ================================================================
  //           CHROME EXTENSION BOOTSTRAP
  // ================================================================
  const service = new HateShieldFrontendService()

  chrome.storage.sync.get(['isActive', 'isChildMode'], data => {
    service.isActive = true  // always active
    service.isChildMode = data.isChildMode || false
    chrome.storage.sync.set({ isActive: true })

    if (service.isChildMode) {
      document.body.classList.add('hateshield-child-mode')
      const btn = document.getElementById('hs-child-toggle')
      if (btn) {
        btn.textContent = '👶 Mode Enfant ON'
        btn.style.background = 'linear-gradient(135deg,#f59e0b,#d97706)'
      }
    }

    service.init()
    console.log('🛡️ HateLess — isActive:', service.isActive, 'childMode:', service.isChildMode)
  })

  chrome.runtime.onMessage.addListener(req => {
    if (req.action === 'toggleDetection') {
      service.isActive = req.isActive
      if (!service.isActive) {
        document.querySelectorAll('.hateshield-control-panel, .hateshield-alert-banner, .hs-feedback').forEach(e => e.remove())
        document.querySelectorAll('.hs-input-flagged,.hs-input-safe').forEach(e => {
          e.classList.remove('hs-input-flagged','hs-input-safe')
          delete e.dataset.hsWords; delete e.dataset.hsLang
        })
      } else {
        service.init()
      }
    }
    if (req.action === 'toggleChildMode') {
      service.isChildMode = req.isChildMode
      chrome.storage.sync.set({ isChildMode: req.isChildMode })
      if (req.isChildMode) document.body.classList.add('hateshield-child-mode')
      else document.body.classList.remove('hateshield-child-mode')
    }
  })

})()
