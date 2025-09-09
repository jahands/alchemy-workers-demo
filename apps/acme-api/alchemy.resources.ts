import path from 'node:path'
import { Resource } from 'alchemy'
import { Worker, WranglerJson } from 'alchemy/cloudflare'

import { AcmeStage } from '@repo/acme-common'

import type { Context } from 'alchemy'
import type { R2Bucket } from 'alchemy/cloudflare'

const appDir = path.resolve(__dirname)

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
		const stage = AcmeStage.parse(this.stage)
		const zoneId = '9edd1df001349bb837f7ea87bea6ab01' // jtest.dev
		const domainName = 'acme-api.jtest.dev'

		const acmeApiWorker = await Worker('worker', {
			entrypoint: path.join(appDir, 'src/acme-api.app.ts'),
			compatibilityDate: '2025-09-02',
			compatibilityFlags: ['nodejs_compat'],
			domains: stage === 'prod' ? [{ domainName, zoneId }] : [],
			routes: stage === 'prod' ? [{ pattern: `${domainName}/*`, zoneId }] : [],
			bindings: {
				R2: props.r2Bucket,
			},
		})

		console.log(`acme-api deployed at: ${acmeApiWorker.url}`)

		if (stage === 'dev') {
			await WranglerJson({
				worker: acmeApiWorker,
				path: path.join(appDir, 'wrangler.jsonc'),
			})
		}

		return this({
			worker: acmeApiWorker,
			r2Bucket: props.r2Bucket,
		} as any)
	}
)
