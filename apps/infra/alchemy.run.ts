import alchemy from 'alchemy'
import { R2Bucket } from 'alchemy/cloudflare'
import { CloudflareStateStore } from 'alchemy/state'

import { PublicApi } from '@repo/acme-api/alchemy.resources'
import { Frontend } from '@repo/frontend/alchemy.resources'

const app = await alchemy('acme', {
	stateStore: (scope) => new CloudflareStateStore(scope),
})

const r2Bucket = await R2Bucket('acme-bucket')

const publicApi = await PublicApi('acme-api', {
	r2Bucket,
})

await Frontend('frontend', {
	publicApi,
})

await app.finalize()
