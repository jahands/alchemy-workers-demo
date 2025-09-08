import path from 'node:path'
import { Resource } from 'alchemy'
import { Worker } from 'alchemy/cloudflare'

import type { Context } from 'alchemy'
import type { R2Bucket } from 'alchemy/cloudflare'

const srcDir = path.join(__dirname, 'src')

export interface PublicApiProps {
	r2Bucket: R2Bucket
}

export interface PublicApi extends Resource<'custom::public-api'>, PublicApiProps {
	worker: Worker
}

export const PublicApi = Resource(
	'custom::public-api',
	{ alwaysUpdate: true },
	async function (this: Context<PublicApi>, _id, props: PublicApiProps): Promise<PublicApi> {
		const publicApiWorker = await Worker('worker', {
			entrypoint: path.join(srcDir, 'public-api.app.ts'),
			compatibilityDate: '2025-09-08',
			compatibilityFlags: ['nodejs_compat'],
			bindings: {
				R2: props.r2Bucket,
			},
		})

		console.log(`public-api deployed at: ${publicApiWorker.url}`)

		return this({
			worker: publicApiWorker,
			r2Bucket: props.r2Bucket,
		})
	}
)
