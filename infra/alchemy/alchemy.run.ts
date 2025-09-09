import alchemy from 'alchemy'
import { R2Bucket } from 'alchemy/cloudflare'
import { CloudflareStateStore } from 'alchemy/state'

import { AcmeApi } from '@repo/acme-api/alchemy.resources'
import { AcmeStage } from '@repo/acme-common'
import { AcmeFrontend } from '@repo/acme-frontend/alchemy.resources'

const app = await alchemy('acme', {
	stateStore: (scope) => new CloudflareStateStore(scope),
})

AcmeStage.parse(app.stage) // validate stage

const r2Bucket = await R2Bucket('bucket')

const acmeApi = await AcmeApi('api', {
	r2Bucket, // dependency injection
})

await AcmeFrontend('frontend', {
	acmeApi,
})

await app.finalize()
