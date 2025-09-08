import path from 'node:path'
import { Resource } from 'alchemy'
import { Worker } from 'alchemy/cloudflare'

import type { Context } from 'alchemy'
import type { PublicApi } from '@repo/public-api/alchemy.resources'

const srcDir = path.join(__dirname, 'src')

export interface FrontendProps {
	publicApi: PublicApi
}
export interface Frontend extends Resource<'custom::frontend'>, FrontendProps {
	worker: Worker
}

export const Frontend = Resource(
	'custom::frontend',
	async function (this: Context<Frontend>, _id, props: FrontendProps): Promise<Frontend> {
		const frontendWorker = await Worker('worker', {
			entrypoint: path.join(srcDir, 'frontend.app.ts'),
			compatibilityDate: '2025-09-08',
			compatibilityFlags: ['nodejs_compat'],
			bindings: {
				PUBLIC_API: props.publicApi.worker,
			},
		})

		console.log(`frontend deployed at: ${frontendWorker.url}`)

		return this({
			worker: frontendWorker,
			publicApi: props.publicApi,
		})
	}
)
