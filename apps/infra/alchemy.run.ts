import alchemy from 'alchemy'
import { R2Bucket } from 'alchemy/cloudflare'
import { CloudflareStateStore } from 'alchemy/state'

import { Frontend } from '@repo/frontend/alchemy.resources'
import { PublicApi } from '@repo/public-api/alchemy.resources'

const app = await alchemy('acme', {
	stateStore: (scope) => new CloudflareStateStore(scope),
})

const r2Bucket = await R2Bucket('acme-bucket')

const publicApi = await PublicApi('public-api', {
	r2Bucket,
})

await Frontend('frontend', {
	publicApi,
})

await app.finalize()
