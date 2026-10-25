import { FakeCamsolGateway } from './fake-gateway'
import { CamsolConfig, HttpCamsolGateway } from './http-gateway'
import { environmentCamsolConfig, savedCamsolConfig, simulatedPaymentsAllowed } from './settings'
import { CamsolGateway, CamsolRejectedError, CamsolUnavailableError } from './types'

export * from './types'

export const NOT_SET_UP = 'Mobile Money payments are not set up yet. Please try again later or pay in cash.'

const globalForCamsol = globalThis as unknown as {
  camsolFake?: FakeCamsolGateway
  camsolLive?: { signature: string; gateway: HttpCamsolGateway }
}

/** The simulated gateway (development and tests). Kept on globalThis so hot reloads keep it. */
export function fakeCamsol(): FakeCamsolGateway {
  if (!globalForCamsol.camsolFake) {
    const autoConfirmMs = process.env.CAMSOL_FAKE_CONFIRM_MS ? Number(process.env.CAMSOL_FAKE_CONFIRM_MS) : undefined
    globalForCamsol.camsolFake = new FakeCamsolGateway({ autoConfirmMs })
    if (process.env.NODE_ENV !== 'test') console.warn('[camsol] no keys: payments are simulated, no money moves')
  }
  return globalForCamsol.camsolFake
}

function liveFor(config: CamsolConfig): HttpCamsolGateway {
  const signature = JSON.stringify(config)
  if (globalForCamsol.camsolLive?.signature !== signature) {
    globalForCamsol.camsolLive = { signature, gateway: new HttpCamsolGateway(config) }
  }
  return globalForCamsol.camsolLive.gateway
}

/** The live gateway for the keys in use now, or null when there are none. */
export async function liveCamsol(): Promise<HttpCamsolGateway | null> {
  const config = (await savedCamsolConfig()) ?? environmentCamsolConfig()
  return config ? liveFor(config) : null
}

/**
 * The gateway to use right now. Keys are looked up on every call: keys saved in the admin
 * dashboard (cached 15s), then CAMSOL_* variables, then (development only) simulated
 * payments. In production with no keys, payments are refused.
 */
export async function currentCamsol(): Promise<CamsolGateway | null> {
  const live = await liveCamsol()
  if (live) return live
  return simulatedPaymentsAllowed() ? fakeCamsol() : null
}

/** For starting payments: refuse cleanly when nothing is set up. */
export async function camsolForCollection(): Promise<CamsolGateway> {
  const gateway = await currentCamsol()
  if (!gateway) throw new CamsolRejectedError(NOT_SET_UP)
  return gateway
}

/** For checks and payouts that can be retried later: keys may be added in the meantime. */
export async function camsolRequired(): Promise<CamsolGateway> {
  const gateway = await currentCamsol()
  if (!gateway) throw new CamsolUnavailableError('PayWithCAMSOL keys are not set up yet')
  return gateway
}
