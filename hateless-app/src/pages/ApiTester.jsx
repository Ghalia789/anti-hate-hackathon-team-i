import { useState } from 'react'
import './ApiTester.css'

function ApiTester() {
  const [apiUrl, setApiUrl] = useState('http://localhost:5000/api')
  const [endpoint, setEndpoint] = useState('/analyze')
  const [method, setMethod] = useState('POST')
  const [requestBody, setRequestBody] = useState('{\n  "text": "Analysez ce texte pour le hatespeech"\n}')
  const [response, setResponse] = useState('En attente de réponse...')
  const [isLoading, setIsLoading] = useState(false)

  const sendRequest = async () => {
    if (!apiUrl || !endpoint) {
      setResponse('❌ Erreur: Veuillez remplir l\'URL et le point de terminaison')
      return
    }

    setIsLoading(true)
    setResponse('⏳ Envoi de la requête...')

    try {
      const fullUrl = new URL(endpoint, apiUrl).toString()
      
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      }

      if (method !== 'GET' && requestBody) {
        try {
          JSON.parse(requestBody)
          options.body = requestBody
        } catch (e) {
          setResponse('❌ Erreur JSON: ' + e.message)
          setIsLoading(false)
          return
        }
      }

      const res = await fetch(fullUrl, options)
      const data = await res.json()

      const formattedResponse = {
        status: res.status,
        statusText: res.statusText,
        headers: {
          'content-type': res.headers.get('content-type'),
          'content-length': res.headers.get('content-length')
        },
        body: data
      }

      setResponse(JSON.stringify(formattedResponse, null, 2))
    } catch (error) {
      setResponse(
        '❌ Erreur de requête:\n' + error.message +
        '\n\nVérifiez que:\n' +
        '- L\'API est accessible à l\'URL indiquée\n' +
        '- Le CORS est configuré correctement\n' +
        '- La requête est valide'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const copyResponse = () => {
    navigator.clipboard.writeText(response).then(() => {
      alert('Réponse copiée!')
    }).catch(err => {
      console.error('Erreur lors de la copie:', err)
      alert('Impossible de copier la réponse')
    })
  }

  return (
    <section className="api-tester">
      <div className="api-container">
        <h1>Testeur d'API</h1>
        <p className="subtitle">Testez l'API en cours de préparation ou accédez à l'API déployée</p>

        <div className="api-content">
          {/* Configuration */}
          <div className="api-config">
            <h2>Configuration</h2>
            <div className="form-group">
              <label htmlFor="api-url">URL de l'API :</label>
              <input
                type="text"
                id="api-url"
                placeholder="http://localhost:5000/api"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="api-endpoint">Point de terminaison :</label>
              <input
                type="text"
                id="api-endpoint"
                placeholder="/analyze"
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="request-method">Méthode HTTP :</label>
              <select
                id="request-method"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          {/* Request Body */}
          <div className="api-request">
            <h2>Requête</h2>
            <div className="form-group">
              <label htmlFor="request-body">Corps de la requête (JSON) :</label>
              <textarea
                id="request-body"
                rows="10"
                placeholder='{"text": "Votre texte ici"}'
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={sendRequest}
              disabled={isLoading}
            >
              {isLoading ? 'Envoi...' : 'Envoyer la requête'}
            </button>
          </div>

          {/* Response */}
          <div className="api-response">
            <h2>Réponse</h2>
            <div className="response-container">
              <pre>{response}</pre>
            </div>
            <button className="btn btn-secondary" onClick={copyResponse}>
              Copier la réponse
            </button>
          </div>
        </div>

        <div className="api-info">
          <h3>ℹ️ Information</h3>
          <p><strong>État :</strong> <span className="status-preparing">🔶 En cours de préparation</span></p>
          <p>L'API est actuellement en cours de développement sur un autre serveur. Vous pouvez commencer à tester avec cette interface.</p>
          <p><strong>Exemple d'utilisation :</strong> Envoyez un texte pour analyser la présence éventuelle de hatespeech ou de contenu offensant.</p>
        </div>
      </div>
    </section>
  )
}

export default ApiTester
