import path from 'node:path'
import { Resource } from 'alchemy'
import { Worker, WranglerJson } from 'alchemy/cloudflare'

import { AcmeStage } from '@repo/acme-common'

import type { Context } from 'alchemy'
import type { AcmeApi } from '@repo/acme-api/alchemy.resources'

const appDir = path.resolve(__dirname)

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
		const stage = AcmeStage.parse(this.stage)
		const zoneId = '9edd1df001349bb837f7ea87bea6ab01' // jtest.dev
		const domainName = 'acme-frontend.jtest.dev'

		const acmeFrontendWorker = await Worker('worker', {
			entrypoint: path.join(appDir, 'src/acme-frontend.app.ts'),
			compatibilityDate: '2025-09-08',
			compatibilityFlags: ['nodejs_compat'],
			domains: stage === 'prod' ? [{ domainName, zoneId }] : [],
			routes: stage === 'prod' ? [{ pattern: `${domainName}/*`, zoneId }] : [],
			bindings: {
				ACME_API: props.acmeApi.worker,
			},
		})

		console.log(`acme-frontend deployed at: ${acmeFrontendWorker.url}`)

		await WranglerJson({
			worker: acmeFrontendWorker,
			path: path.join(appDir, 'wrangler.jsonc'),
		})

		return this({
			worker: acmeFrontendWorker,
			acmeApi: props.acmeApi,
		} as any)
	}
)
