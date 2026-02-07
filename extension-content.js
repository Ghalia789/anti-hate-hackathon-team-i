(function(){class E{constructor(){this.isActive=!0,this.isChildMode=!1,this.isBlocked=!1,this._overlayOpen=!1,this.detectedWords=new Set,this.debounceTimer=null,this.isAnalyzing=!1,this.config={backendEndpoint:"https://hate-speech-api-486614.uc.r.appspot.com/api/analyze",highlightColor:"#dc2626",blurIntensity:"8px",alertDuration:1e4,debounceMs:500},this.HATE_KEYWORDS={en:["fuck","shit","bitch","asshole","nigger","faggot","retard","cunt","whore","slut","bastard","damn","hate you","kill yourself","die","idiot","stupid","moron","dumb"],fr:["merde","putain","salope","connard","enculé","pute","nique","batard","con","fdp","ta gueule","je te hais","crève","débile","abruti","imbécile","imbecile","crétin","stupide"],ar:["كس","زب","شرموط","عاهر","ابن الكلب","منيوك","كلب","حمار","غبي","أحمق","اخرس","موت"],it:["cazzo","merda","puttana","stronzo","vaffanculo","troia","bastardo","idiota","stupido","cretino","ti odio","muori"]},this.MESSAGES={en:{title:"⚠️ Hate Speech Detected",desc:"Your message contains inappropriate words.",yourMsg:"Your message",detected:"Detected words",delete:"🗑️ Delete Message",edit:"✏️ Edit Message",send:"📤 Send Anyway",tip:"💡 Be respectful in your online communications",deleted:"Message deleted successfully",childTitle:"🚫 Message Blocked",childDesc:"This message contains inappropriate content and cannot be sent.",childSub:"🔒 Child Mode active — Content protected",childOk:"I understand",alertTitle:"Hate speech detected on page",safe:"✓ Content is safe"},fr:{title:"⚠️ Discours Haineux Détecté",desc:"Votre message contient des mots inappropriés.",yourMsg:"Votre message",detected:"Mots détectés",delete:"🗑️ Supprimer le Message",edit:"✏️ Modifier le Message",send:"📤 Envoyer Malgré Tout",tip:"💡 Soyez respectueux dans vos communications en ligne",deleted:"Message supprimé avec succès",childTitle:"🚫 Message Bloqué",childDesc:"Ce message contient du contenu inapproprié et ne peut pas être envoyé.",childSub:"🔒 Mode Enfant activé — Contenu protégé",childOk:"J'ai compris",alertTitle:"Contenu haineux détecté sur la page",safe:"✓ Contenu sûr"},ar:{title:"⚠️ تم اكتشاف خطاب كراهية",desc:"رسالتك تحتوي على كلمات غير مناسبة.",yourMsg:"رسالتك",detected:"الكلمات المكتشفة",delete:"🗑️ حذف الرسالة",edit:"✏️ تعديل الرسالة",send:"📤 إرسال على أي حال",tip:"💡 كن محترماً في تواصلك عبر الإنترنت",deleted:"تم حذف الرسالة بنجاح",childTitle:"🚫 الرسالة محظورة",childDesc:"هذه الرسالة تحتوي على محتوى غير مناسب ولا يمكن إرسالها.",childSub:"🔒 وضع الطفل مفعل — المحتوى محمي",childOk:"فهمت",alertTitle:"تم اكتشاف محتوى مسيء في الصفحة",safe:"✓ محتوى آمن"},it:{title:"⚠️ Linguaggio d'Odio Rilevato",desc:"Il tuo messaggio contiene parole inappropriate.",yourMsg:"Il tuo messaggio",detected:"Parole rilevate",delete:"🗑️ Elimina Messaggio",edit:"✏️ Modifica Messaggio",send:"📤 Invia Comunque",tip:"💡 Sii rispettoso nelle tue comunicazioni online",deleted:"Messaggio eliminato con successo",childTitle:"🚫 Messaggio Bloccato",childDesc:"Questo messaggio contiene contenuto inappropriato e non può essere inviato.",childSub:"🔒 Modalità Bambino attiva — Contenuto protetto",childOk:"Ho capito",alertTitle:"Contenuto odioso rilevato nella pagina",safe:"✓ Contenuto sicuro"}},this.stats={scanned:0,flagged:0}}init(){console.log("🛡️ HateLess — HateShieldFrontendService initializing..."),this.injectGlobalStyles(),this.createControlPanel(),this.setupMessageInterception(),this.scanPageContent(),this.observeDOM(),console.log("🛡️ HateLess — Protection active!")}injectGlobalStyles(){if(document.getElementById("hateshield-styles"))return;const t=document.createElement("style");t.id="hateshield-styles",t.textContent=`
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
      `,document.head.appendChild(t)}detectLang(t){if(/[\u0600-\u06FF]/.test(t))return"ar";const o=(t.match(/\b(le|la|les|de|du|des|un|une|est|et|que|qui|dans|pour|avec|sur|pas|mais|tout|cette|sont|nous|vous|ils|très|même|après|fait)\b/gi)||[]).length,n=(t.match(/\b(il|la|le|di|del|un|una|che|non|per|con|sono|come|questo|quello|anche|più|tutto|molto|altro|dopo|fare|essere|avere)\b/gi)||[]).length;return o>2&&o>n?"fr":n>2&&n>o?"it":"en"}t(t){return this.MESSAGES[t]||this.MESSAGES.en}esc(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}findHateWords(t){const o=t.toLowerCase(),n=[];let e=this.detectLang(t);const a=[e,...Object.keys(this.HATE_KEYWORDS).filter(i=>i!==e)];for(const i of a)for(const d of this.HATE_KEYWORDS[i]){const r=d.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),l=new RegExp(`(^|[\\s.,!?';:"()\\-])`+r+`($|[\\s.,!?';:"()\\-])`,"gi");let s;for(;(s=l.exec(o))!==null;){const c=s.index+s[1].length;n.some(p=>p.index===c)||(n.push({word:t.substr(c,d.length),index:c,lang:i}),i!==e&&n.filter(p=>p.lang===i).length>=2&&(e=i))}}return{foundWords:n,detectedLang:e}}async apiAnalyze(t){try{const o=await fetch(this.config.backendEndpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:t})});if(!o.ok)throw new Error(o.status);return await o.json()}catch(o){return console.warn("HateLess API error:",o),null}}setupMessageInterception(){const t=this;function o(n){if(!n)return null;if(n.tagName==="TEXTAREA"||n.tagName==="INPUT"&&n.type==="text")return n;let e=null,a=n;for(;a&&a!==document.body;){if((a.isContentEditable||a.getAttribute&&a.getAttribute("contenteditable")==="true")&&(e=a),a.getAttribute&&a.getAttribute("role")==="textbox")return a;a=a.parentElement}return e||n}document.addEventListener("input",function(n){if(!t.isActive)return;const e=o(n.target);e&&(e.isContentEditable||e.matches&&e.matches('input[type="text"], textarea, [contenteditable], [role="textbox"]'))&&t.realTimeAnalysis(e)},!0),document.addEventListener("keydown",function(n){if(!t.isActive||t._overlayOpen||n.key!=="Enter"||n.shiftKey)return;const e=o(n.target);if(!e||!(e.isContentEditable||e.matches&&e.matches('input[type="text"], textarea, [contenteditable], [role="textbox"]'))||!e.dataset.hsWords)return;if(window.location.hostname.includes("facebook.com")||window.location.hostname.includes("messenger.com")){const i=JSON.parse(e.dataset.hsWords),d=e.dataset.hsLang||"en",r=[...new Set(i.map(l=>l.word))];t.showAlertBanner("⚠️ "+t.t(d).title+" : "+r.join(", "));return}n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation(),t.interceptSend(e)},!0),document.addEventListener("click",function(n){if(!t.isActive||t._overlayOpen||n.target.closest&&n.target.closest(".hateshield-overlay, .hateshield-modal, .hateshield-control-panel, .hateshield-alert-banner, .hs-feedback, .hs-btn"))return;const e=n.target.closest('button, [role="button"], input[type="submit"], .T-I-atl, [data-tooltip], [aria-label], a[role="link"]');if(!e||e.id&&e.id.startsWith("hs-")||e.classList&&(e.classList.contains("hs-btn")||e.classList.contains("hs-btn-delete")||e.classList.contains("hs-btn-edit")||e.classList.contains("hs-btn-send")))return;const a=(e.textContent||"").trim().toLowerCase(),i=(e.getAttribute("aria-label")||"").toLowerCase(),d=(e.getAttribute("data-tooltip")||"").toLowerCase(),r=e.className||"";if(!(["send","envoyer","submit","post","reply","إرسال","invia","publier","répondre","tweet","comment","poster","partager","share","publish"].some(m=>a.includes(m)||i.includes(m)||d.includes(m))||e.classList.contains("T-I-atl")||r.includes("submit")||e.querySelector('svg[aria-label*="Send"], svg[aria-label*="Envoyer"]')||e.type==="submit"))return;const c=document.querySelector("[data-hs-words]");if(!c)return;if(window.location.hostname.includes("facebook.com")||window.location.hostname.includes("messenger.com")){const m=JSON.parse(c.dataset.hsWords),b=c.dataset.hsLang||"en",x=[...new Set(m.map(v=>v.word))];t.showAlertBanner("⚠️ "+t.t(b).title+" : "+x.join(", "));return}n.preventDefault(),n.stopPropagation(),n.stopImmediatePropagation(),t.interceptSend(c,e)},!0),document.addEventListener("submit",function(n){if(!t.isActive)return;const e=n.target.querySelector("[data-hs-words]");!e||window.location.hostname.includes("facebook.com")||window.location.hostname.includes("messenger.com")||(n.preventDefault(),n.stopPropagation(),t.interceptSend(e))},!0)}realTimeAnalysis(t){const o=t.value||t.innerText||"";if(!o||o.length<3){t.classList.remove("hs-input-flagged","hs-input-safe"),delete t.dataset.hsWords,delete t.dataset.hsLang;return}clearTimeout(this.debounceTimer),this.debounceTimer=setTimeout(async()=>{this.stats.scanned++;const{foundWords:n,detectedLang:e}=this.findHateWords(o);if(n.length>0){t.classList.add("hs-input-flagged"),t.classList.remove("hs-input-safe"),t.dataset.hsWords=JSON.stringify(n),t.dataset.hsLang=e,n.forEach(i=>this.detectedWords.add(i.word)),this.stats.flagged++;const a=[...new Set(n.map(i=>i.word))];this.showAlertBanner("⚠️ "+this.t(e).title+" : "+a.join(", ")),this.isChildMode&&(this.showAlertBanner("⛔ "+this.t(e).childTitle),setTimeout(()=>{this.clearElement(t),t.classList.remove("hs-input-flagged"),delete t.dataset.hsWords,delete t.dataset.hsLang,this.showChildBlockModal(e,t)},300)),this.updatePanel(!0)}else t.classList.remove("hs-input-flagged"),t.classList.add("hs-input-safe"),delete t.dataset.hsWords,delete t.dataset.hsLang,this.updatePanel(!1);if(o.length>=10&&!this.isAnalyzing){this.isAnalyzing=!0;const a=await this.apiAnalyze(o);this.isAnalyzing=!1,a&&a.toxicity&&a.toxicity.is_toxic&&n.length===0&&(t.classList.add("hs-input-flagged"),t.dataset.hsWords=JSON.stringify([{word:"(API)",index:0,lang:e}]),t.dataset.hsLang=e,this.stats.flagged++,this.showAlertBanner("🔬 Contenu toxique détecté"),this.updatePanel(!0))}},this.config.debounceMs)}interceptSend(t,o){const n=t.dataset.hsWords;if(!n)return;const e=JSON.parse(n),a=t.dataset.hsLang||"en",i=t.value||t.innerText||"";this.isChildMode?this.showChildBlockModal(a,t):this.showDecisionOverlay(i,e,a,t,o)}showDecisionOverlay(t,o,n,e,a){const i=this.t(n),d=[...new Set(o.map(h=>h.word))],r=this;let l=this.esc(t.substring(0,300));d.forEach(h=>{const f=new RegExp("("+this.esc(h).replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","gi");l=l.replace(f,'<span class="hateshield-highlighted-word">$1</span>')}),t.length>300&&(l+="…"),r._overlayOpen=!0;const s=document.createElement("div");s.className="hateshield-overlay";const c=document.createElement("div");c.className="hateshield-modal",c.innerHTML='<div class="hs-modal-icon">⚠️</div><div class="hs-modal-title">'+i.title+'</div><div class="hs-modal-desc">'+i.desc+'</div><div class="hs-modal-preview"><div class="hs-modal-preview-label">'+i.yourMsg+'</div><div class="hs-modal-preview-text">'+l+'</div></div><div style="text-align:center;margin-bottom:8px;font-size:12px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.5px">🚫 '+i.detected+'</div><div class="hs-modal-words">'+d.map(h=>'<span class="hs-word-tag">'+this.esc(h)+"</span>").join("")+'</div><div class="hs-modal-actions"></div><div class="hs-modal-tip">'+i.tip+"</div>",s.appendChild(c);function p(){r._overlayOpen=!1,s.parentNode&&s.remove()}const m=c.querySelector(".hs-modal-actions"),b=document.createElement("button");b.className="hs-btn hs-btn-delete",b.textContent=i.delete;const x=document.createElement("button");x.className="hs-btn hs-btn-edit",x.textContent=i.edit;const v=document.createElement("button");v.className="hs-btn hs-btn-send",v.textContent=i.send,m.appendChild(b),m.appendChild(x),m.appendChild(v),document.body.appendChild(s),s.addEventListener("mousedown",function(h){h.stopPropagation(),h.stopImmediatePropagation()},!0),s.addEventListener("mouseup",function(h){h.stopPropagation(),h.stopImmediatePropagation()},!0),s.addEventListener("click",function(h){h.stopPropagation(),h.stopImmediatePropagation();const f=h.target;if(f===b||f.closest(".hs-btn-delete")){p(),r.clearElement(e),e.classList.remove("hs-input-flagged"),delete e.dataset.hsWords,delete e.dataset.hsLang,e.focus(),r.showFeedback(i.deleted,"success"),r.updatePanel(!1);return}if(f===x||f.closest(".hs-btn-edit")){p(),e.focus();return}if(f===v||f.closest(".hs-btn-send")){if(p(),delete e.dataset.hsWords,delete e.dataset.hsLang,e.classList.remove("hs-input-flagged"),a)a.click();else{e.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",code:"Enter",keyCode:13,which:13,bubbles:!0}));const y=e.closest("form");if(y){const w=y.querySelector('button[type="submit"],input[type="submit"],button:not([type])');w&&w.click()}}return}f===s&&(p(),e.focus())},!0)}showChildBlockModal(t,o){const n=this.t(t),e=this;e._overlayOpen=!0;const a=document.createElement("div");a.className="hateshield-overlay hs-child-modal";const i=document.createElement("div");i.className="hateshield-modal",i.innerHTML='<div class="hs-modal-icon">🛡️</div><div class="hs-modal-title">'+n.childTitle+'</div><div class="hs-modal-desc">'+n.childDesc+'</div><div style="margin:16px 0;font-size:14px;color:rgba(255,255,255,.6);text-align:center">'+n.childSub+'</div><div class="hs-modal-actions"></div>',a.appendChild(i);function d(){e._overlayOpen=!1,a.parentNode&&a.remove()}const r=i.querySelector(".hs-modal-actions"),l=document.createElement("button");l.className="hs-btn hs-btn-delete",l.textContent=n.childOk,r.appendChild(l),document.body.appendChild(a),a.addEventListener("mousedown",function(s){s.stopPropagation(),s.stopImmediatePropagation()},!0),a.addEventListener("mouseup",function(s){s.stopPropagation(),s.stopImmediatePropagation()},!0),a.addEventListener("click",function(s){s.stopPropagation(),s.stopImmediatePropagation(),(s.target===l||s.target.closest(".hs-btn-delete"))&&(d(),e.clearElement(o),o.classList.remove("hs-input-flagged"),delete o.dataset.hsWords,delete o.dataset.hsLang,o.focus())},!0)}showAlertBanner(t){const o=document.querySelector(".hateshield-alert-banner");o&&o.remove();const n=document.createElement("div");n.className="hateshield-alert-banner";const e=document.createElement("div");e.style.fontSize="22px",e.textContent="⚠️",n.appendChild(e);const a=document.createElement("div");a.innerHTML=t,n.appendChild(a);const i=document.createElement("button");i.style.cssText="background:rgba(255,255,255,.15);color:#fff;border:none;border-radius:50%;width:24px;height:24px;cursor:pointer;font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-left:auto",i.textContent="✕",i.onclick=function(d){d.stopPropagation(),d.stopImmediatePropagation(),n.style.opacity="0",n.style.transform="translateX(120%)",setTimeout(()=>n.remove(),300)},n.appendChild(i),n.onclick=function(){n.style.opacity="0",n.style.transform="translateX(120%)",setTimeout(()=>n.remove(),300)},document.body.appendChild(n),setTimeout(()=>{n.parentNode&&(n.style.opacity="0",n.style.transform="translateX(120%)",setTimeout(()=>{n.parentNode&&n.remove()},300))},this.config.alertDuration)}showFeedback(t,o){const n={success:"#10b981",error:"#dc2626",warning:"#f59e0b",info:"#3b82f6"},e=document.createElement("div");e.className="hs-feedback",e.style.background=n[o]||n.info,e.textContent=t,document.body.appendChild(e),setTimeout(()=>e.remove(),3500)}createControlPanel(){if(document.querySelector(".hateshield-control-panel"))return;const t=this,o=document.createElement("div");o.className="hateshield-control-panel";const n="data:image/png;base64,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";o.innerHTML=`
        <div class="hs-panel-header">
          <div class="hs-panel-logo"><img src="${n}" alt="HateLess"></div>
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
      `,document.body.appendChild(o);const e=o.querySelector(".hs-panel-header");let a=!1,i=0,d=0,r=0,l=0;e.addEventListener("mousedown",function(s){s.target.closest("button")||(a=!0,o.classList.add("hs-dragging"),r=s.clientX-o.offsetLeft,l=s.clientY-o.offsetTop,o.style.right="auto",o.style.bottom="auto",o.style.left=o.offsetLeft+"px",o.style.top=o.offsetTop+"px")}),document.addEventListener("mousemove",function(s){if(a){s.preventDefault(),i=s.clientX-r,d=s.clientY-l;const c=window.innerWidth-o.offsetWidth,p=window.innerHeight-o.offsetHeight;i=Math.max(0,Math.min(i,c)),d=Math.max(0,Math.min(d,p)),o.style.left=i+"px",o.style.top=d+"px",o.style.right="auto",o.style.bottom="auto"}}),document.addEventListener("mouseup",function(){a&&(a=!1,o.classList.remove("hs-dragging"))}),o.querySelector("#hs-child-toggle").addEventListener("click",function(){t.isChildMode=!t.isChildMode,chrome.storage.sync.set({isChildMode:t.isChildMode}),t.isChildMode?(this.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg> Mode Enfant ON',this.style.background="linear-gradient(135deg,#f59e0b,#d97706)",document.body.classList.add("hateshield-child-mode")):(this.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> Mode Adulte',this.style.background="linear-gradient(135deg,#06b6d4,#8b5cf6)",document.body.classList.remove("hateshield-child-mode")),document.querySelectorAll("[data-hs-scanned]").forEach(s=>{s.dataset.hsOriginalHtml&&(s.innerHTML=s.dataset.hsOriginalHtml),delete s.dataset.hsScanned}),document.querySelectorAll(".hateshield-child-word").forEach(s=>{s.outerHTML=s.textContent||""}),document.querySelectorAll(".hateshield-highlighted-word").forEach(s=>{s.outerHTML=s.textContent||""}),document.querySelectorAll("[data-hs-scanned]").forEach(s=>{delete s.dataset.hsScanned}),t.scanPageContent()})}updatePanel(t){const o=document.getElementById("hs-dot");o&&(t?o.classList.add("flagged"):o.classList.remove("flagged"))}scanPageContent(){const t=this,o=new Set(["SCRIPT","STYLE","NOSCRIPT","IFRAME","SVG","MATH","CODE","PRE","TEXTAREA","INPUT"]),n=[".hateshield-overlay",".hateshield-modal",".hateshield-control-panel",".hateshield-alert-banner",".hs-feedback"],e=new Set,a=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:function(i){const d=i.parentElement;if(!d||o.has(d.tagName)||d.closest&&d.closest(n.join(","))||d.id&&d.id.startsWith("hs-"))return NodeFilter.FILTER_REJECT;const r=(i.textContent||"").trim();if(r.length<2)return NodeFilter.FILTER_SKIP;const l=r.toLowerCase();let s=!1;for(const c of["en","fr","ar","it"])if(t.HATE_KEYWORDS[c]&&t.HATE_KEYWORDS[c].some(p=>l.includes(p.toLowerCase()))){s=!0;break}return s?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP}});for(;a.nextNode();){let r=a.currentNode.parentElement;if(r&&r.childNodes.length===1&&r.parentElement){const l=r.tagName;(l==="SPAN"||l==="B"||l==="I"||l==="EM"||l==="STRONG"||l==="FONT")&&(r=r.parentElement)}r&&!r.dataset.hsScanned&&!r.classList.contains("hateshield-child-word")&&!r.classList.contains("hateshield-highlighted-word")&&e.add(r)}e.forEach(i=>{if(i.dataset.hsScanned||i.closest&&i.closest(n.join(",")))return;i.dataset.hsScanned="true";const d=i.innerText||i.textContent||"";if(d.length<2)return;this.stats.scanned++;const{foundWords:r,detectedLang:l}=this.findHateWords(d);if(r.length>0){this.stats.flagged++;const s=[...new Set(r.map(p=>p.word))];i.dataset.hsOriginalHtml||(i.dataset.hsOriginalHtml=i.innerHTML);let c=i.dataset.hsOriginalHtml;s.forEach(p=>{const m=new RegExp("("+p.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+")","gi");this.isChildMode?c=c.replace(m,'<span class="hateshield-child-word" title="Contenu masqué">$1</span>'):c=c.replace(m,'<span class="hateshield-highlighted-word">$1</span>')}),i.innerHTML=c,this.updatePanel(!0)}}),this.updatePanel(!1)}observeDOM(){const t=this;new MutationObserver(n=>{if(!t.isActive)return;let e=!1;for(const a of n)for(const i of a.addedNodes)i.nodeType===1&&(i.isContentEditable||i.matches&&i.matches('[contenteditable], [role="textbox"], textarea, input[type="text"]'),e=!0);e&&t.scanPageContent()}).observe(document.body,{childList:!0,subtree:!0})}clearElement(t){if(t){if(t.tagName==="TEXTAREA"||t.tagName==="INPUT"){const o=Object.getOwnPropertyDescriptor(t.tagName==="TEXTAREA"?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype,"value");o&&o.set&&o.set.call(t,""),t.value=""}else{t.focus();try{document.execCommand("selectAll",!1,null),document.execCommand("delete",!1,null)}catch{}for(;t.firstChild;)t.removeChild(t.firstChild);t.innerHTML="",t.textContent="",t.innerText!==void 0&&(t.innerText=""),t.isContentEditable&&t.appendChild(document.createElement("br")),setTimeout(()=>{(t.innerText||t.textContent||"").trim().length>0&&(t.innerHTML="",t.isContentEditable&&t.appendChild(document.createElement("br")))},10)}t.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),t.dispatchEvent(new Event("change",{bubbles:!0,composed:!0})),t.dispatchEvent(new KeyboardEvent("keydown",{key:"Backspace",bubbles:!0})),t.dispatchEvent(new KeyboardEvent("keyup",{key:"Backspace",bubbles:!0}))}}}const u=new E;chrome.storage.sync.get(["isActive","isChildMode"],g=>{if(u.isActive=!0,u.isChildMode=g.isChildMode||!1,chrome.storage.sync.set({isActive:!0}),u.isChildMode){document.body.classList.add("hateshield-child-mode");const t=document.getElementById("hs-child-toggle");t&&(t.textContent="👶 Mode Enfant ON",t.style.background="linear-gradient(135deg,#f59e0b,#d97706)")}u.init(),console.log("🛡️ HateLess — isActive:",u.isActive,"childMode:",u.isChildMode)}),chrome.runtime.onMessage.addListener(g=>{g.action==="toggleDetection"&&(u.isActive=g.isActive,u.isActive?u.init():(document.querySelectorAll(".hateshield-control-panel, .hateshield-alert-banner, .hs-feedback").forEach(t=>t.remove()),document.querySelectorAll(".hs-input-flagged,.hs-input-safe").forEach(t=>{t.classList.remove("hs-input-flagged","hs-input-safe"),delete t.dataset.hsWords,delete t.dataset.hsLang}))),g.action==="toggleChildMode"&&(u.isChildMode=g.isChildMode,chrome.storage.sync.set({isChildMode:g.isChildMode}),g.isChildMode?document.body.classList.add("hateshield-child-mode"):document.body.classList.remove("hateshield-child-mode"))})})();
