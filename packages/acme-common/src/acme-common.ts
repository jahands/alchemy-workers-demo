import os from 'node:os'
import { z } from 'zod'

export type AcmeStage = z.infer<typeof AcmeStage>
export const AcmeStage = z.enum(['prod', 'dev', os.userInfo().username])
