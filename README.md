# zero-interaction-oidc-provider

This project provides an OIDC provider for use in development and testing.
The server will never require user interaction, making it perfect for UI testing.

## Usage

The server is available as a docker image.

```sh
docker run --rm \
    -p 9000:9000 \
    -e "REDIRECT_URI=http://localhost:4200/login/callback" \
    notclive/zero-interaction-oidc-provider
```

You should then provide the following configuration to your OIDC client:
* authority: http://localhost:9000
* client ID: zero-interaction-client-id

### Environment Variables

The simplest configuration can be accomplished using environment variables

| Variable | Description | Default |
| -------- | ----------- | ------- |
| REDIRECT_URI | The URI to be called after authentication, e.g. `http://localhost:4200/login/callback`. | `http://localhost:3000` |
| CLIENT_ID | The ID of your OIDC client. | `zero-interaction-client-id` |
| CLIENT_SECRET | The secret of your OIDC client, HTTP basic or POST authentication must be used when fetching tokens if and only if a secret is provided. | no secret |

### Behaviour

The server will always authenticate the user with a simple token containing a subject of fixed-user-id, and the openid scope.