import path from 'node:path'
import { Resource } from 'alchemy'
import { R2Bucket, Worker } from 'alchemy/cloudflare'

import type { Context } from 'alchemy'

const srcDir = path.join(__dirname, 'src')

export interface PublicApiProps {}
export interface PublicApi extends Resource<'custom::public-api'>, PublicApiProps {}
export const PublicApi = Resource(
	'custom::public-api',
	async function (this: Context<PublicApi>, _id, _props) {
		const r2Bucket = await R2Bucket('public-api-bucket')

		const publicApiWorker = await Worker('public-api', {
			entrypoint: path.join(srcDir, 'public-api.app.ts'),
			compatibilityDate: '2025-09-08',
			compatibilityFlags: ['nodejs_compat'],
			bindings: {
				R2: r2Bucket,
			},
		})

		console.log(`public-api deployed at: ${publicApiWorker.url}`)

		return publicApiWorker
	}
)
