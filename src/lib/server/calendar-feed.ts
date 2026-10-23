import { createHash } from "node:crypto";
import { readItem, withOptions } from "@directus/sdk";
import { directus } from "#lib/server/directus.ts";
import { SITE_URL } from "#lib/constants.ts";
import { resolveRaceDate } from "#lib/race-date.ts";
import type { CalendarData } from "#lib/types.ts";
import type { CalendarSelection } from "#lib/calendar-subscription.ts";

export interface CalendarPublication {
    revision: number;
    modified: Date;
}

export const readCalendarPublication = async (signal: AbortSignal): Promise<CalendarPublication> => {
    // Read the real row: the singleton endpoint supplies defaults when no row exists.
    const state = await directus.request(withOptions(readItem("calendar_feed_state", 1, {
        fields: ["revision", "last_changed"],
    }), { signal, cache: "no-store" })) as { revision?: unknown; last_changed?: unknown } | null;
    const revision = state?.revision;
    const timestamp = state?.last_changed;
    if (typeof revision !== "number" || !Number.isInteger(revision) || revision < 1 || revision > 2_147_483_647
        || typeof timestamp !== "string"
        || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})$/.test(timestamp)) {
        throw new Error("Calendar publication state is missing or invalid.");
    }
    const modified = new Date(timestamp);
    if (!Number.isFinite(modified.getTime())) throw new Error("Calendar publication timestamp is invalid.");
    return { revision, modified };
};

const escapeText = (value: string): string => value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\p{Cc}/gu, (character) => character === "\t" ? character : "");

const utcDate = (date: Date): string => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");

// Fold by UTF-8 bytes, retaining whole characters and counting continuation spaces.
const foldLine = (line: string): string => {
    let result = "";
    let bytes = 0;
    for (const character of line) {
        const size = Buffer.byteLength(character, "utf8");
        if (bytes + size > 75) {
            result += "\r\n ";
            bytes = 1;
        }
        result += character;
        bytes += size;
    }
    return result;
};

export const buildCalendarFeed = (
    calendars: CalendarData[], selections: CalendarSelection[], publication: CalendarPublication,
): { body: string; etag: string } => {
    const events = [];
    const stamp = utcDate(publication.modified);
    const names = new Set<string>();
    for (const selection of selections) {
        const calendar = calendars.find((candidate) => candidate.id === selection.calendarId);
        const tier = calendar?.tiers?.find((relation) => relation?.tiers_id?.id === selection.tierId)?.tiers_id;
        if (!calendar || !tier?.name) continue;
        names.add(calendar.name);

        const rounds = calendar.calendar_rounds;
        if (!rounds?.length) continue;
        const ids = new Set<string>();
        for (const round of rounds) {
            const number = String(round.number ?? "").trim();
            if (!round.id || ids.has(round.id)) {
                throw new Error("Calendar round identity is invalid.");
            }
            ids.add(round.id);
            const start = resolveRaceDate(round, tier);
            if (!start) {
                // Never silently drop a cancellation whose original time has been lost.
                if (round.cancelled_at) throw new Error("Cancelled round needs its original start time.");
                continue;
            }
            if (!number || !round.name) continue;

            const source = new URL("/calendars", SITE_URL);
            source.searchParams.set("calendar_id", calendar.id);
            source.hash = `round-${round.id}`;
            const title = `${tier.name} · ${round.preseason ? "Preseason" : "Round"} ${number} · ${round.name}`;
            const cancelled = Boolean(round.cancelled_at);
            const description = cancelled
                ? `${calendar.name}\nCancelled: ${round.cancellation_reason || "This round has been cancelled."}\nThe start time is the original schedule.`
                : `${calendar.name}\nRace start time.`;
            events.push({
                key: `${calendar.id}:${round.id}:${tier.id}`,
                start: start.getTime(),
                lines: [
                    "BEGIN:VEVENT",
                    `UID:psgl-${calendar.id}-${round.id}-${tier.id}@premiersimgl.com`,
                    `DTSTAMP:${stamp}`,
                    `LAST-MODIFIED:${stamp}`,
                    `SEQUENCE:${publication.revision}`,
                    `DTSTART:${utcDate(start)}`,
                    `SUMMARY:${escapeText(cancelled ? `Cancelled · ${title}` : title)}`,
                    `STATUS:${cancelled ? "CANCELLED" : "CONFIRMED"}`,
                    `DESCRIPTION:${escapeText(description)}`,
                    `URL:${source.href}`,
                    "END:VEVENT",
                ],
            });
        }
    }
    events.sort((a, b) => a.start - b.start || a.key.localeCompare(b.key));
    const lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//PSGL//Tier schedules//EN",
        "CALSCALE:GREGORIAN",
        `NAME:${escapeText(`PSGL · ${[...names].join(" / ") || "Tier schedules"}`)}`,
        `X-WR-CALNAME:${escapeText(`PSGL · ${[...names].join(" / ") || "Tier schedules"}`)}`,
        "REFRESH-INTERVAL;VALUE=DURATION:PT1H",
        ...events.flatMap((event) => event.lines),
        "END:VCALENDAR",
    ];
    const body = lines.map(foldLine).join("\r\n") + "\r\n";
    return { body, etag: `"${createHash("sha256").update(body).digest("hex")}"` };
};
