/**
 * Gateway constants
 * @description Enums and constants for PaymentGateway model
 * @author s.adarsh1996@gmail.com
 * @version 1.0.0
 * @since 1.0.0
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
