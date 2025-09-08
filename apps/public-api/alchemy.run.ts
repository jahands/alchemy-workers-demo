import alchemy from 'alchemy'
import { R2Bucket, Worker } from 'alchemy/cloudflare'
import { CloudflareStateStore } from 'alchemy/state'

const app = await alchemy('acme', {
	stateStore: (scope) => new CloudflareStateStore(scope),
})

const r2Bucket = await R2Bucket('public-api-bucket')

const publicApiWorker = await Worker('public-api', {
	entrypoint: './src/public-api.app.ts',
	compatibilityDate: '2025-09-08',
	compatibilityFlags: ['nodejs_compat'],
	bindings: {
		R2: r2Bucket,
	},
})

console.log(`public-api deployed at: ${publicApiWorker.url}`)

await app.finalize()
