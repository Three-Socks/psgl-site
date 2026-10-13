import { getAllCalendars, getLeaguesByIds, getSiteStats } from "#lib/server/directus.ts";
import { NEXT_FEATURED_RACE_TIER_NAMES } from "$app/env/private";
import type { CalendarData, League, HomepageLeagueCard, HomepageLeagueEntry, SiteStats } from "#lib/types.ts";
import { error } from "@sveltejs/kit";
import { building } from "$app/env";
import { HOMEPAGE_LEAGUES, HOMEPAGE_LEAGUE_IDS } from "#lib/server/league-groups.ts";
import { processCalendars } from "#lib/server/calendars.ts";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
    let calendars: CalendarData[];
    let leagues: League[];
    let stats: SiteStats;

    const featuredLeagueIds = Array.from(new Set(HOMEPAGE_LEAGUE_IDS));
    if (!featuredLeagueIds.length) {
        throw error(500, "No homepage leagues configured.");
    }

    try {
        [calendars, leagues, stats] = await Promise.all([
            getAllCalendars() as unknown as Promise<CalendarData[]>,
            getLeaguesByIds(featuredLeagueIds) as unknown as Promise<League[]>,
            getSiteStats() as unknown as Promise<SiteStats>,
        ]);
    } catch (e) {
        if (building) {
            throw e;
        }
        throw error(503, "Service Unavailable: Unable to fetch data.");
    }

    const leagueMap = new Map(leagues.map((l) => [l.id, l]));

    const displayLeagues = HOMEPAGE_LEAGUES.reduce<HomepageLeagueCard[]>((acc, league) => {
        const order: string[] = [];
        const entriesByKey = league.entries.reduce<Record<string, HomepageLeagueEntry>>((map, entry) => {
            const directusLeague = leagueMap.get(entry.id);
            if (!directusLeague) {
                return map;
            }

            const key = entry.platform?.toLowerCase() ?? entry.id;
            const candidate: HomepageLeagueEntry = {
                id: directusLeague.id,
                name: directusLeague.name,
                closed: directusLeague.closed,
                color: directusLeague.color,
                platform: entry.platform,
                phase: entry.phase,
            };

            const existing = map[key];
            if (!existing) {
                map[key] = candidate;
                order.push(key);
                return map;
            }

            const candidateIsMid = candidate.phase?.toLowerCase().includes("mid") ?? false;
            const existingIsMid = existing.phase?.toLowerCase().includes("mid") ?? false;
            const candidateOpen = !candidate.closed;
            const existingOpen = !existing.closed;

            if (candidateOpen !== existingOpen) {
                if (candidateOpen) {
                    map[key] = candidate;
                }
                return map;
            }

            if (candidateIsMid !== existingIsMid) {
                if (!candidateIsMid) {
                    map[key] = candidate;
                }
                return map;
            }

            map[key] = candidate;
            return map;
        }, {} as Record<string, HomepageLeagueEntry>);

        const entries = order
            .map((key) => entriesByKey[key])
            .filter((entry): entry is HomepageLeagueEntry => Boolean(entry));

        if (!entries.length) {
            return acc;
        }

        acc.push({
            id: league.id,
            title: league.title,
            description: league.description,
            imageWebp: league.imageWebp,
            entries,
        });

        return acc;
    }, []);

    const nextFeaturedRaceTierNames = (NEXT_FEATURED_RACE_TIER_NAMES ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter((value) => Boolean(value));

    return {
        calendars: processCalendars(calendars),
        nextRaceTierNames: nextFeaturedRaceTierNames,
        leagues: displayLeagues,
        stats,
    };
};
