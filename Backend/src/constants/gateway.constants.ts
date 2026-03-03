/**
 * Gateway constants for PaymentGateway model
 */

export const GATEWAY_TYPE = {
  Fiat: 'Fiat',
  Crypto: 'Crypto',
  BankTransfer: 'BankTransfer',
  Wallet: 'Wallet',
  Alternative: 'Alternative',
} as const;

export type GatewayType = (typeof GATEWAY_TYPE)[keyof typeof GATEWAY_TYPE];

export const CARD_TYPE = {
  VISA: 'VISA',
  MasterCard: 'MasterCard',
  Discover: 'Discover',
  Amex: 'Amex',
  MaestroCard: 'MaestroCard',
  DinersClub: 'DinersClub',
  JCB: 'JCB',
  UnionPay: 'UnionPay',
} as const;

export type CardType = (typeof CARD_TYPE)[keyof typeof CARD_TYPE];

/** Request config type: aligns with gateway capabilities (refund, payment, apm, etc.) */
export const REQUEST_CONFIG_TYPE = {
  Refund: 'refund',
  Payment: 'payment',
  APM: 'apm',
  Authorization: 'authorization',
  Subscription: 'subscription',
  Token: 'token',
  Payout: 'payout',
  Payin: 'payin',
} as const;

export type RequestConfigType = (typeof REQUEST_CONFIG_TYPE)[keyof typeof REQUEST_CONFIG_TYPE];
