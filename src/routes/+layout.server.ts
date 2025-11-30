import { getAllCalendars } from '$lib/server/directus';
import { NEXT_RACE_TIER_ID } from '$env/static/private';
import type { CalendarData, RaceRound, TierData } from '$lib/types';
import { error } from '@sveltejs/kit';
import { building } from '$app/environment';
import { DEFAULT_RACE_TIME, DEFAULT_TIMEZONE } from '$lib/constants';

export const prerender = true;

export const load = async () => {
    let calendars: CalendarData[];
    try {
        calendars = await getAllCalendars() as unknown as CalendarData[];
    } catch (e) {
        console.error("Failed to load calendars:", e);
        if (building) {
            throw e;
        }
        throw error(503, "Service Unavailable: Unable to fetch calendar data.");
    }

    // Process calendars to match the frontend structure
    const processedCalendars: Record<string, CalendarData> = {};
    let nextRaceData = null;

    for (const calendar of calendars) {
        // Sort tiers by name/number if needed, but Directus might not return them sorted
        calendar.tiers.sort((a: TierData, b: TierData) => {
            return a.tiers_id.name.localeCompare(b.tiers_id.name, undefined, { numeric: true, sensitivity: 'base' });
        });

        const calendarId = calendar.name.toLowerCase().replace(/\s+/g, '-');

        processedCalendars[calendarId] = {
            name: calendar.name,
            tiers: calendar.tiers,
            rounds: calendar.rounds
        };

        // Check for next race tier
        if (NEXT_RACE_TIER_ID) {
            const hasTargetTier = calendar.tiers.some((t: TierData) => t.tiers_id.id === NEXT_RACE_TIER_ID);
            if (hasTargetTier) {
                const now = new Date();
                const upcomingRounds = calendar.rounds
                    .filter((r: RaceRound) => {
                        return new Date(r.date) >= new Date(now.toISOString().split('T')[0]);
                    })
                    .sort((a: RaceRound, b: RaceRound) => new Date(a.date).getTime() - new Date(b.date).getTime());

                if (upcomingRounds.length > 0) {
                    const nextRound = upcomingRounds[0];
                    const targetTier = calendar.tiers.find((t: TierData) => t.tiers_id.id === NEXT_RACE_TIER_ID);

                    if (targetTier) {
                        const timeStr = targetTier.tiers_id.time || DEFAULT_RACE_TIME;
                        const dateTimeStr = `${nextRound.date}T${timeStr}`;

                        // Format for display: "Wednesday 7:00 PM GMT"
                        const dateObj = new Date(dateTimeStr);
                        const dateText = dateObj.toLocaleDateString('en-GB', {
                            weekday: 'long',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                            timeZone: DEFAULT_TIMEZONE,
                            timeZoneName: 'short'
                        });

                        nextRaceData = {
                            tier: targetTier.tiers_id.name,
                            round: `Round ${nextRound.number}`,
                            track: nextRound.name.split(' - ')[1] || nextRound.name,
                            date: dateTimeStr,
                            dateText: dateText,
                            flag: nextRound.flag
                        };
                    }
                }
            }
        }
    }

    return {
        calendars: processedCalendars,
        nextRace: nextRaceData
    };
};
