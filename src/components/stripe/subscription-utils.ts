export function formatDate(
    date: Date | string | null | undefined,
    notAvailableLabel: string
): string {
    if (!date) return notAvailableLabel
    const dateObj = typeof date === "string" ? new Date(date) : date
    return dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric"
    })
}

export function formatStatus(status: string): string {
    return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
}
