"use client"

import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { SettingsCardHeader } from "../settings/shared/settings-card-header"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import { useContext } from "react"

interface SubscriptionManagementCardProps {
    canUpgrade: boolean | null
    isPro: boolean
    isScheduledToCancel: boolean
    isLoading: boolean
    confirmationMessage: string | null
    defaultPlanName: string
    currentPlanName: string
    onUpgrade: () => void
    onCancel: () => void
    onRestore: () => void
}

export function SubscriptionManagementCard({
    canUpgrade,
    isPro,
    isScheduledToCancel,
    isLoading,
    confirmationMessage,
    defaultPlanName,
    currentPlanName,
    onUpgrade,
    onCancel,
    onRestore
}: SubscriptionManagementCardProps) {
    
    const {
        toast,
    } = useContext(AuthUIContext)

    const getDescription = () => {
        if (canUpgrade === false) {
            if (isPro) {
                return isScheduledToCancel
                    ? `Your ${defaultPlanName} subscription will be canceled at the end of the current billing period. You can restore it until then.`
                    : `You are currently on the ${defaultPlanName} plan.`
            }
            return "You are already on a paid plan."
        }
        return `You are currently on the Free plan. Upgrade to the ${defaultPlanName} plan to unlock additional features.`
    }

    if (confirmationMessage) {
        console.log("toast should be shown", confirmationMessage)
        toast({
            variant: "success",
            message: confirmationMessage
        })
    }

    return (
        <Card>
            <SettingsCardHeader title="Subscription" description={getDescription()} />
            <CardContent className="space-y-4">
                {canUpgrade && (
                    <Button onClick={onUpgrade} disabled={isLoading}>
                        {isLoading
                            ? "Redirecting to Stripe..."
                            : `Upgrade to ${defaultPlanName}`}
                    </Button>
                )}
                {canUpgrade === false && isPro && (
                    <Button
                        variant={
                            isScheduledToCancel ? "default" : "destructive"
                        }
                        onClick={isScheduledToCancel ? onRestore : onCancel}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? isScheduledToCancel
                                ? "Restoring subscription..."
                                : "Cancelling subscription..."
                            : isScheduledToCancel
                              ? `Restore ${defaultPlanName} subscription`
                              : `Cancel ${defaultPlanName} subscription`}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
