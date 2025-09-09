import { SELF } from 'cloudflare:test'
import { expect, test } from 'vitest'

test('GET /', async () => {
	const res = await SELF.fetch('https://acme-frontend')
	expect(res.status).toBe(200)
	expect(await res.text()).toMatchInlineSnapshot(`"hello from acme-frontend!"`)
})

test('GET /acme-api', async () => {
	const res = await SELF.fetch('https://acme-frontend/acme-api')
	expect(res.status).toBe(200)
	expect(await res.text()).toMatchInlineSnapshot(`"hello from acme-api!"`)
})

test('GET /acme-api/add', async () => {
	const res = await SELF.fetch('https://acme-frontend/acme-api/add')
	expect(res.status).toBe(200)
	expect(await res.text()).toMatchInlineSnapshot(`"3"`)
})
