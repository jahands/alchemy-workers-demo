import path from 'node:path'
import { Resource } from 'alchemy'
import { Worker, WranglerJson } from 'alchemy/cloudflare'

import type { Context } from 'alchemy'
import type { AcmeApi } from '@repo/acme-api/alchemy.resources'

const srcDir = path.join(__dirname, 'src')

export interface AcmeFrontendProps {
	acmeApi: AcmeApi
}
export interface AcmeFrontend extends Resource<'custom::acme-frontend'>, AcmeFrontendProps {
	worker: Worker
}

export const AcmeFrontend = Resource(
	'custom::acme-frontend',
	{ alwaysUpdate: true },
	async function (
		this: Context<AcmeFrontend>,
		_id,
		props: AcmeFrontendProps
	): Promise<AcmeFrontend> {
		const acmeFrontendWorker = await Worker('worker', {
			entrypoint: path.join(srcDir, 'acme-frontend.app.ts'),
			compatibilityDate: '2025-09-08',
			compatibilityFlags: ['nodejs_compat'],
			bindings: {
				ACME_API: props.acmeApi.worker,
			},
		})

		console.log(`acme-frontend deployed at: ${acmeFrontendWorker.url}`)

		await WranglerJson({
			worker: acmeFrontendWorker,
			path: path.join(srcDir, 'wrangler.jsonc'),
		})

		return this({
			worker: acmeFrontendWorker,
			acmeApi: props.acmeApi,
		})
	}
)
