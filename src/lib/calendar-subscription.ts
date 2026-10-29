export interface CalendarSelection {
    calendarId: string;
    tierId: string;
}

export const MAX_CALENDAR_SELECTIONS = 100;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const selectionKey = ({ calendarId, tierId }: CalendarSelection): string =>
    `${calendarId.toLowerCase()}:${tierId.toLowerCase()}`;

export const parseCalendarSelections = (values: string[]): CalendarSelection[] => {
    if (!values.length || values.length > MAX_CALENDAR_SELECTIONS) {
        throw new Error("Select between 1 and 100 tiers.");
    }
    const selections = new Map<string, CalendarSelection>();
    for (const value of values) {
        const [calendarId, tierId, extra] = value.split(":");
        if (!calendarId || !tierId || !uuid.test(calendarId) || !uuid.test(tierId) || extra !== undefined) {
            throw new Error("Invalid calendar selection.");
        }
        const selection = { calendarId: calendarId.toLowerCase(), tierId: tierId.toLowerCase() };
        selections.set(selectionKey(selection), selection);
    }
    return [...selections.values()].sort((a, b) => selectionKey(a).localeCompare(selectionKey(b)));
};

export const calendarSubscriptionUrl = (values: string[], origin: string): string => {
    const url = new URL("/calendars/subscription.ics", origin);
    for (const selection of parseCalendarSelections(values)) {
        url.searchParams.append("selection", selectionKey(selection));
    }
    url.searchParams.set("v", "2");
    return url.href;
};
