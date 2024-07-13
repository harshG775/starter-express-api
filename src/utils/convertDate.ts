// Utility to parse duration strings (like '20d', '10h') into milliseconds
export const parseDuration = (duration: string): number => {
    const match = duration.match(/^(\d+)([dhms])$/);
    if (!match) throw new Error(`Invalid duration format: ${duration}`);
    const value = parseInt(match[1], 10);
    const unit = match[2];
    switch (unit) {
        case 'd': return value * 24 * 60 * 60 * 1000;
        case 'h': return value * 60 * 60 * 1000;
        case 'm': return value * 60 * 1000;
        case 's': return value * 1000;
        default: throw new Error(`Unknown duration unit: ${unit}`);
    }
};