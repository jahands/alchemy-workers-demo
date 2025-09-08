import alchemy from 'alchemy'
import { R2Bucket } from 'alchemy/cloudflare'
import { CloudflareStateStore } from 'alchemy/state'

import { PublicApi } from '@repo/public-api/resources'

const app = await alchemy('acme', {
	stateStore: (scope) => new CloudflareStateStore(scope),
})

const r2Bucket = await R2Bucket('acme-bucket')

await PublicApi('public-api', {
	r2Bucket,
})

await app.finalize()
