import alchemy from 'alchemy'
import { CloudflareStateStore } from 'alchemy/state'

import { PublicApi } from '@repo/public-api/resources'

const app = await alchemy('acme', {
	stateStore: (scope) => new CloudflareStateStore(scope),
})

await PublicApi('public-api', {})

await app.finalize()
