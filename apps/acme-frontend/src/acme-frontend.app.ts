import { Hono } from 'hono'
import { useWorkersLogger } from 'workers-tagged-logger'

import { useNotFound, useOnError } from '@repo/hono-helpers'

import type { App } from './context'

const app = new Hono<App>()
	.use(
		'*',
		// middleware
		(c, next) => useWorkersLogger(c.env.NAME)(c, next)
	)

	.onError(useOnError())
	.notFound(useNotFound())

	.get('/', async (c) => {
		return c.text('hello from acme-frontend!')
	})

	.get('/acme-api', async (c) => {
		const res = await c.env.ACME_API.fetch(new Request('http://acme-api/'))
		return c.newResponse(res.body, res)
	})

	// rpc example
	.get('/acme-api/add', async (c) => {
		const res = await c.env.ACME_API.add(1, 2)
		return c.text(res.toString())
	})

export default app
