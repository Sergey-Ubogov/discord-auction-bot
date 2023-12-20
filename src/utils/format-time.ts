export function formatTime(timeInMinutes: number) {
    if (timeInMinutes >= 60) {
        return `${Math.floor(timeInMinutes / 60)}ч ${timeInMinutes % 60}мин`;
    }

    return `${timeInMinutes}мин`;
}
