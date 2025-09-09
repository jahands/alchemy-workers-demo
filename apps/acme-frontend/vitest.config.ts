import { execSync } from 'node:child_process'
import fs from 'node:fs'
import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config'
import z from 'zod'

const WranglerJson = z.object({
	name: z.string(),
	main: z.string(),
	compatibility_date: z.string(),
	compatibility_flags: z.array(z.string()),
	r2_buckets: z
		.array(
			z.object({
				binding: z.string(),
				bucket_name: z.string(),
			})
		)
		.optional(),
})

async function getWorker(pkgName: string) {
	const pkgDir = `${__dirname}/node_modules/${pkgName}`
	const wranglerJsonRaw = fs.readFileSync(`${pkgDir}/wrangler.jsonc`, 'utf8')
	const wranglerJson = WranglerJson.parse(JSON.parse(wranglerJsonRaw))
	execSync('bun wrangler build', { cwd: pkgDir })
	return {
		name: wranglerJson.name,
		scriptPath: `${pkgDir}/dist/${wranglerJson.main.replace(/\.ts$/, '.js').replace(/^src\//, '')}`,
		modules: true,
		compatibilityDate: wranglerJson.compatibility_date,
		compatibilityFlags: wranglerJson.compatibility_flags,
		r2Buckets: wranglerJson.r2_buckets?.reduce(
			(acc, bucket) => {
				acc[bucket.binding] = bucket.bucket_name
				return acc
			},
			{} as Record<string, string>
		),
	}
}

await getWorker('@repo/acme-api')

export default defineWorkersProject({
	test: {
		poolOptions: {
			workers: {
				wrangler: { configPath: `${__dirname}/wrangler.jsonc` },
				miniflare: {
					bindings: {
						ENVIRONMENT: 'VITEST',
					},
					serviceBindings: {
						ACME_API: 'acme-api-worker-dev',
					},
					workers: [await getWorker('@repo/acme-api')],
				},
			},
		},
	},
})
