export const STRIPE_ERROR_CODES = {
    SUBSCRIPTION_NOT_FOUND: "Subscription not found",
    SUBSCRIPTION_PLAN_NOT_FOUND: "Subscription plan not found",
    ALREADY_SUBSCRIBED_PLAN: "You're already subscribed to this plan",
    UNABLE_TO_CREATE_CUSTOMER: "Unable to create customer",
    FAILED_TO_FETCH_PLANS: "Failed to fetch plans",
    EMAIL_VERIFICATION_REQUIRED:
        "Email verification is required before you can subscribe to a plan",
    SUBSCRIPTION_NOT_ACTIVE: "Subscription is not active",
    SUBSCRIPTION_NOT_SCHEDULED_FOR_CANCELLATION:
        "Subscription is not scheduled for cancellation"
}

export const STRIPE_LOCALIZATION = {
    ...STRIPE_ERROR_CODES,

    /** @default "Billing Settings" */
    STRIPE_BILLING_SETTINGS: "Billing Settings",

    /** @default "Subscription" */
    STRIPE_SUBSCRIPTION: "Subscription",

    /** @default "Current Plan Details" */
    STRIPE_CURRENT_PLAN_DETAILS: "Current Plan Details",

    /** @default "Plan" */
    STRIPE_PLAN: "Plan",

    /** @default "Status" */
    STRIPE_STATUS: "Status",

    /** @default "Subscription ID" */
    STRIPE_SUBSCRIPTION_ID: "Subscription ID",

    /** @default "ID" */
    STRIPE_ID: "ID",

    /** @default "Cancel at Period End" */
    STRIPE_CANCEL_AT_PERIOD_END: "Cancel at Period End",

    /** @default "Scheduled Cancellation" */
    STRIPE_SCHEDULED_CANCELLATION: "Scheduled Cancellation",

    /** @default "Canceled At" */
    STRIPE_CANCELED_AT: "Canceled At",

    /** @default "Ended At" */
    STRIPE_ENDED_AT: "Ended At",

    /** @default "Yes" */
    STRIPE_YES: "Yes",

    /** @default "No" */
    STRIPE_NO: "No",

    /** @default "N/A" */
    STRIPE_NOT_AVAILABLE: "N/A",

    /** @default "Renews On" */
    STRIPE_RENEWS_ON: "Renews On",

    /** @default "Free" */
    STRIPE_FREE: "Free",

    /** @default "Your {plan} subscription will be canceled at the end of the current billing period. You can restore it until then." */
    STRIPE_DESCRIPTION_SCHEDULED_TO_CANCEL:
        "Your {plan} subscription will be canceled at the end of the current billing period. You can restore it until then.",

    /** @default "You are currently on the {plan} plan." */
    STRIPE_DESCRIPTION_CURRENTLY_ON_PLAN:
        "You are currently on the {plan} plan.",

    /** @default "You are already on a paid plan." */
    STRIPE_DESCRIPTION_ALREADY_ON_PAID_PLAN: "You are already on a paid plan.",

    /** @default "You are currently on the Free plan. Upgrade to the {plan} plan to unlock additional features." */
    STRIPE_DESCRIPTION_ON_FREE_UPGRADE:
        "You are currently on the Free plan. Upgrade to the {plan} plan to unlock additional features.",

    /** @default "Redirecting to Stripe..." */
    STRIPE_REDIRECTING_TO_STRIPE: "Redirecting to Stripe...",

    /** @default "Upgrade to {plan}" */
    STRIPE_UPGRADE_TO_PLAN: "Upgrade to {plan}",

    /** @default "Restoring subscription..." */
    STRIPE_RESTORING_SUBSCRIPTION: "Restoring subscription...",

    /** @default "Cancelling subscription..." */
    STRIPE_CANCELLING_SUBSCRIPTION: "Cancelling subscription...",

    /** @default "Restore {plan} subscription" */
    STRIPE_RESTORE_PLAN_SUBSCRIPTION: "Restore {plan} subscription",

    /** @default "Cancel {plan} subscription" */
    STRIPE_CANCEL_PLAN_SUBSCRIPTION: "Cancel {plan} subscription",

    /** @default "Your {plan} subscription has been restored and will continue renewing automatically." */
    STRIPE_CONFIRMATION_SUBSCRIPTION_RESTORED:
        "Your {plan} subscription has been restored and will continue renewing automatically."
}
