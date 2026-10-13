import { DEFAULT_TIMEZONE } from "#lib/constants.ts";
import type { RaceRound, Tier } from "#lib/types.ts";

const timezoneFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: DEFAULT_TIMEZONE,
    timeZoneName: "longOffset",
});

const dateKeyFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: DEFAULT_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

export const getUKDateKey = (date: Date): string => {
    const parts = dateKeyFormatter.formatToParts(date);
    const value = (type: string) => parts.find((part) => part.type === type)?.value;
    return `${value("year")}-${value("month")}-${value("day")}`;
};

const parseUKDateTime = (date: string, time: string): Date | null => {
    const utcGuess = new Date(`${date}T${time}Z`);
    if (!Number.isFinite(utcGuess.getTime())) return null;

    const timezoneName = timezoneFormatter.formatToParts(utcGuess)
        .find((part) => part.type === "timeZoneName")?.value;
    const timezoneOffset = timezoneName === "GMT" ? "Z" : timezoneName?.replace("GMT", "");
    const parsedDate = new Date(`${date}T${time}${timezoneOffset}`);
    return Number.isFinite(parsedDate.getTime()) ? parsedDate : null;
};

export const resolveRaceDate = (calendarRound: RaceRound, tier: Pick<Tier, "id" | "time">): Date | null => {
    const override = calendarRound.overrides?.find((candidate) => {
        const tierId = typeof candidate.tier === "string" ? candidate.tier : candidate.tier.id;
        return String(tierId) === String(tier.id);
    });

    if (override) {
        const date = new Date(override.scheduled_at);
        return Number.isFinite(date.getTime()) ? date : null;
    }

    const time = calendarRound.time ?? tier.time;
    return time ? parseUKDateTime(calendarRound.date, time) : null;
};
