import type { League } from "#lib/types.ts";

export function getCurrentSeasonFromLeague(seasonLeague: Pick<League, "standings_config"> | null) {
    if (!seasonLeague?.standings_config) {
        return "";
    }

    let config = seasonLeague.standings_config;
    if (typeof config === "string") {
        try {
            config = JSON.parse(config);
        } catch {
            return "";
        }
    }

    if (!Array.isArray(config) || !config[0]?.season) {
        return "";
    }

    return `Season ${config[0].season}`;
}
