# alchemy-workers-demo

Demo showing how to use Alchemy with multiple Workers that RPC to each other

## Usage

```sh
# install dependencies
pnpm install

# switch to alchemy package used to deploy all our apps (workers)
cd infra/alchemy

# local dev
bun alchemy dev

# deploy
bun alchemy deploy --stage=prod
```
