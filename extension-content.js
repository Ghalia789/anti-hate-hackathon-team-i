"""
Extension JavaScript - Détection Optimisée de Hate Speech
Cache + Debouncing + Pattern Matching pour performance quasi-instantanée
*/

// Configuration
const CONFIG = {
    API_URL: 'https://YOUR-API-URL.run.app/api/analyze',
    DEBOUNCE_DELAY: 500, // ms
    CACHE_DURATION: 3600000, // 1 heure
    API_TIMEOUT: 3000 // 3 secondes
};

// Patterns de mots-clés pour détection rapide
const HATE_KEYWORDS = {
    fr: ['terroriste', 'terroristes', 'violent', 'tuer', 'tuez', 'brûler', 'brûlez', 'mort', 'morts', 'haine'],
    en: ['kill', 'hate', 'terrorist', 'violence', 'burn', 'death', 'destroy'],
    ar: ['إرهابي', 'يقتل', 'يحرق', 'موت', 'كراهية'],
    it: ['terrorista', 'uccidere', 'morte', 'violenza', 'bruciare'],
    es: ['terrorista', 'matar', 'muerte', 'violencia', 'quemar']
};

// Système de cache local
class LocalCache {
    constructor(duration = CONFIG.CACHE_DURATION) {
        this.duration = duration;
        this.prefix = 'hate_detect_';
    }
    
    _getKey(text) {
        // Créer une clé unique pour le texte
        const normalized = text.toLowerCase().trim();
        return this.prefix + btoa(normalized).substring(0, 32);
    }
    
    get(text) {
        try {
            const key = this._getKey(text);
            const cached = localStorage.getItem(key);
            if (!cached) return null;
            
            const data = JSON.parse(cached);
            
            // Vérifier si le cache est encore valide
            if (Date.now() - data.timestamp < this.duration) {
                console.log('✓ Cache hit:', text.substring(0, 30) + '...');
                return data.result;
            }
            
            // Cache expiré
            localStorage.removeItem(key);
            return null;
        } catch (e) {
            return null;
        }
    }
    
    set(text, result) {
        try {
            const key = this._getKey(text);
            localStorage.setItem(key, JSON.stringify({
                result: result,
                timestamp: Date.now()
            }));
        } catch (e) {
            console.warn('Cache storage error:', e);
        }
    }
    
    clear() {
        // Nettoyer tous les caches de l'extension
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        }
    }
}

// Détecteur de hate speech
class HateSpeechDetector {
    constructor() {
        this.cache = new LocalCache();
        this.debounceTimer = null;
        this.apiUrl = CONFIG.API_URL;
        this.pendingRequests = new Map();
    }
    
    // Détection rapide par mots-clés (instantanée)
    quickCheck(text, language) {
        const keywords = HATE_KEYWORDS[language] || HATE_KEYWORDS.en;
        const lowerText = text.toLowerCase();
        
        for (let keyword of keywords) {
            if (lowerText.includes(keyword.toLowerCase())) {
                return {
                    detected: true,
                    keyword: keyword,
                    instant: true
                };
            }
        }
        
        return { detected: false };
    }
    
    // Méthode principale de détection
    async detect(text, language = 'en') {
        // Ignorer les textes trop courts
        if (!text || text.trim().length < 3) {
            this.hideWarning();
            return;
        }
        
        // 1. Vérifier le cache (INSTANTANÉ)
        const cached = this.cache.get(text);
        if (cached) {
            this.displayResult(cached, true);
            return Promise.resolve(cached);
        }
        
        // 2. Quick check avec patterns (QUASI-INSTANTANÉ)
        const quickResult = this.quickCheck(text, language);
        if (quickResult.detected) {
            this.showQuickWarning(quickResult.keyword);
        }
        
        // 3. Debouncing - attendre que l'utilisateur finisse de taper
        return new Promise((resolve) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(async () => {
                try {
                    this.showLoader();
                    const result = await this.callAPI(text, language);
                    this.cache.set(text, result);
                    this.displayResult(result, false);
                    this.hideLoader();
                    resolve(result);
                } catch (error) {
                    console.error('Detection error:', error);
                    this.hideLoader();
                    this.hideWarning();
                    resolve({ error: true });
                }
            }, CONFIG.DEBOUNCE_DELAY);
        });
    }
    
    // Appel API avec timeout
    async callAPI(text, language) {
        // Éviter les appels multiples pour le même texte
        const requestKey = text + language;
        if (this.pendingRequests.has(requestKey)) {
            return this.pendingRequests.get(requestKey);
        }
        
        const requestPromise = fetch(this.apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                language: language
            }),
            signal: AbortSignal.timeout(CONFIG.API_TIMEOUT)
        })
        .then(response => response.json())
        .then(data => {
            this.pendingRequests.delete(requestKey);
            return data;
        })
        .catch(error => {
            this.pendingRequests.delete(requestKey);
            throw error;
        });
        
        this.pendingRequests.set(requestKey, requestPromise);
        return requestPromise;
    }
    
    // Affichage du résultat
    displayResult(result, isInstant) {
        if (result.is_hate_speech) {
            this.showWarning(result, isInstant);
        } else {
            this.hideWarning();
        }
    }
    
    // Afficher warning rapide (avant confirmation API)
    showQuickWarning(keyword) {
        const badge = this.getOrCreateWarningBadge();
        badge.className = 'hate-speech-warning quick';
        badge.innerHTML = `
            <span class="warning-icon">⚠️</span>
            <span class="warning-text">Mot potentiellement offensant détecté: "${keyword}"</span>
            <span class="status">Vérification en cours...</span>
        `;
        badge.style.display = 'flex';
    }
    
    // Afficher warning complet (après API)
    showWarning(result, isInstant) {
        const badge = this.getOrCreateWarningBadge();
        badge.className = 'hate-speech-warning confirmed';
        
        const confidence = Math.round(result.hate_speech_score * 100);
        const source = isInstant ? 'cache' : 'API';
        
        badge.innerHTML = `
            <span class="warning-icon">🛑</span>
            <span class="warning-text">Contenu potentiellement offensant</span>
            <span class="confidence">${confidence}% confiance</span>
            <span class="source">${source}</span>
        `;
        badge.style.display = 'flex';
    }
    
    // Afficher loader pendant l'analyse
    showLoader() {
        const badge = this.getOrCreateWarningBadge();
        badge.className = 'hate-speech-warning loading';
        badge.innerHTML = `
            <span class="loader">⏳</span>
            <span class="warning-text">Analyse en cours...</span>
        `;
        badge.style.display = 'flex';
    }
    
    // Cacher le warning
    hideWarning() {
        const badge = document.getElementById('hate-speech-badge');
        if (badge) {
            badge.style.display = 'none';
        }
    }
    
    hideLoader() {
        // Le loader sera remplacé par le résultat
    }
    
    // Créer ou récupérer le badge de warning
    getOrCreateWarningBadge() {
        let badge = document.getElementById('hate-speech-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.id = 'hate-speech-badge';
            badge.className = 'hate-speech-warning';
            document.body.appendChild(badge);
        }
        return badge;
    }
}

// Initialisation
const detector = new HateSpeechDetector();

// Écouter tous les champs de texte
function attachListeners() {
    const selector = 'textarea, input[type="text"], [contenteditable="true"]';
    
    document.addEventListener('input', (e) => {
        if (e.target.matches(selector)) {
            const text = e.target.value || e.target.textContent;
            const lang = document.documentElement.lang || 'en';
            detector.detect(text, lang);
        }
    }, true);
    
    // Observer pour les champs dynamiques
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    if (node.matches && node.matches(selector)) {
                        attachListenerToElement(node);
                    }
                    // Chercher dans les enfants
                    node.querySelectorAll && node.querySelectorAll(selector).forEach(attachListenerToElement);
                }
            });
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function attachListenerToElement(element) {
    element.addEventListener('input', (e) => {
        const text = e.target.value || e.target.textContent;
        const lang = document.documentElement.lang || 'en';
        detector.detect(text, lang);
    });
}

// Démarrer quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', attachListeners);
} else {
    attachListeners();
}

// Export pour utilisation dans d'autres scripts
window.HateSpeechDetector = HateSpeechDetector;
window.hateSpeechDetector = detector;
