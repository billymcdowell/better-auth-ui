import type { BetterFetchError } from "@better-fetch/fetch"
import type { AuthClient } from "./auth-client"

export type SubscriptionStatus =
    | "active"
    | "trialing"
    | "canceled"
    | "past_due"
    | "unpaid"
    | "incomplete"
    | "incomplete_expired"
    | "paused"

export type SubscriptionPlan = "pro" | string

export interface Subscription {
    id: string
    status: SubscriptionStatus
    plan: SubscriptionPlan
    stripeSubscriptionId?: string
    cancelAtPeriodEnd?: boolean
    cancelAt?: Date | string | null
    canceledAt?: Date | string | null
    currentPeriodEnd?: Date | string | null
    endedAt?: Date | string | null
    [key: string]: unknown
}

export interface SubscriptionListParams {
    query?: {
        customerType?: "user" | "organization"
        referenceId?: string
    }
}

export interface SubscriptionCancelParams {
    customerType?: "user" | "organization"
    subscriptionId: string
    returnUrl?: string
}

export interface SubscriptionRestoreParams {
    customerType?: "user" | "organization"
    subscriptionId: string
}

export interface SubscriptionUpgradeParams {
    plan: string
    customerType?: "user" | "organization"
    seats?: number
    successUrl?: string
    cancelUrl?: string
    returnUrl?: string
    disableRedirect?: boolean
}

export interface SubscriptionClient {
    list: (params?: SubscriptionListParams) => Promise<{
        data: Subscription[] | null
        error: BetterFetchError | null
    }>
    cancel: (params: SubscriptionCancelParams) => Promise<{
        data: unknown
        error: BetterFetchError | null
    }>
    restore: (params: SubscriptionRestoreParams) => Promise<{
        data: unknown
        error: BetterFetchError | null
    }>
    upgrade: (params: SubscriptionUpgradeParams) => Promise<{
        data: unknown
        error: BetterFetchError | null
    }>
}

export type AuthClientWithSubscription = AuthClient & {
    subscription: SubscriptionClient
}

/**
 * Type guard/assertion helper to safely access subscription methods on authClient
 * Use this when you know your authClient has subscription methods available
 */
export function hasSubscriptionClient(
    client: AuthClient
): client is AuthClientWithSubscription {
    return (
        "subscription" in client &&
        typeof (client as { subscription?: unknown }).subscription === "object"
    )
}
