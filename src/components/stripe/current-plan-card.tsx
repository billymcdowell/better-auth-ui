"use client"

import type { AuthLocalization } from "../../localization/auth-localization"
import type { Subscription } from "../../types/subscription"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { SubscriptionDetailRow } from "./subscription-detail-row"
import { formatDate, formatStatus } from "./subscription-utils"

interface CurrentPlanCardProps {
    subscription: Subscription
    getPlanName: (planId: string) => string
    localization: AuthLocalization
}

export function CurrentPlanCard({
    subscription,
    getPlanName,
    localization
}: CurrentPlanCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    {localization.STRIPE_CURRENT_PLAN_DETAILS}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <SubscriptionDetailRow
                        label={localization.STRIPE_PLAN ?? ""}
                        value={getPlanName(subscription.plan)}
                    />
                    <SubscriptionDetailRow
                        label={localization.STRIPE_STATUS ?? ""}
                        value={formatStatus(subscription.status)}
                    />
                    {subscription.stripeSubscriptionId && (
                        <SubscriptionDetailRow
                            label={localization.STRIPE_SUBSCRIPTION_ID ?? ""}
                            value={subscription.stripeSubscriptionId}
                            isMono
                        />
                    )}
                    {subscription.id && (
                        <SubscriptionDetailRow
                            label={localization.STRIPE_ID ?? ""}
                            value={subscription.id}
                            isMono
                        />
                    )}
                    {subscription.cancelAtPeriodEnd !== undefined && (
                        <SubscriptionDetailRow
                            label={
                                localization.STRIPE_CANCEL_AT_PERIOD_END ?? ""
                            }
                            value={
                                subscription.cancelAtPeriodEnd
                                    ? (localization.STRIPE_YES ?? "")
                                    : (localization.STRIPE_NO ?? "")
                            }
                        />
                    )}
                    {subscription.cancelAt && (
                        <SubscriptionDetailRow
                            label={
                                localization.STRIPE_SCHEDULED_CANCELLATION ?? ""
                            }
                            value={formatDate(
                                subscription.cancelAt,
                                localization.STRIPE_NOT_AVAILABLE ?? ""
                            )}
                        />
                    )}
                    {subscription.canceledAt && (
                        <SubscriptionDetailRow
                            label={localization.STRIPE_CANCELED_AT ?? ""}
                            value={formatDate(
                                subscription.canceledAt,
                                localization.STRIPE_NOT_AVAILABLE ?? ""
                            )}
                        />
                    )}
                    {subscription.endedAt && (
                        <SubscriptionDetailRow
                            label={localization.STRIPE_ENDED_AT ?? ""}
                            value={formatDate(
                                subscription.endedAt,
                                localization.STRIPE_NOT_AVAILABLE ?? ""
                            )}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
