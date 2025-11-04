import type { ConfirmationModalState } from './confirmationModalState'

export interface TriStateConfirmationInterface {
  open(): Promise<ConfirmationModalState>
}
