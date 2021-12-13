import React from 'react'
import ReactDOM from 'react-dom'
import { AuthProvider } from 'react-oidc-context';
import App from './App'

const oidcAuthority = 'http://localhost:9000';
const oidcClientId = 'zero-interaction-client-id';
const oidcRedirectUri = 'http://localhost:3000';

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider authority={oidcAuthority}
                      client_id={oidcClientId}
                      redirect_uri={oidcRedirectUri}>
            <App/>
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
)
