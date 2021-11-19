import {Provider} from 'oidc-provider';
import {Configuration, ConfigurationError, determineConfiguration, logConfiguration} from './configuration';
import {insertAuthorisedSession} from './insert-authorised-session';

try {
    const configuration = determineConfiguration();
    logConfiguration(configuration);
    const oidc = buildProvider(configuration);
    startServer(oidc, configuration.port);
} catch (error) {
    if (error instanceof ConfigurationError) {
        console.error(error.message);
        process.exitCode = 1;
    } else {
        throw error;
    }
}

function buildProvider(configuration: Configuration) {
    const oidc = new Provider(`http://localhost:${configuration.port}`, {
        clients: [{
            client_id: configuration.clientId,
            client_secret: configuration.clientSecret,
            redirect_uris: [configuration.redirectUri],
            // Expects basic or post authentication only if a client secret has been provided.
            token_endpoint_auth_method: configuration.clientSecret ? undefined : 'none'
        }],
        features: {
            // By default oidc-provider implements dummy login pages for development only.
            // We don't want to use these as they require interaction from the user.
            devInteractions: {
                enabled: false
            }
        },
        // Allow requests from any origin, this eliminates configuration at the cost of security.
        // Security isn't required here, this server is only for development and testing.
        clientBasedCORS: () => true
    });

    oidc.use(async function (context, next) {
        await insertAuthorisedSession(oidc, configuration.clientId, context.req);
        return next();
    });

    return oidc;
}

function startServer(oidc: Provider, port: number) {
    const server = oidc.listen(port, () => {
        console.log(`zero-interaction-oidc-provider listening at http://localhost:${port}`)
    });

    process.on('SIGINT', () => {
        console.log('Shutting down...');
        server.close();
    });
}