import path from 'node:path'
import { Resource } from 'alchemy'
import { Worker, WranglerJson } from 'alchemy/cloudflare'

import type { Context } from 'alchemy'
import type { R2Bucket } from 'alchemy/cloudflare'

const srcDir = path.join(__dirname, 'src')

export interface AcmeApiProps {
	r2Bucket: R2Bucket
}

export interface AcmeApi extends Resource<'custom::acme-api'>, AcmeApiProps {
	worker: Worker
}

export const AcmeApi = Resource(
	'custom::acme-api',
	{ alwaysUpdate: true },
	async function (this: Context<AcmeApi>, _id, props: AcmeApiProps): Promise<AcmeApi> {
		const acmeApiWorker = await Worker('worker', {
			entrypoint: path.join(srcDir, 'acme-api.app.ts'),
			compatibilityDate: '2025-09-08',
			compatibilityFlags: ['nodejs_compat'],
			bindings: {
				R2: props.r2Bucket,
			},
		})

		console.log(`acme-api deployed at: ${acmeApiWorker.url}`)

		await WranglerJson({
			worker: acmeApiWorker,
			path: path.join(srcDir, 'wrangler.jsonc'),
		})

		return this({
			worker: acmeApiWorker,
			r2Bucket: props.r2Bucket,
		} as any)
	}
)
