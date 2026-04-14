/**
 * Stripe subscription configuration options
 */
export interface StripeOptions {
    /**
     * Map of plan IDs to their display names
     * @example { "pro": "Pro", "enterprise": "Enterprise" }
     */
    plans?: Record<string, string>
    /**
     * Default plan ID to use for upgrades
     * @default "pro"
     */
    defaultPlanId?: string
    /**
     * URL to redirect to after successful subscription upgrade
     * @default `${origin}/settings/billing?success=true`
     */
    successUrl?: string | ((origin: string) => string)
    /**
     * URL to redirect to when subscription upgrade is cancelled
     * @default `${origin}/settings/billing?success=false`
     */
    cancelUrl?: string | ((origin: string) => string)
    /**
     * URL to redirect to after subscription operations (return from Stripe)
     * @default `${origin}/dashboard`
     */
    returnUrl?: string | ((origin: string) => string)
    /**
     * URL to redirect to after canceling subscription
     * @default `${origin}/settings/billing`
     */
    cancelReturnUrl?: string | ((origin: string) => string)
}
