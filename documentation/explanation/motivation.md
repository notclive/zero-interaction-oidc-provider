# Motivation

It's common for websites to delegate authentication to another service, using a single sign-on scheme.
One popular single sign-on scheme is OIDC, or OpenID Connect.

When writing automated tests that run in a browser, single sign-on can introduce problems.
We rarely want automated tests to rely on a real service outside the project being tested, this will lead to slower, flakier, tests.
Additionally, a single sign-on service is probably going to be served from a different origin to the project being tested, introducing problems caused by the browser's cross-origin rules.

Cypress is an excellent and popular browser testing tool that demonstrates the problems with testing this setup.
Cypress doesn't support interacting with websites from multiple origins, so when the user is redirected to the single sign-on login page Cypress can't input test credentials.
Also, Cypress runs its tests inside an iframe which makes cross-origin rules more strict, preventing cookies from being saved unless they set [SameSite to 'None'](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite).

The [generally accepted](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/logging-in__single-sign-on) [method](https://auth0.com/blog/end-to-end-testing-with-cypress-and-auth0/) for combining browser testing and single sign-on is to:
1. Make a login request directly to your single sign-on service (in your test code, not using the browser).
2. Extract the token that's returned.
3. Inject that token into the application under test, either by setting session cookies, saving the token in local storage, or calling a callback endpoint.

There are a few problems with this:
1. The test is implementing typical authentication steps itself, this means it needs knowledge of the website's implementation, imagine the name of the session cookie changed this would lead to tests failing.
2. Because the test is implementing some authentication steps itself, our website's authentication code doesn't get tested.
3. The test still depends on a real external service in our tests, this can be slow and flaky.

zero-interaction-oidc-provider offers a different solution.
In your test environment you replace your real OIDC provider with a test specific provider running in a Docker container.
Because you're using a standard, OIDC, you should be able to replace provider without client side changes (apart from typical configuration like client id).
zero-interaction-oidc-provider will never ask for a login, it always returns an authenticated user, and it doesn't rely on cookies (susceptible to cross-origin problems) to achieve this.
