"use client"

import { useContext, useMemo } from "react"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { AuthLocalization } from "../../localization/auth-localization"
import { CurrentPlanCard } from "./current-plan-card"
import { SubscriptionManagementCard } from "./subscription-management-card"
import { useSubscription } from "./use-subscription"

export interface SubscriptionCardsProps {
    localization?: AuthLocalization
    customerType?: "user" | "organization"
    referenceId?: string
}

export function SubscriptionCards({
    localization: localizationProp,
    customerType,
    referenceId
}: SubscriptionCardsProps) {
    const { localization: contextLocalization } = useContext(AuthUIContext)

    const localization = useMemo(
        () => ({ ...contextLocalization, ...localizationProp }),
        [contextLocalization, localizationProp]
    )

    const {
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
    } = useSubscription({ localization, customerType, referenceId })

    return (
        <div className="space-y-4">
            <h1 className="mb-4 font-semibold text-xl">
                {localization.STRIPE_BILLING_SETTINGS}
            </h1>

            {activeSubscription && (
                <CurrentPlanCard
                    subscription={activeSubscription}
                    getPlanName={getPlanName}
                    localization={localization}
                />
            )}

            <SubscriptionManagementCard
                canUpgrade={canUpgrade}
                isPro={isPro}
                isScheduledToCancel={isScheduledToCancel}
                isLoading={isLoading}
                confirmationMessage={confirmationMessage}
                defaultPlanName={defaultPlanName}
                currentPlanName={currentPlanName}
                onUpgrade={handleUpgrade}
                onCancel={handleCancel}
                onRestore={handleRestore}
                localization={localization}
            />
        </div>
    )
}
