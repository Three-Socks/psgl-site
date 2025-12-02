import { LEAGUE_METADATA } from "$lib/constants";
import {
    LEAGUE_ID_F1_PC_MID_SIGNUP,
    LEAGUE_ID_F1_PC_SIGNUP,
    LEAGUE_ID_F1_PS_MID_SIGNUP,
    LEAGUE_ID_F1_PS_SIGNUP,
    LEAGUE_ID_GT_SIGNUP,
    LEAGUE_ID_ESERIES_SIGNUP,
} from "$env/static/private";

interface RawLeagueEntry {
    id?: string;
    platform?: string;
    phase?: string;
}

interface RawHomepageLeague {
    id: string;
    title: string;
    description: string;
    image?: string;
    imageWebp?: string;
    entries: RawLeagueEntry[];
}

function hasId(entry: RawLeagueEntry): entry is RawLeagueEntry & { id: string } {
    return typeof entry.id === "string" && entry.id.length > 0;
}

const rawLeagues: RawHomepageLeague[] = [
    {
        id: "f1",
        title: "F1",
        description: LEAGUE_METADATA.F1.description,
        image: LEAGUE_METADATA.F1.image,
        imageWebp: LEAGUE_METADATA.F1.imageWebp,
        entries: [
            { id: LEAGUE_ID_F1_PS_SIGNUP, platform: "PS", phase: "Sign Ups" },
            { id: LEAGUE_ID_F1_PS_MID_SIGNUP, platform: "PS", phase: "Mid-Season" },
            { id: LEAGUE_ID_F1_PC_SIGNUP, platform: "PC", phase: "Sign Ups" },
            { id: LEAGUE_ID_F1_PC_MID_SIGNUP, platform: "PC", phase: "Mid-Season" },
        ],
    },
    {
        id: "gt",
        title: "GT7",
        description: LEAGUE_METADATA.GT.description,
        image: LEAGUE_METADATA.GT.image,
        imageWebp: LEAGUE_METADATA.GT.imageWebp,
        entries: [
            { id: LEAGUE_ID_GT_SIGNUP, platform: "PS" },
        ],
    },
    {
        id: "e-series",
        title: "E-Series",
        description: LEAGUE_METADATA["E-Series"].description,
        image: LEAGUE_METADATA["E-Series"].image,
        imageWebp: LEAGUE_METADATA["E-Series"].imageWebp,
        entries: [
            { id: LEAGUE_ID_ESERIES_SIGNUP, platform: "PC" },
        ],
    },
];

export const HOMEPAGE_LEAGUES = rawLeagues
    .map((league) => ({
        ...league,
        entries: league.entries.filter(hasId),
    }))
    .filter((league) => league.entries.length > 0);

export const HOMEPAGE_LEAGUE_IDS = HOMEPAGE_LEAGUES.flatMap((league) => league.entries.map((entry) => entry.id));
