import { createDirectus, rest, authentication, readItems, isDirectusError } from "@directus/sdk";
import { DIRECTUS_URL, DIRECTUS_STATIC_TOKEN } from "$env/static/private";

export const directus = createDirectus(DIRECTUS_URL)
    .with(rest())
    .with(authentication());

if (DIRECTUS_STATIC_TOKEN) {
    directus.setToken(DIRECTUS_STATIC_TOKEN);
}

export const getAllCalendars = async () => {
    try {
        const calendar_response = await directus.request(readItems("calendars", {
            fields: ["name", "tiers.tiers_id.id", "tiers.tiers_id.name", "tiers.tiers_id.time", "tiers.tiers_id.comm_confirm", "rounds"],
            filter: {
                "_and": [
                    { "count(tiers)": { "_gt": 0 } },
                    { "_or": [
                        { archived: { _eq: false } },
                        { archived: { _null: true } },
                    ]}
                ]
            },
            sort: "-name",
            limit: -1,
        }));

        if (!calendar_response.length) {
            throw new Error("No calendars found.");
        }

        return calendar_response;
    } catch (e) {
        if (isDirectusError(e)) {
            throw new Error(`Directus Error: ${e.message}`);
        }
        throw e;
    }
};

export const getAllTiers = async () => {
    try {
        const tiers_response = await directus.request(readItems("tiers", {
            fields: ["id", "name", "sort", "time", "platform", "comm_confirm"],
            filter: {
                _and: [
                    { league: { _nnull: true } },
                    { _or: [
                        { archived: { _eq: false } },
                        { archived: { _null: true } },
                    ]}
                ]
            },
            sort: ["sort"],
            limit: -1,
        }));

        if (!tiers_response.length) {
            throw new Error("No tiers found.");
        }

        return tiers_response;
    } catch (e) {
        if (isDirectusError(e)) {
            throw new Error(`Directus Error: ${e.message}`);
        }
        throw e;
    }
};

export const getLeaguesByIds = async (ids: string[]) => {
    try {
        if (!ids.length) {
            return [];
        }

        const leagues_response = await directus.request(readItems("leagues", {
            fields: ["id", "name", "closed", "color"],
            filter: {
                id: { _in: ids }
            },
            limit: ids.length,
        }));

        if (!leagues_response.length) {
            throw new Error("No leagues found for provided IDs.");
        }

        const leagueMap = new Map(leagues_response.map((league) => [league.id, league]));
        return ids
            .map((id) => leagueMap.get(id))
            .filter((league): league is NonNullable<typeof league> => Boolean(league));
    } catch (e) {
        if (isDirectusError(e)) {
            throw new Error(`Directus Error: ${e.message}`);
        }
        throw e;
    }
};

export const getLeagueSeasonByGameId = async (gameId: string) => {
    try {
        const [seasonLeague] = await directus.request(readItems("leagues", {
            fields: ["id", "name", "standings_config", "game"],
            filter: {
                game: { _eq: gameId },
                standings_config: { _nnull: true }
            },
            limit: 1,
        }));

        if (!seasonLeague) {
            throw new Error(`No league found for game ID: ${gameId}`);
        }

        return seasonLeague;
    } catch (e) {
        if (isDirectusError(e)) {
            throw new Error(`Directus Error: ${e.message}`);
        }
        throw e;
    }
};
