"use client"

import { useContext, useEffect, useState } from "react"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { AuthLocalization } from "../../localization/auth-localization"
import type { Subscription } from "../../types/subscription"

interface UseSubscriptionParams {
    localization: AuthLocalization
}

export function useSubscription({ localization }: UseSubscriptionParams) {
    const { authClient, stripe } = useContext(AuthUIContext)

    const [isLoading, setIsLoading] = useState(false)
    const [canUpgrade, setCanUpgrade] = useState<boolean | null>(null)
    const [activeSubscription, setActiveSubscription] =
        useState<Subscription | null>(null)
    const [confirmationMessage, setConfirmationMessage] = useState<
        string | null
    >(null)

    // Get plan name from config or fallback to capitalized plan ID
    const getPlanName = (planId: string): string => {
        return (
            stripe?.plans?.[planId] ??
            planId.charAt(0).toUpperCase() + planId.slice(1)
        )
    }

    // Get the default plan ID from config or fallback to "pro"
    const defaultPlanId = stripe?.defaultPlanId ?? "pro"
    const defaultPlanName = getPlanName(defaultPlanId)

    // Load the user's current subscription and only allow upgrade if they are on the free tier
    useEffect(() => {
        const loadSubscription = async () => {
            try {
                setConfirmationMessage(null)
                const { data, error } = await authClient.subscription.list({
                    query: {
                        // for user-level billing, we can rely on the default referenceId (user id)
                        customerType: "user"
                    }
                })

                if (error) {
                    // If we can't determine their subscription, fall back to allowing upgrade
                    // eslint-disable-next-line no-console
                    console.error("Failed to load subscriptions", error)
                    setCanUpgrade(true)
                    return
                }

                // eslint-disable-next-line no-console
                console.log("Loaded subscriptions", data)

                const activeSubscription = data?.find(
                    (sub) =>
                        sub.status === "active" || sub.status === "trialing"
                )

                // If there is no active/trialing subscription, treat them as free-tier
                if (!activeSubscription) {
                    setCanUpgrade(true)
                    return
                }

                // Store the active subscription so we can manage it (e.g. cancel)
                setActiveSubscription(activeSubscription)

                // If they're already on the default plan (or any paid plan), don't allow upgrade
                setCanUpgrade(activeSubscription.plan !== defaultPlanId)
            } catch (error) {
                // eslint-disable-next-line no-console
                console.error(
                    "Unexpected error while loading subscriptions",
                    error
                )
                setCanUpgrade(true)
            }
        }

        void loadSubscription()
    }, [authClient, defaultPlanId])

    const handleCancel = async () => {
        if (!activeSubscription || !activeSubscription.stripeSubscriptionId)
            return

        try {
            setIsLoading(true)
            setConfirmationMessage(null)

            const origin = window.location.origin

            // Get cancel return URL from config or use default
            const cancelReturnUrl =
                typeof stripe?.cancelReturnUrl === "function"
                    ? stripe.cancelReturnUrl(origin)
                    : (stripe?.cancelReturnUrl ?? `${origin}/settings/billing`)

            const { error } = await authClient.subscription.cancel({
                // for user-level billing, we can rely on the default referenceId (user id)
                customerType: "user",
                // Better Auth expects the Stripe subscription id (sub_*)
                subscriptionId: activeSubscription.stripeSubscriptionId,
                returnUrl: cancelReturnUrl
            })

            if (error) {
                // eslint-disable-next-line no-console
                console.error("Failed to cancel subscription", error)
                return
            }

            // Mark the subscription as set to cancel at period end locally
            // so we can offer a restore option until the period actually ends.
            setActiveSubscription((prev) =>
                prev
                    ? {
                          ...prev,
                          cancelAtPeriodEnd: true
                      }
                    : prev
            )
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(
                "Unexpected error while cancelling subscription",
                error
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleRestore = async () => {
        if (!activeSubscription || !activeSubscription.stripeSubscriptionId)
            return

        try {
            setIsLoading(true)

            const { error } = await authClient.subscription.restore({
                // for user-level billing, we can rely on the default referenceId (user id)
                customerType: "user",
                // Better Auth expects the Stripe subscription id (sub_*)
                subscriptionId: activeSubscription.stripeSubscriptionId
            })

            if (error) {
                // eslint-disable-next-line no-console
                console.error("Failed to restore subscription", error)
                return
            }

            // Clear local cancellation flags so the UI reflects the restored state
            setActiveSubscription((prev) =>
                prev
                    ? {
                          ...prev,
                          cancelAtPeriodEnd: false,
                          cancelAt: null,
                          canceledAt: null
                      }
                    : prev
            )

            setConfirmationMessage(
                (
                    localization.STRIPE_CONFIRMATION_SUBSCRIPTION_RESTORED ?? ""
                ).replace("{plan}", defaultPlanName)
            )
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(
                "Unexpected error while restoring subscription",
                error
            )
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpgrade = async () => {
        try {
            setIsLoading(true)
            setConfirmationMessage(null)

            // Use the current origin so this works in any environment
            const origin = window.location.origin

            // Get URLs from config or use defaults
            const successUrl =
                typeof stripe?.successUrl === "function"
                    ? stripe.successUrl(origin)
                    : (stripe?.successUrl ??
                      `${origin}/settings/billing?success=true`)

            const cancelUrl =
                typeof stripe?.cancelUrl === "function"
                    ? stripe.cancelUrl(origin)
                    : (stripe?.cancelUrl ??
                      `${origin}/settings/billing?success=false`)

            const returnUrl =
                typeof stripe?.returnUrl === "function"
                    ? stripe.returnUrl(origin)
                    : (stripe?.returnUrl ?? `${origin}/dashboard`)

            const { error } = await authClient.subscription.upgrade({
                plan: defaultPlanId,
                customerType: "user",
                seats: 1,
                successUrl,
                cancelUrl,
                returnUrl,
                // Let Better Auth + Stripe handle the redirect
                disableRedirect: false
            })

            if (error) {
                // eslint-disable-next-line no-console
                console.error("Failed to upgrade subscription", error)
            }
        } catch (error) {
            // You can wire this into `sonner` to show a toast if desired
            // eslint-disable-next-line no-console
            console.error(
                "Unexpected error while upgrading subscription",
                error
            )
        } finally {
            setIsLoading(false)
        }
    }

    const isPro = activeSubscription?.plan === defaultPlanId
    const currentPlanName = activeSubscription
        ? getPlanName(activeSubscription.plan)
        : (localization.STRIPE_FREE ?? "")

    const isScheduledToCancel =
        !!activeSubscription &&
        (activeSubscription.cancelAtPeriodEnd ||
            (!!activeSubscription.cancelAt && !activeSubscription.endedAt))

    return {
        isLoading,
        canUpgrade,
        activeSubscription,
        confirmationMessage,
        isPro,
        isScheduledToCancel,
        defaultPlanName,
        currentPlanName,
        getPlanName,
        handleCancel,
        handleRestore,
        handleUpgrade
    }
}
