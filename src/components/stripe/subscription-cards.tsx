"use client"

import { CurrentPlanCard } from "./current-plan-card"
import { SubscriptionManagementCard } from "./subscription-management-card"
import { useSubscription } from "./use-subscription"

export function SubscriptionCards() {
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
    } = useSubscription()

    return (
        <div className="space-y-4">
            <h1 className="mb-4 font-semibold text-xl">Billing Settings</h1>

            {activeSubscription && (
                <CurrentPlanCard
                    subscription={activeSubscription}
                    getPlanName={getPlanName}
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
            />
        </div>
    )
}
