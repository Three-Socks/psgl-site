import { getAllCalendars, getLeagueSeasonByGameId } from "#lib/server/directus.ts";
import { SEASON_GAME_ID } from "$app/env/private";
import type { CalendarData, League } from "#lib/types.ts";
import { error } from "@sveltejs/kit";
import { building } from "$app/env";
import { processCalendars } from "#lib/server/calendars.ts";
import { getCurrentSeasonFromLeague } from "#lib/server/season.ts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    let calendars: CalendarData[];
    let seasonLeague: League | null;

    try {
        [calendars, seasonLeague] = await Promise.all([
            getAllCalendars() as unknown as Promise<CalendarData[]>,
            getLeagueSeasonByGameId(SEASON_GAME_ID) as unknown as Promise<League | null>,
        ]);
    } catch (e) {
        if (building) {
            throw e;
        }
        throw error(503, "Service Unavailable: Unable to fetch data.");
    }

    return {
        calendars: processCalendars(calendars),
        currentSeason: getCurrentSeasonFromLeague(seasonLeague),
    };
};
