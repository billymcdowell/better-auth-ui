"use client"

import type { Subscription } from "../../types/subscription"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { SubscriptionDetailRow } from "./subscription-detail-row"
import { formatDate, formatStatus } from "./subscription-utils"

interface CurrentPlanCardProps {
    subscription: Subscription
    getPlanName: (planId: string) => string
}

export function CurrentPlanCard({
    subscription,
    getPlanName
}: CurrentPlanCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Current Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <SubscriptionDetailRow
                        label="Plan"
                        value={getPlanName(subscription.plan)}
                    />
                    <SubscriptionDetailRow
                        label="Status"
                        value={formatStatus(subscription.status)}
                    />
                    {subscription.stripeSubscriptionId && (
                        <SubscriptionDetailRow
                            label="Subscription ID"
                            value={subscription.stripeSubscriptionId}
                            isMono
                        />
                    )}
                    {subscription.id && (
                        <SubscriptionDetailRow
                            label="ID"
                            value={subscription.id}
                            isMono
                        />
                    )}
                    {subscription.cancelAtPeriodEnd !== undefined && (
                        <SubscriptionDetailRow
                            label="Cancel at Period End"
                            value={
                                subscription.cancelAtPeriodEnd ? "Yes" : "No"
                            }
                        />
                    )}
                    {subscription.cancelAt && (
                        <SubscriptionDetailRow
                            label="Scheduled Cancellation"
                            value={formatDate(subscription.cancelAt)}
                        />
                    )}
                    {subscription.canceledAt && (
                        <SubscriptionDetailRow
                            label="Canceled At"
                            value={formatDate(subscription.canceledAt)}
                        />
                    )}
                    {subscription.endedAt && (
                        <SubscriptionDetailRow
                            label="Ended At"
                            value={formatDate(subscription.endedAt)}
                        />
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
