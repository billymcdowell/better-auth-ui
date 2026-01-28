interface SubscriptionDetailRowProps {
    label: string
    value: string | React.ReactNode
    isMono?: boolean
}

export function SubscriptionDetailRow({
    label,
    value,
    isMono = false
}: SubscriptionDetailRowProps) {
    return (
        <div className="space-y-1">
            <p className="font-medium text-muted-foreground text-sm">{label}</p>
            <p className={`font-semibold text-sm ${isMono ? "font-mono" : ""}`}>
                {value}
            </p>
        </div>
    )
}
