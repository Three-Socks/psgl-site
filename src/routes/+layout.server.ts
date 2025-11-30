import { getAllCalendars, getAllTiers } from '$lib/server/directus';
import { NEXT_RACE_TIER_ID } from '$env/static/private';
import type { CalendarData, RaceRound, CalendarTier, StandingsTier } from '$lib/types';
import { error } from '@sveltejs/kit';
import { building } from '$app/environment';
import { DEFAULT_RACE_TIME, DEFAULT_TIMEZONE } from '$lib/constants';
import { Platform, ViewType } from '$lib/types';

export const prerender = true;

export const load = async () => {
    let calendars: CalendarData[];
    let tiers: any[];

    try {
        [calendars, tiers] = await Promise.all([
            getAllCalendars() as unknown as Promise<CalendarData[]>,
            getAllTiers()
        ]);
    } catch (e) {
        console.error("Failed to load data:", e);
        if (building) {
            throw e;
        }
        throw error(503, "Service Unavailable: Unable to fetch data.");
    }

    // Process calendars to match the frontend structure
    const processedCalendars: Record<string, CalendarData> = {};
    let nextRaceData = null;

    for (const calendar of calendars) {
        // Sort tiers by name/number if needed, but Directus might not return them sorted
        calendar.tiers.sort((a: CalendarTier, b: CalendarTier) => {
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
            const hasTargetTier = calendar.tiers.some((t: CalendarTier) => t.tiers_id.id === NEXT_RACE_TIER_ID);
            if (hasTargetTier) {
                const now = new Date();
                const upcomingRounds = calendar.rounds
                    .filter((r: RaceRound) => {
                        return new Date(r.date) >= new Date(now.toISOString().split('T')[0]);
                    })
                    .sort((a: RaceRound, b: RaceRound) => new Date(a.date).getTime() - new Date(b.date).getTime());

                if (upcomingRounds.length > 0) {
                    const nextRound = upcomingRounds[0];
                    const targetTier = calendar.tiers.find((t: CalendarTier) => t.tiers_id.id === NEXT_RACE_TIER_ID);

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

    // Process tiers for standings
    const processedTiers: StandingsTier[] = tiers.map((tier: any) => {
        const platform = tier.platform?.toUpperCase() === 'PC' ? Platform.PC : Platform.PS;
        const tierName = tier.name.replace(/\s+/g, '-');

        const images = {
            [ViewType.DRIVERS]: `https://i.premiersimgl.com/standings/${tierName}-drivers-standings.png`,
            [ViewType.CONSTRUCTORS]: `https://i.premiersimgl.com/standings/${tierName}-constructors-standings.png`,
            [ViewType.RESULTS]: `https://i.premiersimgl.com/standings/${tierName}-results.png`,
        };

        return {
            id: tier.id,
            name: tier.name,
            platform,
            time: tier.time,
            comm_confirm: tier.comm_confirm,
            images
        };
    });

    return {
        calendars: processedCalendars,
        nextRace: nextRaceData,
        tiers: processedTiers
    };
};
