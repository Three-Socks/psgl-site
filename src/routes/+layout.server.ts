import { getAllCalendars, getAllTiers, getLeaguesByIds, getLeagueSeasonByGameId, getSiteStats } from "$lib/server/directus";
import { SEASON_GAME_ID, NEXT_FEATURED_RACE_TIER_NAMES } from "$env/static/private";
import type { CalendarData, Tier, CalendarTier, League, HomepageLeagueCard, HomepageLeagueEntry, SiteStats } from "$lib/types";
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
    let stats: SiteStats;

    const featuredLeagueIds = Array.from(new Set(HOMEPAGE_LEAGUE_IDS));
    if (!featuredLeagueIds.length) {
        throw error(500, "No homepage leagues configured.");
    }

    try {
        [calendars, tiers, leagues, seasonLeague, stats] = await Promise.all([
            getAllCalendars() as unknown as Promise<CalendarData[]>,
            getAllTiers() as unknown as Promise<Tier[]>,
            getLeaguesByIds(featuredLeagueIds) as unknown as Promise<League[]>,
            getLeagueSeasonByGameId(SEASON_GAME_ID) as unknown as Promise<League>,
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

            if (existingIsMid || !candidateIsMid) {
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
            image: league.image,
            imageWebp: league.imageWebp,
            entries,
        });

        return acc;
    }, []);

    // Process calendars to match the frontend structure
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
            name: calendar.name,
            tiers: validTiers,
            rounds: calendar.rounds ?? []
        };
    }

    const nextFeaturedRaceTierNames = (NEXT_FEATURED_RACE_TIER_NAMES ?? "")
        .split(",")
        .map((value) => value.trim())
        .filter((value) => Boolean(value));

    return {
        calendars: processedCalendars,
        nextRaceTierNames: nextFeaturedRaceTierNames,
        tiers: tiers,
        timeZoneName: getTimeZoneName(),
        leagues: displayLeagues,
        currentSeason: getCurrentSeasonFromLeague(seasonLeague),
        stats,
    };
};
