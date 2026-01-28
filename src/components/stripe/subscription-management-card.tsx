"use client"

import { useContext } from "react"
import { AuthUIContext } from "../../lib/auth-ui-provider"
import type { AuthLocalization } from "../../localization/auth-localization"
import { SettingsCardHeader } from "../settings/shared/settings-card-header"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

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
    localization: AuthLocalization
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
    onRestore,
    localization
}: SubscriptionManagementCardProps) {
    const { toast } = useContext(AuthUIContext)

    const getDescription = () => {
        if (canUpgrade === false) {
            if (isPro) {
                return isScheduledToCancel
                    ? (
                          localization.STRIPE_DESCRIPTION_SCHEDULED_TO_CANCEL ??
                          ""
                      ).replace("{plan}", defaultPlanName)
                    : (
                          localization.STRIPE_DESCRIPTION_CURRENTLY_ON_PLAN ??
                          ""
                      ).replace("{plan}", defaultPlanName)
            }
            return localization.STRIPE_DESCRIPTION_ALREADY_ON_PAID_PLAN ?? ""
        }
        return (localization.STRIPE_DESCRIPTION_ON_FREE_UPGRADE ?? "").replace(
            "{plan}",
            defaultPlanName
        )
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
            <SettingsCardHeader
                title={localization.STRIPE_SUBSCRIPTION}
                description={getDescription()}
            />
            <CardContent className="space-y-4">
                {canUpgrade && (
                    <Button onClick={onUpgrade} disabled={isLoading}>
                        {isLoading
                            ? (localization.STRIPE_REDIRECTING_TO_STRIPE ?? "")
                            : (
                                  localization.STRIPE_UPGRADE_TO_PLAN ?? ""
                              ).replace("{plan}", defaultPlanName)}
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
                                ? localization.STRIPE_RESTORING_SUBSCRIPTION
                                : localization.STRIPE_CANCELLING_SUBSCRIPTION
                            : isScheduledToCancel
                              ? (
                                    localization.STRIPE_RESTORE_PLAN_SUBSCRIPTION ??
                                    ""
                                ).replace("{plan}", defaultPlanName)
                              : (
                                    localization.STRIPE_CANCEL_PLAN_SUBSCRIPTION ??
                                    ""
                                ).replace("{plan}", defaultPlanName)}
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}
