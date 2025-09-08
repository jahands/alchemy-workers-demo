# alchemy-workers-demo

Demo showing how to use Alchemy with multiple Workers that RPC to each other

## Usage

### Prerequisites

Before running the commands below, add a .env file in the root with these set:

```
CLOUDFLARE_ACCOUNT_ID=xyz
ALCHEMY_STATE_TOKEN=xyz
```

The alchemy state token should be a secret - you can generate a new secret via:

```sh
openssl rand -base64 32
```

### Commands

```sh
# install dependencies
pnpm install

# switch to alchemy package used to deploy all our apps (workers)
cd infra/alchemy

# authenticate alchemy to Cloudflare
bun alchemy login

# local dev
bun alchemy dev

# deploy
bun alchemy deploy --stage=prod
```

## How it works

Each app declares it's resources in an alchemy.resources.ts file using custom Alchemy resources. Currently we have:

- [apps/acme-frontend/alchemy.resources.ts](./apps/acme-frontend/alchemy.resources.ts)
- [apps/acme-api/alchemy.resources.ts](./apps/acme-api/alchemy.resources.ts)

We connect everything together in the [infra/alchemy](./infra/alchemy) package via [infra/alchemy/alchemy.run.ts](./infra/alchemy/alchemy.run.ts)

Shared resources such as R2 buckets are passed in dependency-injection style when we create the custom resource:

```ts
const r2Bucket = await R2Bucket('bucket')
const acmeApi = await AcmeApi('api', {
  r2Bucket, // dependency injection
})
```

### State

We're currently storing state remotely using the [Cloudflare State Store](https://alchemy.run/guides/cloudflare-state-store/) which creates a Worker within your account and stores state within a Durable Object.
