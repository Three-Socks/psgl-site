import { getAllTiers, getLeagueSeasonByGameId } from "#lib/server/directus.ts";
import { SEASON_GAME_ID } from "$app/env/private";
import type { League, Tier } from "#lib/types.ts";
import { error } from "@sveltejs/kit";
import { building } from "$app/env";
import { getCurrentSeasonFromLeague } from "#lib/server/season.ts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    let tiers: Tier[];
    let seasonLeague: League | null;

    try {
        [tiers, seasonLeague] = await Promise.all([
            getAllTiers() as unknown as Promise<Tier[]>,
            getLeagueSeasonByGameId(SEASON_GAME_ID) as unknown as Promise<League | null>,
        ]);
    } catch (e) {
        if (building) {
            throw e;
        }
        throw error(503, "Service Unavailable: Unable to fetch data.");
    }

    return {
        tiers,
        currentSeason: getCurrentSeasonFromLeague(seasonLeague),
    };
};
