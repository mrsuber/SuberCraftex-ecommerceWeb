import { registerPaymentHandlers } from './handlers'

// Every caller of the collection service imports from here, so handlers are always registered
registerPaymentHandlers()

export {
  applyResult,
  CollectionError,
  publicCollection,
  refreshCollection,
  startCollection,
  sweepCollections,
} from './collections'
export type { StartCollectionInput } from './collections'
