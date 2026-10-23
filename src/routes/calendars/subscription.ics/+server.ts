import { parseCalendarSelections } from "#lib/calendar-subscription.ts";
import { getAllCalendars } from "#lib/server/directus.ts";
import {
    buildCalendarFeed, readCalendarPublication,
} from "#lib/server/calendar-feed.ts";
import { CALENDAR_SUBSCRIPTIONS_ENABLED } from "$app/env/private";
import type { CalendarData } from "#lib/types.ts";
import type { RequestHandler } from "./$types";

export const prerender = false;

const failure = (message: string, status: number) => new Response(message, {
    status,
    headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        ...(status === 503 ? { "Retry-After": "60" } : {}),
    },
});

export const GET: RequestHandler = async ({ url, request }) => {
    if (!CALENDAR_SUBSCRIPTIONS_ENABLED) {
        return failure("Calendar subscriptions are temporarily unavailable. Try again later.", 503);
    }
    let selections;
    try {
        if ([...url.searchParams.keys()].some((key) => key !== "selection")) {
            return failure("Invalid calendar selection.", 400);
        }
        selections = parseCalendarSelections(url.searchParams.getAll("selection"));
    } catch {
        return failure("Select tiers on the PSGL Calendars page to create a subscription URL.", 400);
    }

    try {
        const signal = AbortSignal.timeout(15_000);
        const before = await readCalendarPublication(signal);
        const calendars = await getAllCalendars(signal) as unknown as CalendarData[];
        const publication = await readCalendarPublication(signal);
        // This detects a publish command during this read, not edits awaiting publication.
        if (before.revision !== publication.revision || before.modified.getTime() !== publication.modified.getTime()) {
            return failure("Schedules are being updated. Please try again shortly.", 503);
        }
        const { body, etag } = buildCalendarFeed(calendars, selections, publication);
        const headers = {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": "inline; filename=\"psgl-schedules.ics\"",
            "Cache-Control": "public, max-age=0, s-maxage=60, must-revalidate",
            "X-Content-Type-Options": "nosniff",
            "ETag": etag,
        };
        const cached = request.headers.get("if-none-match")?.split(",").some((value) => {
            const tag = value.trim().replace(/^W\//, "");
            return tag === "*" || tag === etag;
        });
        return new Response(cached ? null : body, { status: cached ? 304 : 200, headers });
    } catch (cause) {
        console.error("Calendar subscription unavailable", cause instanceof Error ? cause.message : "Upstream request failed");
        return failure("The calendar is temporarily unavailable. Please try again later.", 503);
    }
};
