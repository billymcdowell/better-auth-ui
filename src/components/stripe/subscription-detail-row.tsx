"use client"

import type { ReactNode } from "react"
import { cn } from "../../lib/utils"

interface SubscriptionDetailRowProps {
    label: string
    value: string | ReactNode
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
            <p className={cn("font-semibold text-sm", isMono && "font-mono")}>
                {value}
            </p>
        </div>
    )
}
