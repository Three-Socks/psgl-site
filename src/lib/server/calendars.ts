import type { CalendarData, CalendarTier } from "#lib/types.ts";

export function processCalendars(calendars: CalendarData[]): Record<string, CalendarData> {
    const processedCalendars: Record<string, CalendarData> = {};

    for (const calendar of calendars) {
        const calendarTiers = Array.isArray(calendar.tiers) ? calendar.tiers : [];
        const validTiers = calendarTiers.filter(
            (tier): tier is CalendarTier => Boolean(tier?.tiers_id?.name)
        );

        validTiers.sort((a: CalendarTier, b: CalendarTier) => {
            return a.tiers_id.name.localeCompare(b.tiers_id.name, undefined, { numeric: true, sensitivity: "base" });
        });

        const calendarSlugId = calendar.name.toLowerCase().replace(/\s+/g, "-");

        processedCalendars[calendarSlugId] = {
            id: calendar.id,
            name: calendar.name,
            tiers: validTiers,
            rounds: [...(calendar.calendar_rounds ?? [])].sort((a, b) => a.sort - b.sort)
        };
    }

    return processedCalendars;
}
