export function formatBid(bid: number) {
    if (bid % 1000000 === 0) {
        return `${bid / 1000000}M`;
    }
    if (bid % 1000 === 0) {
        return `${bid / 1000}K`;
    }

    return `${bid}`;
}
