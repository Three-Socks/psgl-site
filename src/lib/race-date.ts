import { DEFAULT_TIMEZONE } from "#lib/constants.ts";
import type { RaceRound, Tier } from "#lib/types.ts";

const dateKeyFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: DEFAULT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

const wallTimeFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: DEFAULT_TIMEZONE,
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});

export const getUKDateKey = (date: Date): string => {
    const parts = dateKeyFormatter.formatToParts(date);
    const value = (type: string) => parts.find((part) => part.type === type)?.value;
    return `${value("year")}-${value("month")}-${value("day")}`;
};

// Match the bot: reject missing spring times and choose GMT in the repeated autumn hour.
export const parseUKDateTime = (date: string, time: string): Date | null => {
    const dateMatch = String(date).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const timeMatch = String(time).match(/^(\d{2}):(\d{2})(?::(\d{2}))?$/);
    if (!dateMatch || !timeMatch) return null;

    const [, year, month, day] = dateMatch;
    const [, hour, minute, second = "00"] = timeMatch;
    const wallTime = Date.UTC(+year, +month - 1, +day, +hour, +minute, +second);
    const check = new Date(wallTime);
    if (check.getUTCFullYear() !== +year || check.getUTCMonth() !== +month - 1
        || check.getUTCDate() !== +day || +hour > 23 || +minute > 59 || +second > 59) return null;

    const candidates: Date[] = [];
    for (const offset of [-1, 0, 1]) {
        const candidate = new Date(wallTime + offset * 3_600_000);
        const parts = wallTimeFormatter.formatToParts(candidate);
        const value = (type: string) => parts.find((part) => part.type === type)?.value;
        if (value("year") === year && value("month") === month && value("day") === day
            && value("hour") === hour && value("minute") === minute && value("second") === second) {
            candidates.push(candidate);
        }
    }
    return candidates.sort((a, b) => b.getTime() - a.getTime())[0] ?? null;
};

export const parseDirectusRaceDate = (value: string): Date | null => {
    const input = String(value ?? "").trim();
    if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(input)) {
        const date = new Date(input);
        return Number.isFinite(date.getTime()) ? date : null;
    }
    const match = input.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2}(?::\d{2})?)(?:\.\d+)?$/);
    return match ? parseUKDateTime(match[1], match[2]) : null;
};

export const resolveRaceDate = (calendarRound: RaceRound, tier: Pick<Tier, "id" | "time">): Date | null => {
    const overrides = calendarRound.overrides?.filter((candidate) => {
        const tierId = typeof candidate.tier === "string" ? candidate.tier : candidate.tier?.id;
        return String(tierId) === String(tier.id);
    }) ?? [];
    if (overrides.length > 1) return null;
    if (overrides.length) return parseDirectusRaceDate(overrides[0].scheduled_at);

    const time = calendarRound.time ?? tier.time;
    return time ? parseUKDateTime(calendarRound.date, time) : null;
};
