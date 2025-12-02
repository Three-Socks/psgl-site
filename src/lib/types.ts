export enum Platform {
    PC = "PC",
    PS = "PS"
}

export interface HomepageLeagueEntry extends Pick<League, "id" | "name" | "closed" | "color"> {
    platform?: string;
    phase?: string;
}

export interface HomepageLeagueCard {
    id: string;
    title: string;
    description: string;
    imageWebp?: string;
    image?: string;
    entries: HomepageLeagueEntry[];
}

export interface StandingsConfig {
    season: string;
}

export interface League {
    id: string;
    name: string;
    closed: boolean;
    standings_config?: StandingsConfig[] | string;
    color?: string;
    game?: string;
}

export enum ViewType {
    DRIVERS = "Drivers Standings",
    CONSTRUCTORS = "Constructors",
    RESULTS = "Round Results"
}

export interface Tier {
    id: string;
    name: string;
    platform: Platform;
    time?: string;
    comm_confirm?: boolean;
}

export interface Affiliate {
    name: string;
    link: string;
    partner?: boolean;
    logoPath?: string;
    description?: string;
    code?: string;
    discount?: string;
}

export interface RaceRound {
    date: string;
    flag: string;
    name: string;
    number: string;
    race_confirm_sent?: boolean;
    schedule_date?: string;
    short_name?: string;
    countryCode?: string;
}

export interface CalendarTier {
    tiers_id: Tier;
}

export interface CalendarData {
    name: string;
    tiers: CalendarTier[];
    rounds: RaceRound[];
}

export interface SiteStats {
    driver_count: number;
    races_completed: number;
    member_count: number;
    tier_count: number;
}
