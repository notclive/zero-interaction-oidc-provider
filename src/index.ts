import {ExtendableContext} from 'koa';
import {Provider} from 'oidc-provider';

const port = process.env.PORT || 9000;
const clientId = process.env.CLIENT_ID || 'zero-interaction-client-id';
const clientSecret = process.env.CLIENT_SECRET || 'zero-interaction-client-secret';
const redirectUri = process.env.REDIRECT_URI || 'http://localhost:3000';

console.log('Starting zero-interaction-oidc-provider with the following client configuration:');
console.log(` * client ID: ${clientId}`);
console.log(` * client secret: ${clientSecret}`);
console.log(` * redirect URI: ${redirectUri}`);

const oidc = new Provider(`http://localhost:${port}`, {
    clients: [{
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uris: [redirectUri]
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

oidc.use(handleInteractions);

const server = oidc.listen(port, () => {
    console.log(`zero-interaction-oidc-provider listening at http://localhost:${port}`)
});

process.on('SIGINT', () => {
    console.log('Shutting down...');
    server.close();
});

async function handleInteractions(context, next) {
    // oidc-provider redirects the user to /interaction/:id to login or provide consent.
    if (context.path.startsWith('/interaction/')) {
        return immediatelyAuthoriseUser(context);
    }
    return next();
}

async function immediatelyAuthoriseUser({req, res}: ExtendableContext) {
    const {params: {client_id},} = await oidc.interactionDetails(req, res);
    const accountId = 'fixed-user-id';

    const grant = new oidc.Grant({clientId: client_id as string, accountId});
    grant.addOIDCScope('openid');
    const grantId = await grant.save();

    return oidc.interactionFinished(req, res, {
        login: {accountId},
        consent: {grantId}
    });
}