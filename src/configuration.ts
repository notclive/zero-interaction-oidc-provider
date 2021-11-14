export interface Configuration {
    port: number;
    clientId: string;
    clientSecret?: string;
    redirectUri: string;
}

export function determineConfiguration() {
    return {
        port: determinePort() || 9000,
        clientId: process.env.CLIENT_ID || 'zero-interaction-client-id',
        clientSecret: process.env.CLIENT_SECRET,
        redirectUri: process.env.REDIRECT_URI || 'http://localhost:3000'
    };
}

function determinePort() {
    if (process.env.PORT === undefined) {
        return undefined;
    }
    if (Number.isInteger(process.env.PORT)) {
        return Number(process.env.PORT);
    }
    throw new ConfigurationError('Environment variable PORT must be numeric.')
}

export function logConfiguration(configuration: Configuration) {
    // Port is logged elsewhere.
    console.log('Starting zero-interaction-oidc-provider with the following client configuration:');
    console.log(` * client ID: ${configuration.clientId}`);
    console.log(` * client secret: ${describeClientSecret(configuration.clientSecret)}`);
    console.log(` * redirect URI: ${configuration.redirectUri}`);
}

function describeClientSecret(secret?: string) {
    if (secret === undefined) {
        return `none, authentication won't be required when fetching tokens`;
    }
    return `'${secret}', HTTP basic or POST authentication will be required when fetching tokens`;
}

export class ConfigurationError implements Error {

    private readonly _message: string;

    constructor(message: string) {
        this._message = message;
    }

    public get message() {
        return this._message;
    }

    public get name() {
        return 'Configuration error';
    }
}