export function formatBid(bid: number) {
    if (bid >= 1000000) {
        return `${bid / 1000000}M`;
    }
    if (bid >= 1000) {
        return `${bid / 1000}K`;
    }

    return `${bid}`;
}
