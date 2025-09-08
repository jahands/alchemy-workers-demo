import { WorkerEntrypoint } from 'cloudflare:workers'
import { Hono } from 'hono'
import { useWorkersLogger } from 'workers-tagged-logger'

import { useNotFound, useOnError } from '@repo/hono-helpers'

import type { App, Env } from './context'

const app = new Hono<App>()
	.use(
		'*',
		// middleware
		(c, next) => useWorkersLogger(c.env.NAME)(c, next)
	)

	.onError(useOnError())
	.notFound(useNotFound())

	.get('/', async (c) => {
		return c.text('hello from acme-api!')
	})

export class AcmeApiEntrypoint extends WorkerEntrypoint<Env> {
	async fetch(request: Request) {
		return app.fetch(request, this.env, this.ctx)
	}

	async add(a: number, b: number) {
		return a + b
	}
}

export default AcmeApiEntrypoint
