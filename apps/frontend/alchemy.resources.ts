import path from 'node:path'
import { Resource } from 'alchemy'
import { Worker } from 'alchemy/cloudflare'

import type { Context } from 'alchemy'

const srcDir = path.join(__dirname, 'src')

export interface FrontendProps {}
export interface Frontend extends Resource<'custom::frontend'>, FrontendProps {
	worker: Worker
}

export const Frontend = Resource(
	'custom::frontend',
	async function (this: Context<Frontend>, _id, _props: FrontendProps): Promise<Frontend> {
		const frontendWorker = await Worker('worker', {
			entrypoint: path.join(srcDir, 'frontend.app.ts'),
			compatibilityDate: '2025-09-08',
			compatibilityFlags: ['nodejs_compat'],
		})

		console.log(`frontend deployed at: ${frontendWorker.url}`)

		return this({
			worker: frontendWorker,
		})
	}
)
