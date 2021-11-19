import * as http from 'http';
import {Provider} from 'oidc-provider';

const accountId = 'fixed-account-id';

export async function insertAuthorisedSession(
    oidc: Provider,
    clientId: string,
    request: http.IncomingMessage
) {
    const grantId = await generateGrant(oidc, clientId);
    const sessionId = await generateSession(oidc, clientId, grantId);
    insertSyntheticSessionCookie(oidc, request, sessionId);
}

async function generateGrant(oidc: Provider, clientId: string) {
    const grant = new oidc.Grant({clientId, accountId});
    grant.addOIDCScope('openid');
    return grant.save();
}

async function generateSession(oidc: Provider, clientId: string, grantId: string) {
    const session = new oidc.Session();
    session.accountId = accountId;
    session.grantIdFor(clientId, grantId);
    return session.save(60);
}

function insertSyntheticSessionCookie(oidc: Provider, request: http.IncomingMessage, sessionId: string) {
    const cookieName = (oidc as any).cookieName('session');
    request.headers.cookie = `${cookieName}=${sessionId}`;
}