import { DEFAULT_TIMEZONE } from "$lib/constants";
import type { RaceRound, Tier } from "$lib/types";

const timezoneFormatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: DEFAULT_TIMEZONE,
    timeZoneName: "longOffset",
});

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
