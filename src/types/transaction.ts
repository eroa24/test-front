export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED'

export interface Transaction {
  transactionId: string
  status: TransactionStatus
  createdAt: string
  updatedAt: string
}

export interface TransactionMetadata {
  timestamp: string
  path: string
  method: string
}

export interface TransactionResponse {
  success: boolean
  data: Transaction
  metadata: TransactionMetadata
}
