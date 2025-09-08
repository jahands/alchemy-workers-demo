import alchemy from 'alchemy'
import { CloudflareStateStore } from 'alchemy/state'

const app = await alchemy('public-api', {
	stateStore: (scope) => new CloudflareStateStore(scope),
})

// Your resources here...

await app.finalize()
