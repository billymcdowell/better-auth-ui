"use client"

import { useContext, useEffect, useState } from "react"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { getLocalizedError } from "../../lib/utils"
import type { AuthLocalization } from "../../localization/auth-localization"
import type { Subscription } from "../../types/subscription"
import { hasSubscriptionClient } from "../../types/subscription"

interface UseSubscriptionParams {
    localization: AuthLocalization
    customerType?: "user" | "organization"
    referenceId?: string
}

export function useSubscription({
    localization,
    customerType = "user",
    referenceId
}: UseSubscriptionParams) {
    const { authClient, stripe, toast, localizeErrors } =
        useContext(AuthUIContext)

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
            if (!hasSubscriptionClient(authClient)) {
                // eslint-disable-next-line no-console
                console.error(
                    "[better-auth-ui] Stripe subscription plugin is not configured on your authClient. Add stripeClient({ subscription: true }) to your createAuthClient plugins."
                )
                return
            }

            try {
                setConfirmationMessage(null)
                const { data, error } = await authClient.subscription.list({
                    query: {
                        customerType,
                        ...(referenceId ? { referenceId } : {})
                    }
                })

                if (error) {
                    toast({
                        variant: "error",
                        message: getLocalizedError({
                            error,
                            localization,
                            localizeErrors
                        })
                    })
                    // If we can't determine their subscription, fall back to allowing upgrade
                    setCanUpgrade(true)
                    return
                }

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
                toast({
                    variant: "error",
                    message: getLocalizedError({
                        error,
                        localization,
                        localizeErrors
                    })
                })
                setCanUpgrade(true)
            }
        }

        void loadSubscription()
    }, [
        authClient,
        customerType,
        defaultPlanId,
        localizeErrors,
        localization,
        referenceId,
        toast
    ])

    const handleCancel = async () => {
        if (!activeSubscription || !activeSubscription.stripeSubscriptionId)
            return

        if (!hasSubscriptionClient(authClient)) return

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
                customerType,
                // Better Auth expects the Stripe subscription id (sub_*)
                subscriptionId: activeSubscription.stripeSubscriptionId,
                returnUrl: cancelReturnUrl
            })

            if (error) {
                toast({
                    variant: "error",
                    message: getLocalizedError({
                        error,
                        localization,
                        localizeErrors
                    })
                })
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
            toast({
                variant: "error",
                message: getLocalizedError({
                    error,
                    localization,
                    localizeErrors
                })
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleRestore = async () => {
        if (!activeSubscription || !activeSubscription.stripeSubscriptionId)
            return

        if (!hasSubscriptionClient(authClient)) return

        try {
            setIsLoading(true)

            const { error } = await authClient.subscription.restore({
                customerType,
                // Better Auth expects the Stripe subscription id (sub_*)
                subscriptionId: activeSubscription.stripeSubscriptionId
            })

            if (error) {
                toast({
                    variant: "error",
                    message: getLocalizedError({
                        error,
                        localization,
                        localizeErrors
                    })
                })
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
            toast({
                variant: "error",
                message: getLocalizedError({
                    error,
                    localization,
                    localizeErrors
                })
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpgrade = async () => {
        if (!hasSubscriptionClient(authClient)) return

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
                customerType,
                seats: 1,
                successUrl,
                cancelUrl,
                returnUrl,
                // Let Better Auth + Stripe handle the redirect
                disableRedirect: false
            })

            if (error) {
                toast({
                    variant: "error",
                    message: getLocalizedError({
                        error,
                        localization,
                        localizeErrors
                    })
                })
            }
        } catch (error) {
            toast({
                variant: "error",
                message: getLocalizedError({
                    error,
                    localization,
                    localizeErrors
                })
            })
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
