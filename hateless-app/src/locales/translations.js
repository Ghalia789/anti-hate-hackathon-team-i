export const translations = {
  fr: {
    // Navigation
    'nav.guide': 'Guide',
    'nav.apiTest': 'API Test',
    'nav.apiIntegration': 'Intégration API',
    'nav.articles': 'Articles',
    'nav.support': 'Aide & Soutien',

    // Hero
    'hero.badge': 'Une API intelligente qui détecte le discours haineux',
    'hero.title': 'Détectez le Hatespeech en Temps Réel',
    'hero.subtitle': 'Une API gratuite, accessible à tous, pour créer un internet plus sûr et bienveillant.',
    'hero.btnStart': 'Commencer →',
    'hero.btnDoc': 'Documentation',
    'hero.feature1': 'Temps réel',
    'hero.feature2': 'Gratuit',

    // Guide
    'guide.title': 'Comment Utiliser Hateless',
    'guide.subtitle': 'Découvrez comment intégrer et utiliser notre API pour détecter le hatespeech',
    'guide.step1Title': 'Comprendre l\'API',
    'guide.step1': 'Notre API analyse les textes pour détecter le discours haineux, les insultes et le contenu toxique en temps réel.',
    'guide.step2Title': 'Tester en Direct',
    'guide.step2': 'Utilisez notre testeur d\'API pour voir comment elle fonctionne. Envoyez un texte et obtenez une analyse instantanée.',
    'guide.step3Title': 'Intégrer dans Votre App',
    'guide.step3': 'Copiez simplement le code fourni et intégrez l\'API dans votre application. Une seule requête suffit !',
    'guide.step4Title': 'Modérer le Contenu',
    'guide.step4': 'Utilisez les résultats pour modérer le contenu, protéger vos utilisateurs et créer une communauté bienveillante.',

    // API Tester
    'apiTester.title': 'Testez l\'API en Direct',
    'apiTester.subtitle': 'Saisissez un texte et notre modèle d\'IA analysera s\'il contient du discours haineux.',
    'apiTester.greeting': 'Vous pouvez tester maintenant notre API',
    'apiTester.askAgent': '',
    'apiTester.placeholder': 'Entrez votre texte ici...',
    'apiTester.url': 'URL de l\'API',
    'apiTester.endpoint': 'Point de terminaison',
    'apiTester.method': 'Méthode HTTP',
    'apiTester.body': 'Corps de la requête (JSON)',
    'apiTester.textToAnalyze': 'Texte à Analyser',
    'apiTester.send': 'Analyser le texte',
    'apiTester.analyzing': 'Analyse en cours...',
    'apiTester.response': 'Résultat de l\'Analyse',
    'apiTester.copy': 'Copier le résultat',
    'apiTester.errorURL': '❌ Erreur: Veuillez remplir l\'URL et le point de terminaison',
    'apiTester.waiting': 'En attente de réponse...',
    'apiTester.sending': '⏳ Envoi de la requête...',
    'apiTester.errorJSON': '❌ Erreur JSON: ',
    'apiTester.copied': 'Réponse copiée!',
    'apiTester.errorCopy': 'Impossible de copier la réponse',
    'apiTester.errorRequest': '❌ Erreur de requête:\n',
    'apiTester.errorCheck': '\n\nVérifiez que:\n- L\'API est accessible à l\'URL indiquée\n- Le CORS est configuré correctement\n- La requête est valide',
    
    'apiInt.title': 'Intégrez Notre API à Votre Application',
    'apiInt.subtitle': 'Utilisez notre détection de hatespeech en quelques lignes de code JavaScript',
    'apiInt.codeLabel': 'Exemple de Code - JavaScript',
    'apiInt.copy': 'Copier le Code',
    'apiInt.responseTitle': 'Format de la Réponse',
    'apiInt.responseNote': 'La confiance varie de 0.0 à 1.0. Définissez un seuil selon vos besoins.',

    // Articles
    'articles.title': 'Articles et Ressources',
    'articles.subtitle': 'Guides pratiques et articles pour promouvoir le bien-être et lutter contre le hatespeech',
    'articles.search': 'Rechercher un article...',
    'articles.allArticles': 'Tous les articles',
    'articles.mentalHealth': 'Santé Mentale',
    'articles.hatespeech': 'Hatespeech',
    'articles.communication': 'Communication',
    'articles.wellness': 'Bien-être',
    'articles.noResults': 'Aucun article ne correspond à votre recherche.',
    'articles.readMore': 'Lire l\'article →',

    // Articles Content
    'articlesContent.article1.title': 'Comprendre le Hatespeech : Définitions et Impacts',
    'articlesContent.article1.excerpt': 'Le hatespeech englobe toute expression incitant à la discrimination ou la violence contre un groupe protégé.',
    'articlesContent.article1.fullContent': `Le hatespeech, ou discours de haine, englobe toute expression verbale ou écrite incitant à la discrimination, l'hostilité ou la violence contre un individu ou un groupe basé sur l'appartenance à une catégorie protégée (race, religion, orientation sexuelle, genre, handicap, apparence physique).

## Formes du Hatespeech
- Commentaires insultants et dégradants
- Stéréotypes nuisibles et fausses généralisations
- Incitation à la discrimination ou à la violence
- Déshumanisation de groupes entiers
- Blagues ou mèmes offensants ciblant des identités

## Impacts Psychologiques et Sociaux
Les discours de haine peuvent causer des traumatismes psychologiques durables : anxiété chronique, dépression, blessures émotionnelles. Ils polarisent les communautés, renforcent les préjugés et normalisent les comportements discriminatoires en ligne. Les victimes rapportent une diminution de leur estime de soi et un isolement social accru.

## Consequences à Long Terme
- Problèmes de santé mentale chroniques
- Isolement social et marginalisation
- Perte de confiance dans les communautés en ligne
- Perpétuation de cycles de discrimination
- Renforcement des divisions sociales`,
    'articlesContent.article1.author': 'Dr. Marie Dupont',

    'articlesContent.article2.title': 'Gérer l\'Anxiété Liée aux Réseaux Sociaux',
    'articlesContent.article2.excerpt': 'L\'exposition aux contenus toxiques peut générer du stress chronique. Découvrez des stratégies efficaces.',
    'articlesContent.article2.fullContent': `L'exposition prolongée aux contenus toxiques et aux discours de haine sur les réseaux sociaux peut générer du stress chronique, de l'anxiété et même des symptômes dépressifs avérés par de nombreuses études scientifiques.

## Signes d'Anxiété Liée aux Réseaux Sociaux
- Vérification compulsive des notifications
- Sentiment de malaise en voyant certains commentaires
- Insomnies et perturbations du sommeil
- Sentiment d'isolement malgré la connexion
- Rumination obsessive sur les interactions négatives

## Stratégies Efficaces de Gestion
1. **Limiter le temps d'écran** : Fixez des heures sans téléphone
2. **Utiliser les filtres de contenu** : Bloquez les mots-clés déclencheurs
3. **Pratiquer la pleine conscience** : Méditation quotidienne
4. **Chercher du soutien communautaire** : Rejoignez des groupes positifs
5. **Consulter un professionnel** : Un psychologue peut offrir des outils adaptés`,
    'articlesContent.article2.author': 'Dr. Jean Martin',

    'articlesContent.article3.title': 'Dialogue Constructif : Comment Répondre au Cyberharcèlement',
    'articlesContent.article3.excerpt': 'La communication non-violente est essentielle face aux attaques en ligne. Apprenez les bonnes pratiques.',
    'articlesContent.article3.fullContent': `Face aux attaques en ligne, la communication non-violente est essentielle pour protéger votre santé mentale et désamorcer les conflits.

## Principes de la Communication Non-Violente
1. **Écoutez activement** : Essayez de comprendre le point de vue
2. **Exprimez vos émotions** : Dites "Je me sens blessé" plutôt que "Tu m'attaques"
3. **Évitez les accusations** : Utilisez "Je" plutôt que "Tu"
4. **Proposez des solutions** : Aidez à trouver un terrain d'entente

## Quand et Comment Répondre
- **Ne répondez pas immédiatement** : Attendez que votre calme revienne
- **Évitez les réactions publiques** : Les réponses privées sont plus efficaces
- **Documentez les incidents** : Conservez des screenshots
- **Signalez aux modérateurs** : Utilisez les outils de signalement`,
    'articlesContent.article3.author': 'Sophie Bernard',

    'articlesContent.article4.title': 'Pratiques de Bien-Être Digital : Cultiver un Environnement en Ligne Sain',
    'articlesContent.article4.excerpt': 'Créez un espace numérique qui favorise votre bien-être mental et émotionnel.',
    'articlesContent.article4.fullContent': `Créer et maintenir un environnement numérique sain est essentiel pour votre bien-être mental et émotionnel à long terme.

## Pratiques Quotidiennes de Bien-Être
1. **Curatez votre fil d'actualité** : Suivez des comptes inspirants
2. **Prenez des pauses régulières** : Déconnectez-vous plusieurs fois par jour
3. **Créez des routines saines** : Pas d'écran 1h avant le coucher
4. **Pratiquez la gratitude** : Notez 3 choses positives chaque jour
5. **Fixez des limites digitales** : Heures sans écran définies
6. **Engagez-vous dans des activités significatives** : Hobbies créatifs, bénévolat

## Ressources Professionnelles
Si vous avez besoin de soutien, notre application Theramind offre des thérapies guidées et du soutien émotionnel 24/7.`,
    'articlesContent.article4.author': 'Prof. Laurent Lefevre',

    // Support
    'support.title': 'Aide & Soutien Psychologique',
    'support.subtitle': 'Ressources et soutien pour ceux affectés par le hatespeech',
    'support.needHelp': 'Besoin d\'Aide?',
    'support.needHelpText': 'Accédez à notre application Theramind, une compagne IA dédiée à votre bien-être psychologique et émotionnel. Thérapie guidée, ressources éducatives et soutien continu 24/7.',
    'support.accessTheramind': 'Accéder à Theramind',
    'support.emergency': 'Numéro d\'Urgence',
    'support.emergencyText': 'Si vous êtes en détresse immédiate, appelez une ligne d\'aide professionnelle.',
    'support.community': 'Communauté de Soutien',
    'support.communityText': 'Rejoignez un forum sécurisé pour échanger avec d\'autres utilisateurs, partager vos expériences et recevoir du soutien de pairs dans un environnement bienveillant et sans jugement.',
    'support.joinCommunity': 'Rejoindre la Communauté',
    'support.faqs': 'Questions Fréquentes',
    'support.faq1Title': 'Que faire si je suis victime de hatespeech?',
    'support.faq2Title': 'Comment signaler le hatespeech?',
    'support.faq3Title': 'Comment protéger ma santé mentale en ligne?',
    'support.faq4Title': 'Existe-t-il des lois contre le hatespeech?',

    // Footer
    'footer.privacy': 'Confidentialité',
    'footer.terms': 'Conditions d\'Utilisation',
    'footer.contact': 'Contact',
  },
  en: {
    // Navigation
    'nav.guide': 'Guide',
    'nav.apiTest': 'API Test',
    'nav.apiIntegration': 'API Integration',
    'nav.articles': 'Articles',
    'nav.support': 'Support',

    // Hero
    'hero.badge': 'An intelligent API that detects hate speech',
    'hero.title': 'Detect Hate Speech in Real-Time',
    'hero.subtitle': 'A free API, accessible to everyone, to create a safer and more welcoming internet.',
    'hero.btnStart': 'Get Started →',
    'hero.btnDoc': 'Documentation',
    'hero.feature1': 'Real-time',
    'hero.feature2': 'Free',

    // Guide
    'guide.title': 'How to Use Hateless',
    'guide.subtitle': 'Discover how to integrate and use our API to detect hate speech',
    'guide.step1Title': 'Understand the API',
    'guide.step1': 'Our API analyzes text to detect hate speech, insults, and toxic content in real-time.',
    'guide.step2Title': 'Test It Live',
    'guide.step2': 'Use our API tester to see how it works. Send text and get instant analysis.',
    'guide.step3Title': 'Integrate Into Your App',
    'guide.step3': 'Simply copy the provided code and integrate the API into your application. One request is enough!',
    'guide.step4Title': 'Moderate Content',
    'guide.step4': 'Use the results to moderate content, protect your users, and build a welcoming community.',

    // API Tester
    'apiTester.title': 'Test the API Live',
    'apiTester.subtitle': 'Enter text and our AI model will analyze if it contains hate speech.',
    'apiTester.greeting': 'You can now test our API',
    'apiTester.askAgent': '',
    'apiTester.placeholder': 'Enter your text here...',
    'apiTester.url': 'API URL',
    'apiTester.endpoint': 'Endpoint',
    'apiTester.method': 'HTTP Method',
    'apiTester.body': 'Request Body (JSON)',
    'apiTester.textToAnalyze': 'Text to Analyze',
    'apiTester.send': 'Analyze Text',
    'apiTester.analyzing': 'Analyzing...',
    'apiTester.response': 'Analysis Result',
    'apiTester.copy': 'Copy Result',
    'apiTester.errorURL': '❌ Error: Please fill in the URL and endpoint',
    'apiTester.waiting': 'Waiting for response...',
    'apiTester.sending': '⏳ Sending request...',
    'apiTester.errorJSON': '❌ JSON Error: ',
    'apiTester.copied': 'Response copied!',
    'apiTester.errorCopy': 'Unable to copy response',
    'apiTester.errorRequest': '❌ Request error:\n',
    'apiTester.errorCheck': '\n\nVerify that:\n- The API is accessible at the given URL\n- CORS is configured correctly\n- The request is valid',
    
    'apiInt.title': 'Integrate Our API into Your Application',
    'apiInt.subtitle': 'Use our hate speech detection in just a few lines of JavaScript code',
    'apiInt.codeLabel': 'Code Example - JavaScript',
    'apiInt.copy': 'Copy Code',
    'apiInt.responseTitle': 'Response Format',
    'apiInt.responseNote': 'Confidence varies from 0.0 to 1.0. Set a threshold according to your needs.',

    // Articles
    'articles.title': 'Articles & Resources',
    'articles.subtitle': 'Practical guides and articles to promote well-being and fight hate speech',
    'articles.search': 'Search for an article...',
    'articles.allArticles': 'All articles',
    'articles.mentalHealth': 'Mental Health',
    'articles.hatespeech': 'Hate Speech',
    'articles.communication': 'Communication',
    'articles.wellness': 'Wellness',
    'articles.noResults': 'No articles match your search.',
    'articles.readMore': 'Read article →',

    // Articles Content
    'articlesContent.article1.title': 'Understanding Hate Speech and Its Mental Health Impacts',
    'articlesContent.article1.excerpt': 'How hate speech affects our mental well-being and how to cope with it.',
    'articlesContent.article1.fullContent': `# Understanding Hate Speech and Its Mental Health Impacts

## Definition
Hate speech refers to aggressive expressions targeting a person or group based on their race, religion, gender, sexual orientation, disability, or other personal characteristics.

## Psychological Impacts
Research shows that exposure to hate speech can cause:
- **Depression and Anxiety**: Constant feelings of sadness and fear
- **Lower Self-Esteem**: Questioning one's own value
- **Post-Traumatic Stress**: Persistent negative memories
- **Social Isolation**: Withdrawal due to fear of being targeted again

## How to Cope
1. **Recognize and Validate Your Emotions**: Your feelings are valid
2. **Limit Exposure**: Reduce time on toxic platforms
3. **Seek Support**: Talk to friends, family, or professionals
4. **Report Content**: Use reporting tools to flag hateful messages
5. **Practice Self-Care**: Engage in activities that restore your well-being

## Professional Resources
If you need support, our Theramind application offers guided therapy and emotional support 24/7.`,
    'articlesContent.article1.author': 'Dr. Sophie Martin',

    'articlesContent.article2.title': 'Managing Anxiety Related to Social Media',
    'articlesContent.article2.excerpt': 'Practical strategies to reduce stress caused by digital platforms.',
    'articlesContent.article2.fullContent': `# Managing Anxiety Related to Social Media

## Understanding Social Media Anxiety
Social media can trigger anxiety through:
- **Social Comparison**: Comparing your life to others' curated posts
- **FOMO** (Fear of Missing Out): Feeling left behind
- **Constant Connectivity**: Pressure to always be available
- **Negative Comments**: Exposure to criticism and hate speech

## Warning Signs
- Excessive checking of notifications
- Sleep disturbances
- Mood changes after using social media
- Feelings of inadequacy

## Management Strategies
### 1. Set Healthy Boundaries
- Limit daily usage time (1-2 hours maximum)
- Turn off non-essential notifications
- Create "tech-free" zones (bedroom, dining table)

### 2. Curate Your Feed
- Unfollow accounts that make you feel bad
- Follow positive and inspiring content
- Use privacy features to protect yourself

### 3. Practice Mindfulness
- Be present when using social media
- Ask yourself: "Does this serve me?"
- Take regular breaks

### 4. Build Real Connections
- Prioritize in-person relationships
- Engage in meaningful conversations
- Share authentically, not just "perfect" moments

## When to Seek Help
If anxiety persists despite these strategies, consult a mental health professional through platforms like Theramind.`,
    'articlesContent.article2.author': 'Dr. Marie Dubois',

    'articlesContent.article3.title': 'Constructive Dialogue: Fighting Cyberbullying',
    'articlesContent.article3.excerpt': 'How to engage in positive conversations and prevent online harassment.',
    'articlesContent.article3.fullContent': `# Constructive Dialogue: Fighting Cyberbullying

## What is Cyberbullying?
Cyberbullying is intentional, repeated harassment through digital platforms. It differs from occasional conflict by its:
- Repetitive nature
- Power imbalance
- Intent to harm
- Public humiliation potential

## Recognizing Cyberbullying
### For Victims:
- Receiving threatening or insulting messages
- Exclusion from online groups
- Spreading of false rumors
- Sharing private information without consent

### For Witnesses:
- Someone being repeatedly targeted
- Visible distress in responses
- Piling on by multiple users

## How to Respond as a Victim
1. **Don't Engage**: Don't respond to provocations
2. **Document Everything**: Save screenshots with dates
3. **Block and Report**: Use platform safety tools
4. **Seek Support**: Talk to trusted adults or friends
5. **Protect Your Privacy**: Review security settings

## How to Be an Ally
- Don't share harassing content
- Publicly support the victim (if safe)
- Report abusive behavior
- Send private messages of support

## Promoting Constructive Dialogue
### Active Listening
- Read carefully before responding
- Acknowledge the other person's perspective
- Ask clarifying questions

### Respectful Expression
- Use "I" statements ("I feel..." vs "You always...")
- Stay fact-based, not personal
- Acknowledge common ground

### De-escalation
- Take a break if emotions run high
- Suggest moving to private messaging
- Know when to disengage

## Educational Approach
Teaching empathy and digital citizenship in schools and homes can prevent cyberbullying before it starts.`,
    'articlesContent.article3.author': 'Prof. Jean Rousseau',

    'articlesContent.article4.title': 'Digital Wellness Practices for a Healthy Balance',
    'articlesContent.article4.excerpt': 'Creating a balanced relationship with technology for better mental health.',
    'articlesContent.article4.fullContent': `# Digital Wellness Practices for a Healthy Balance

## What is Digital Wellness?
Digital wellness means using technology in ways that support, rather than harm, your mental and physical health.

## The Digital Wellness Challenge
Modern life creates:
- **Information Overload**: Constant stream of news and updates
- **Always-On Culture**: Expectation of immediate responses
- **Screen Fatigue**: Physical strain from excessive screen time
- **Diminished Focus**: Constant interruptions fragmenting attention

## Core Principles of Digital Wellness

### 1. Intentional Usage
Ask yourself before opening an app:
- What is my purpose?
- Will this serve my goals?
- Is this the best use of my time?

### 2. The Digital Detox
Regular breaks from technology:
- **Daily**: One hour before bed without screens
- **Weekly**: One full day offline
- **Monthly**: A weekend digital retreat

### 3. Physical Health
Protect your body:
- **20-20-20 Rule**: Every 20 minutes, look 20 feet away for 20 seconds
- **Ergonomic Setup**: Proper chair, desk, screen height
- **Movement Breaks**: Stand and stretch every hour

### 4. Sleep Hygiene
- No screens 1 hour before bed
- Use blue light filters after sunset
- Charge devices outside the bedroom

### 5. Mindful Consumption
- Subscribe to quality over quantity
- Fact-check before sharing
- Limit news consumption to specific times

### 6. Engage in Meaningful Activities
- Creative hobbies
- Volunteer work
- Nature walks
- Face-to-face socializing

## Professional Resources
If you need support, our Theramind application offers guided therapy and emotional support 24/7.`,
    'articlesContent.article4.author': 'Prof. Laurent Lefevre',

    // Support
    'support.title': 'Help & Psychological Support',
    'support.subtitle': 'Resources and support for those affected by hate speech',
    'support.needHelp': 'Need Help?',
    'support.needHelpText': 'Access our Theramind application, an AI companion dedicated to your psychological and emotional well-being. Guided therapy, educational resources and continuous support 24/7.',
    'support.accessTheramind': 'Access Theramind',
    'support.emergency': 'Emergency Numbers',
    'support.emergencyText': 'If you are in immediate distress, call a professional helpline.',
    'support.community': 'Support Community',
    'support.communityText': 'Join a secure forum to exchange with other users, share your experiences and receive peer support in a welcoming and judgment-free environment.',
    'support.joinCommunity': 'Join the Community',
    'support.faqs': 'Frequently Asked Questions',
    'support.faq1Title': 'What should I do if I\'m a victim of hate speech?',
    'support.faq2Title': 'How do I report hate speech?',
    'support.faq3Title': 'How can I protect my mental health online?',
    'support.faq4Title': 'Are there laws against hate speech?',

    // Footer
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms of Use',
    'footer.contact': 'Contact',
  },
  it: {
    // Navigation
    'nav.guide': 'Guida',
    'nav.apiTest': 'Test API',
    'nav.apiIntegration': 'Integrazione API',
    'nav.articles': 'Articoli',
    'nav.support': 'Supporto',

    // Hero
    'hero.badge': 'Un\'API intelligente che rileva il discorso d\'odio',
    'hero.title': 'Rileva il Discorso d\'Odio in Tempo Reale',
    'hero.subtitle': 'Un\'API gratuita, accessibile a tutti, per creare un internet più sicuro e accogliente.',
    'hero.btnStart': 'Inizia →',
    'hero.btnDoc': 'Documentazione',
    'hero.feature1': 'Tempo reale',
    'hero.feature2': 'Gratuito',

    // Guide
    'guide.title': 'Come Usare Hateless',
    'guide.subtitle': 'Scopri come integrare e utilizzare la nostra API per rilevare il discorso d\'odio',
    'guide.step1Title': 'Comprendi l\'API',
    'guide.step1': 'La nostra API analizza il testo per rilevare i discorsi d\'odio, gli insulti e i contenuti tossici in tempo reale.',
    'guide.step2Title': 'Testalo Live',
    'guide.step2': 'Usa il nostro tester API per vedere come funziona. Invia testo e ottieni analisi istantanea.',
    'guide.step3Title': 'Integra nella Tua App',
    'guide.step3': 'Copia semplicemente il codice fornito e integra l\'API nella tua applicazione. Una sola richiesta è sufficiente!',
    'guide.step4Title': 'Modera i Contenuti',
    'guide.step4': 'Utilizza i risultati per moderare i contenuti, proteggere i tuoi utenti e costruire una comunità accogliente.',

    // API Tester
    'apiTester.title': 'Testa l\'API in Diretta',
    'apiTester.subtitle': 'Inserisci un testo e il nostro modello AI analizzerà se contiene discorsi d\'odio.',
    'apiTester.greeting': 'Ora puoi testare la nostra API',
    'apiTester.askAgent': '',
    'apiTester.placeholder': 'Inserisci il tuo testo qui...',
    'apiTester.url': 'URL API',
    'apiTester.endpoint': 'Endpoint',
    'apiTester.method': 'Metodo HTTP',
    'apiTester.body': 'Corpo della richiesta (JSON)',
    'apiTester.textToAnalyze': 'Testo da Analizzare',
    'apiTester.send': 'Analizza il testo',
    'apiTester.analyzing': 'Analisi in corso...',
    'apiTester.response': 'Risultato dell\'Analisi',
    'apiTester.copy': 'Copia il risultato',
    'apiTester.errorURL': '❌ Errore: Compila URL e endpoint',
    'apiTester.waiting': 'In attesa di risposta...',
    'apiTester.sending': '⏳ Invio della richiesta...',
    'apiTester.errorJSON': '❌ Errore JSON: ',
    'apiTester.copied': 'Risposta copiata!',
    'apiTester.errorCopy': 'Impossibile copiare la risposta',
    'apiTester.errorRequest': '❌ Errore della richiesta:\n',
    'apiTester.errorCheck': '\n\nVerifica che:\n- L\'API sia accessibile all\'URL indicato\n- CORS sia configurato correttamente\n- La richiesta sia valida',
    
    'apiInt.title': 'Integra la Nostra API nella Tua Applicazione',
    'apiInt.subtitle': 'Utilizza il nostro rilevamento di discorsi d\'odio in poche righe di codice JavaScript',
    'apiInt.codeLabel': 'Esempio di Codice - JavaScript',
    'apiInt.copy': 'Copia il Codice',
    'apiInt.responseTitle': 'Formato della Risposta',
    'apiInt.responseNote': 'La confidenza varia da 0,0 a 1,0. Imposta una soglia secondo le tue esigenze.',

    // Articles
    'articles.title': 'Articoli e Risorse',
    'articles.subtitle': 'Guide pratiche e articoli per promuovere il benessere e combattere il discorso d\'odio',
    'articles.search': 'Cerca un articolo...',
    'articles.allArticles': 'Tutti gli articoli',
    'articles.mentalHealth': 'Salute Mentale',
    'articles.hatespeech': 'Discorso d\'Odio',
    'articles.communication': 'Comunicazione',
    'articles.wellness': 'Benessere',
    'articles.noResults': 'Nessun articolo corrisponde alla tua ricerca.',
    'articles.readMore': 'Leggi articolo →',

    // Articles Content
    'articlesContent.article1.title': 'Comprendere il Discorso d\'Odio e i Suoi Impatti sulla Salute Mentale',
    'articlesContent.article1.excerpt': 'Come il discorso d\'odio influisce sul nostro benessere mentale e come affrontarlo.',
    'articlesContent.article1.fullContent': `# Comprendere il Discorso d\'Odio e i Suoi Impatti sulla Salute Mentale

## Definizione
Il discorso d\'odio si riferisce a espressioni aggressive rivolte a una persona o un gruppo in base alla loro razza, religione, genere, orientamento sessuale, disabilità o altre caratteristiche personali.

## Impatti Psicologici
Le ricerche dimostrano che l\'esposizione al discorso d\'odio può causare:
- **Depressione e Ansia**: Sentimenti costanti di tristezza e paura
- **Bassa Autostima**: Mettere in discussione il proprio valore
- **Stress Post-Traumatico**: Ricordi negativi persistenti
- **Isolamento Sociale**: Ritiro per paura di essere di nuovo presi di mira

## Come Affrontarlo
1. **Riconoscere e Validare le Proprie Emozioni**: I tuoi sentimenti sono validi
2. **Limitare l\'Esposizione**: Ridurre il tempo su piattaforme tossiche
3. **Cercare Supporto**: Parlare con amici, famiglia o professionisti
4. **Segnalare i Contenuti**: Utilizzare gli strumenti di segnalazione per messaggi d\'odio
5. **Praticare l\'Autocura**: Impegnarsi in attività che ripristinano il benessere

## Risorse Professionali
Se hai bisogno di supporto, la nostra applicazione Theramind offre terapia guidata e supporto emotivo 24/7.`,
    'articlesContent.article1.author': 'Dr. Sophie Martin',

    'articlesContent.article2.title': 'Gestire l\'Ansia Legata ai Social Media',
    'articlesContent.article2.excerpt': 'Strategie pratiche per ridurre lo stress causato dalle piattaforme digitali.',
    'articlesContent.article2.fullContent': `# Gestire l\'Ansia Legata ai Social Media

## Comprendere l\'Ansia da Social Media
I social media possono scatenare ansia attraverso:
- **Confronto Sociale**: Confrontare la propria vita con i post curati degli altri
- **FOMO** (Fear of Missing Out): Sentirsi esclusi
- **Connettività Costante**: Pressione di essere sempre disponibili
- **Commenti Negativi**: Esposizione a critiche e discorsi d\'odio

## Segnali di Avvertimento
- Controllo eccessivo delle notifiche
- Disturbi del sonno
- Cambiamenti d\'umore dopo l\'uso dei social media
- Sentimenti di inadeguatezza

## Strategie di Gestione
### 1. Stabilire Confini Salutari
- Limitare il tempo di utilizzo giornaliero (massimo 1-2 ore)
- Disattivare le notifiche non essenziali
- Creare zone "tech-free" (camera da letto, tavolo da pranzo)

### 2. Curare il Proprio Feed
- Smettere di seguire account che ti fanno sentire male
- Seguire contenuti positivi e ispiranti
- Utilizzare le funzionalità di privacy per proteggersi

### 3. Praticare la Mindfulness
- Essere presenti quando si utilizzano i social media
- Chiedersi: "Questo mi serve?"
- Fare pause regolari

### 4. Costruire Connessioni Reali
- Dare priorità alle relazioni di persona
- Impegnarsi in conversazioni significative
- Condividere in modo autentico, non solo momenti "perfetti"

## Quando Cercare Aiuto
Se l\'ansia persiste nonostante queste strategie, consultare un professionista della salute mentale tramite piattaforme come Theramind.`,
    'articlesContent.article2.author': 'Dr. Marie Dubois',

    'articlesContent.article3.title': 'Dialogo Costruttivo: Combattere il Cyberbullismo',
    'articlesContent.article3.excerpt': 'Come impegnarsi in conversazioni positive e prevenire le molestie online.',
    'articlesContent.article3.fullContent': `# Dialogo Costruttivo: Combattere il Cyberbullismo

## Cos\'è il Cyberbullismo?
Il cyberbullismo è molestia intenzionale e ripetuta attraverso piattaforme digitali. Si differenzia dal conflitto occasionale per:
- Natura ripetitiva
- Squilibrio di potere
- Intento di danneggiare
- Potenziale di umiliazione pubblica

## Riconoscere il Cyberbullismo
### Per le Vittime:
- Ricevere messaggi minacciosi o offensivi
- Esclusione da gruppi online
- Diffusione di false voci
- Condivisione di informazioni private senza consenso

### Per i Testimoni:
- Qualcuno viene ripetutamente preso di mira
- Disagio visibile nelle risposte
- Accumulo di attacchi da più utenti

## Come Rispondere da Vittima
1. **Non Reagire**: Non rispondere alle provocazioni
2. **Documentare Tutto**: Salvare screenshot con date
3. **Bloccare e Segnalare**: Utilizzare gli strumenti di sicurezza della piattaforma
4. **Cercare Supporto**: Parlare con adulti o amici di fiducia
5. **Proteggere la Propria Privacy**: Rivedere le impostazioni di sicurezza

## Come Essere un Alleato
- Non condividere contenuti molesti
- Supportare pubblicamente la vittima (se sicuro)
- Segnalare comportamenti abusivi
- Inviare messaggi privati di supporto

## Promuovere il Dialogo Costruttivo
### Ascolto Attivo
- Leggere attentamente prima di rispondere
- Riconoscere la prospettiva dell\'altra persona
- Porre domande chiarificatrici

### Espressione Rispettosa
- Usare affermazioni in prima persona ("Io sento..." vs "Tu sempre...")
- Basarsi sui fatti, non personalizzare
- Riconoscere punti in comune

### De-escalation
- Fare una pausa se le emozioni sono alte
- Suggerire di passare ai messaggi privati
- Sapere quando disimpegnarsi

## Approccio Educativo
Insegnare empatia e cittadinanza digitale a scuola e a casa può prevenire il cyberbullismo prima che inizi.`,
    'articlesContent.article3.author': 'Prof. Jean Rousseau',

    'articlesContent.article4.title': 'Pratiche di Benessere Digitale per un Equilibrio Sano',
    'articlesContent.article4.excerpt': 'Creare una relazione equilibrata con la tecnologia per una migliore salute mentale.',
    'articlesContent.article4.fullContent': `# Pratiche di Benessere Digitale per un Equilibrio Sano

## Cos\'è il Benessere Digitale?
Il benessere digitale significa utilizzare la tecnologia in modi che supportano, anziché danneggiare, la salute mentale e fisica.

## La Sfida del Benessere Digitale
La vita moderna crea:
- **Sovraccarico di Informazioni**: Flusso costante di notizie e aggiornamenti
- **Cultura Always-On**: Aspettativa di risposte immediate
- **Affaticamento da Schermo**: Tensione fisica da uso eccessivo di schermi
- **Diminuzione della Concentrazione**: Interruzioni costanti che frammentano l\'attenzione

## Principi Fondamentali del Benessere Digitale

### 1. Utilizzo Intenzionale
Chiediti prima di aprire un\'app:
- Qual è il mio scopo?
- Questo servirà i miei obiettivi?
- È questo il miglior uso del mio tempo?

### 2. Il Digital Detox
Pause regolari dalla tecnologia:
- **Giornaliero**: Un\'ora prima di dormire senza schermi
- **Settimanale**: Un giorno intero offline
- **Mensile**: Un weekend di ritiro digitale

### 3. Salute Fisica
Proteggere il proprio corpo:
- **Regola 20-20-20**: Ogni 20 minuti, guardare a 20 piedi di distanza per 20 secondi
- **Configurazione Ergonomica**: Sedia, scrivania, altezza schermo appropriati
- **Pause di Movimento**: Alzarsi e allungarsi ogni ora

### 4. Igiene del Sonno
- Nessuno schermo 1 ora prima di dormire
- Utilizzare filtri luce blu dopo il tramonto
- Caricare i dispositivi fuori dalla camera da letto

### 5. Consumo Consapevole
- Iscriversi a qualità piuttosto che quantità
- Verificare le informazioni prima di condividere
- Limitare il consumo di notizie a orari specifici

### 6. Impegnarsi in Attività Significative
- Hobby creativi
- Volontariato
- Passeggiate nella natura
- Socializzazione faccia a faccia

## Risorse Professionali
Se hai bisogno di supporto, la nostra applicazione Theramind offre terapia guidata e supporto emotivo 24/7.`,
    'articlesContent.article4.author': 'Prof. Laurent Lefevre',

    // Support
    'support.title': 'Aiuto & Supporto Psicologico',
    'support.subtitle': 'Risorse e supporto per chi è stato colpito dal discorso d\'odio',
    'support.needHelp': 'Hai Bisogno di Aiuto?',
    'support.needHelpText': 'Accedi alla nostra applicazione Theramind, un\'AI companion dedicata al tuo benessere psicologico ed emotivo. Terapia guidata, risorse educative e supporto continuo 24/7.',
    'support.accessTheramind': 'Accedi a Theramind',
    'support.emergency': 'Numeri di Emergenza',
    'support.emergencyText': 'Se sei in immediato disagio, contatta una linea di aiuto professionale.',
    'support.community': 'Comunità di Supporto',
    'support.communityText': 'Unisciti a un forum sicuro per scambiare con altri utenti, condividere le tue esperienze e ricevere supporto tra pari in un ambiente accogliente e senza giudizi.',
    'support.joinCommunity': 'Unisciti alla Comunità',
    'support.faqs': 'Domande Frequenti',
    'support.faq1Title': 'Cosa devo fare se sono vittima di discorso d\'odio?',
    'support.faq2Title': 'Come posso segnalare un discorso d\'odio?',
    'support.faq3Title': 'Come posso proteggere la mia salute mentale online?',
    'support.faq4Title': 'Esistono leggi contro il discorso d\'odio?',

    // Footer
    'footer.privacy': 'Privacy',
    'footer.terms': 'Condizioni d\'Uso',
    'footer.contact': 'Contatti',
  }
}
