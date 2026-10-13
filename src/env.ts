import { defineEnvVars } from "@sveltejs/kit/env";

export const variables = defineEnvVars({
    DIRECTUS_URL: {},
    DIRECTUS_STATIC_TOKEN: { schema: (value) => value },
    SEASON_GAME_ID: { static: true },
    NEXT_FEATURED_RACE_TIER_NAMES: { static: true, schema: (value) => value },
    LEAGUE_ID_F1_PC_MID_SIGNUP: { static: true, schema: (value) => value },
    LEAGUE_ID_F1_PC_SIGNUP: { static: true, schema: (value) => value },
    LEAGUE_ID_F1_PS_MID_SIGNUP: { static: true, schema: (value) => value },
    LEAGUE_ID_F1_PS_SIGNUP: { static: true, schema: (value) => value },
    LEAGUE_ID_GT_SIGNUP: { static: true, schema: (value) => value },
    LEAGUE_ID_ESERIES_SIGNUP: { static: true, schema: (value) => value }
});
