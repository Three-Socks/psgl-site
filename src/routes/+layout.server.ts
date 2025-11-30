import { getAllCalendars, getAllTiers, getLeaguesByIds, getLeagueSeasonByGameId } from "$lib/server/directus";
import { SEASON_GAME_ID, NEXT_RACE_TIER_ID } from "$env/static/private";
import type { CalendarData, Tier, CalendarTier, League, HomepageLeagueCard, HomepageLeagueEntry } from "$lib/types";
import { error } from "@sveltejs/kit";
import { building } from "$app/environment";
import { DEFAULT_TIMEZONE } from "$lib/constants";
import { HOMEPAGE_LEAGUES, HOMEPAGE_LEAGUE_IDS } from "$lib/server/league-groups";

export const prerender = true;

// Resolve the current timezone name (e.g. GMT, BST)
function getTimeZoneName() {
    const now = new Date();
    const timeZoneFormatter = new Intl.DateTimeFormat("en-GB", {
        timeZone: DEFAULT_TIMEZONE,
        timeZoneName: "short"
    });
    const timeZoneParts = timeZoneFormatter.formatToParts(now);
    const timeZoneName =
        timeZoneParts.find((part) => part.type === "timeZoneName")?.value ?? "UK";

    return timeZoneName;
}

// Process leagues and extract current season
function getCurrentSeasonFromLeague(seasonLeague: Pick<League, "standings_config">) {
    if (!seasonLeague.standings_config) {
        throw error(500, "League standings_config is missing");
    }

    let config = seasonLeague.standings_config;
    if (typeof config === "string") {
        try {
            config = JSON.parse(config);
        } catch {
            throw error(500, "Failed to parse standings_config JSON");
        }
    }

    if (!Array.isArray(config) || config.length === 0 || !config[0].season) {
        throw error(500, "Invalid or empty standings_config structure");
    }

    return `Season ${config[0].season}`;
}

export const load = async () => {
    let calendars: CalendarData[];
    let tiers: Tier[];
    let leagues: League[];
    let seasonLeague: League;

    const featuredLeagueIds = Array.from(new Set(HOMEPAGE_LEAGUE_IDS));
    if (!featuredLeagueIds.length) {
        throw error(500, "No homepage leagues configured.");
    }

    try {

        [calendars, tiers, leagues, seasonLeague] = await Promise.all([
            getAllCalendars() as unknown as Promise<CalendarData[]>,
            getAllTiers() as unknown as Promise<Tier[]>,
            getLeaguesByIds(featuredLeagueIds) as unknown as Promise<League[]>,
            getLeagueSeasonByGameId(SEASON_GAME_ID) as unknown as Promise<League>,
        ]);
    } catch (e) {
        if (building) {
            throw e;
        }
        throw error(503, "Service Unavailable: Unable to fetch data.");
    }

    const leagueMap = new Map(leagues.map((l) => [l.id, l]));

    const displayLeagues = HOMEPAGE_LEAGUES.reduce<HomepageLeagueCard[]>((acc, league) => {
        const entries = league.entries.reduce<HomepageLeagueEntry[]>((entryAcc, entry) => {
            const directusLeague = leagueMap.get(entry.id);
            if (!directusLeague) {
                return entryAcc;
            }

            entryAcc.push({
                id: directusLeague.id,
                name: directusLeague.name,
                closed: directusLeague.closed,
                color: directusLeague.color,
                platform: entry.platform,
                phase: entry.phase,
            });

            return entryAcc;
        }, []);

        if (!entries.length) {
            return acc;
        }

        acc.push({
            id: league.id,
            title: league.title,
            description: league.description,
            image: league.image,
            imageWebp: league.imageWebp,
            entries,
        });

        return acc;
    }, []);

    // Process calendars to match the frontend structure
    const processedCalendars: Record<string, CalendarData> = {};

    for (const calendar of calendars) {
        // Sort tiers by name/number if needed, but Directus might not return them sorted
        calendar.tiers.sort((a: CalendarTier, b: CalendarTier) => {
            return a.tiers_id.name.localeCompare(b.tiers_id.name, undefined, { numeric: true, sensitivity: "base" });
        });

        const calendarId = calendar.name.toLowerCase().replace(/\s+/g, "-");

        processedCalendars[calendarId] = {
            name: calendar.name,
            tiers: calendar.tiers,
            rounds: calendar.rounds
        };

    }

    return {
        calendars: processedCalendars,
        nextRaceTierId: NEXT_RACE_TIER_ID ?? null,
        tiers: tiers,
        timeZoneName: getTimeZoneName(),
        leagues: displayLeagues,
        currentSeason: getCurrentSeasonFromLeague(seasonLeague),
    };
};
