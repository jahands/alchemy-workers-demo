import path from 'node:path'
import { Resource } from 'alchemy'
import { Worker } from 'alchemy/cloudflare'

import type { Context } from 'alchemy'
import type { PublicApi } from '@repo/acme-api/alchemy.resources'

const srcDir = path.join(__dirname, 'src')

export interface acme-frontendProps {
	publicApi: PublicApi
}
export interface acme-frontend extends Resource<'custom::acme-frontend'>, acme-frontendProps {
	worker: Worker
}

export const acme-frontend = Resource(
	'custom::acme-frontend',
	{ alwaysUpdate: true },
	async function (this: Context<acme-frontend>, _id, props: acme-frontendProps): Promise<acme-frontend> {
		const acme-frontendWorker = await Worker('worker', {
			entrypoint: path.join(srcDir, 'acme-frontend.app.ts'),
			compatibilityDate: '2025-09-08',
			compatibilityFlags: ['nodejs_compat'],
			bindings: {
				PUBLIC_API: props.publicApi.worker,
			},
		})

		console.log(`acme-frontend deployed at: ${acme-frontendWorker.url}`)

		return this({
			worker: acme-frontendWorker,
			publicApi: props.publicApi,
		})
	}
)
