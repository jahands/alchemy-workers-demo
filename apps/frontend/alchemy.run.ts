import alchemy from 'alchemy'
import { Worker } from 'alchemy/cloudflare'
import { CloudflareStateStore } from 'alchemy/state'

const app = await alchemy('acme', {
	stateStore: (scope) => new CloudflareStateStore(scope),
})

const frontendWorker = await Worker('frontend', {
	entrypoint: './src/frontend.app.ts',
	compatibilityDate: '2025-09-08',
	compatibilityFlags: ['nodejs_compat'],
})

console.log(`frontend deployed at: ${frontendWorker.url}`)

await app.finalize()
