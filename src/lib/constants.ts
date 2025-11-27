import { Category, Platform, ViewType } from './types';
import type {
    League,
    Affiliate,
    StatItem,
    Tier,
    RaceRound,
    ScheduleTier,
    CalendarConfig,
} from './types';
import { Users, Trophy, Video, Activity } from '@lucide/svelte';
import { siX, siYoutube, siTwitch, siInstagram, siTiktok, siDiscord } from 'simple-icons';
import SimRacingSetup from "$lib/assets/psgl-x-simracingsetup-360.png";

export const DISCORD_LINK = "https://premiersimgl.com/discord";

export const SOCIAL_LINKS = [
    { icon: siDiscord, url: "https://premiersimgl.com/discord", name: "Discord" },
    { icon: siYoutube, url: "https://www.youtube.com/channel/UCJOgL44GC1W1dWLIB7Er-2w?sub_confirmation=1", name: "YouTube" },
    { icon: siTwitch, url: "https://www.twitch.tv/premiersimgl", name: "Twitch" },
    { icon: siX, url: "https://x.com/PremierSimGL", name: "X" },
    { icon: siInstagram, url: "https://www.instagram.com/premiersimgl", name: "Instagram" },
    { icon: siTiktok, url: "https://www.tiktok.com/@premiersimgl", name: "TikTok" }
];

export const LEAGUES: League[] = [
    {
        name: "F1 25 Season 40",
        description: "Join the world's largest F1 league. With tiers for every skill level on PC & PlayStation.",
        image: "/leagues/f125.jpg",
        imageWebp: "/leagues/f125.webp",
        signupsOpen: true
    },
    {
        name: "F1 PSGL E-Series S6",
        description: "E-Series is a PC team event bringing the biggest and best organisations together.",
        image: "/leagues/e-series-s6.jpg",
        imageWebp: "/leagues/e-series-s6.webp",
        signupsOpen: false
    },
    {
        name: "GT7",
        description: "Experience competitive Gran Turismo 7 racing.",
        image: "/leagues/gt7.jpg",
        imageWebp: "/leagues/gt7.webp",
        signupsOpen: true
    }
];

// Helper to generate many tiers
const generateTiers = (): Tier[] => {
  const tiers: Tier[] = [];

  // PC Tiers
  const pcTiers = 16;
  for (let i = 1; i <= pcTiers; i++) {
    tiers.push({
      id: `pc-f1-tier-${i}`,
      name: `PC F${i}`,
      platform: Platform.PC,
      category: Category.F1,
      isLiveStreamed: i <= 3, // Top 3 tiers are live
      images: {
        [ViewType.DRIVERS]: `https://i.premiersimgl.com/standings/PC-F${i}-drivers-standings.png`,
        [ViewType.CONSTRUCTORS]: `https://i.premiersimgl.com/standings/PC-F${i}-constructors-standings.png`,
        [ViewType.RESULTS]: `https://i.premiersimgl.com/standings/PC-F${i}-results.png`,
      }
    });
  }

  // PS Tiers
  const psTiers = 14;
  for (let i = 1; i <= psTiers; i++) {
    tiers.push({
      id: `ps-f1-tier-${i}`,
      name: `PS F${i}`,
      platform: Platform.PS,
      category: Category.F1,
      isLiveStreamed: i <= 2,
      images: {
        [ViewType.DRIVERS]: `https://i.premiersimgl.com/standings/PS-F${i}-drivers-standings.png`,
        [ViewType.CONSTRUCTORS]: `https://i.premiersimgl.com/standings/PS-F${i}-constructors-standings.png`,
        [ViewType.RESULTS]: `https://i.premiersimgl.com/standings/PS-F${i}-results.png`,
      }
    });
  }

  return tiers;
};

export const LEAGUE_DATA = generateTiers();

export const STATS: StatItem[] = [
  { label: 'Active Drivers', value: '3,500+', icon: Users },
  { label: 'Races Completed', value: '12,400', icon: Trophy },
  { label: 'Live Views', value: '2.5M+', icon: Video },
  { label: 'Discord Members', value: '15K+', icon: Activity },
];

export const PARTNERS: Affiliate[] = [
  {
    name: "SimRacing Setups",
    partner: true,
    logoPath: SimRacingSetup,
    description: "Unlock Our Pro Fl 25 Car Setups & Strategies.\nSetups Created by PSGL drivers & Engineers.",
    link: "https://simracingsetup.com/product/f1/f1-25-setup-bundle/?ref=psgl",
    code: "PSGL",
    discount: "5% OFF"
  },
];

export const AFFILIATE_LINKS: Affiliate[] = [
  {
    name: "GT Omega",
    link: "https://www.gtomega.co.uk/?rfsn=6685710.a59c6dc&utm_source=refersion&utm_medium=PSGL",
    code: "PSGL",
    discount: "5% OFF"
  }
];

export const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Standings", href: "/standings" },
  { name: "Calendar", href: "/calendar" }
];

export const BASE_ROUNDS: RaceRound[] = [
  { date: "2025-10-23", flag: "au", name: "Australia - Albert Park", number: "1", countryCode: "AUS", race_confirm_sent: true, schedule_date: "2025-10-19T13:00:00" },
  { date: "2025-10-30", flag: "be", name: "Belgium - Spa-Francorchamps", number: "2", countryCode: "BEL", race_confirm_sent: true },
  { date: "2025-11-06", flag: "us", name: "United States - COTA", number: "3", countryCode: "USA", race_confirm_sent: true, short_name: "Texas" },
  { date: "2025-11-20", flag: "mc", name: "Monaco - Circuit de Monaco", number: "4", countryCode: "MCO", race_confirm_sent: true },
  { date: "2025-11-27", flag: "at", name: "Austria - Red Bull Ring", number: "5", countryCode: "AUT", race_confirm_sent: true },
  { date: "2025-12-04", flag: "ca", name: "Canada - Circuit Gilles Villeneuve", number: "6", countryCode: "CAN" },
  { date: "2025-12-11", flag: "gb", name: "Britain - Silverstone", number: "7", countryCode: "GBR" },
  { date: "2025-12-18", flag: "mx", name: "Mexico - Autodromo Hermanos Rodriguez", number: "8", countryCode: "MEX" },
  { date: "2026-01-08", flag: "sa", name: "Saudi Arabia - Jeddah Corniche Circuit", number: "9", countryCode: "KSA" },
  { date: "2026-01-15", flag: "br", name: "Brazil - Interlagos Circuit", number: "10", countryCode: "BRA" },
  { date: "2026-01-22", flag: "ae", name: "Abu Dhabi - Yas Marina Circuit", number: "11", countryCode: "UAE" }
];

const shiftDate = (dateStr: string, days: number) => {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
};

const offsetRounds = (rounds: RaceRound[], days: number) =>
  rounds.map((round) => ({ ...round, date: shiftDate(round.date, days) }));

const THURSDAY_TIERS: ScheduleTier[] = [
  { name: "PC F2", time: "7:00 PM", comm_confirm: true },
  { name: "PC F3", time: "7:00 PM", comm_confirm: true },
  { name: "PC F4", time: "7:00 PM" },
  { name: "PC F5", time: "7:00 PM" },
  { name: "PC F6", time: "7:00 PM" },
  { name: "PC F7", time: "7:00 PM" },
  { name: "PC F8", time: "7:00 PM" },
  { name: "PC F9", time: "8:00 PM" },
  { name: "PC F10", time: "8:00 PM" },
  { name: "PC F11", time: "8:00 PM" },
  { name: "PC F12", time: "8:00 PM" },
  { name: "PC F13", time: "8:00 PM" },
  { name: "PC F14", time: "8:00 PM" },
  { name: "PC F15", time: "8:00 PM" },
  { name: "PC F16", time: "8:00 PM" }
];

const MONDAY_TIERS: ScheduleTier[] = [
  { name: "PS F1", time: "7:00 PM", comm_confirm: true },
  { name: "PS F2", time: "7:00 PM", comm_confirm: true },
  { name: "PS F3", time: "7:00 PM" },
  { name: "PS F4", time: "7:00 PM" },
  { name: "PS F5", time: "7:00 PM" },
  { name: "PS F6", time: "7:00 PM" },
  { name: "PS F7", time: "7:00 PM" },
  { name: "PS F8", time: "7:00 PM" },
  { name: "PS F9", time: "8:00 PM" },
  { name: "PS F10", time: "8:00 PM" },
  { name: "PS F11", time: "8:00 PM" },
  { name: "PS F12", time: "8:00 PM" },
  { name: "PS F13", time: "8:00 PM" },
  { name: "PS F14", time: "8:00 PM" },
  { name: "PS F15", time: "8:00 PM" },
  { name: "PS F16", time: "8:00 PM" }
];

export const CALENDAR_CONFIGS: Record<string, CalendarConfig> = {
  wednesday: {
    id: "wednesday",
    name: "Wednesday",
    platform: "PC F1",
    tiers: [{ name: "PC F1", time: "7:00 PM", comm_confirm: true },],
    rounds: BASE_ROUNDS,
  },
  thursday: {
    id: "thursday",
    name: "Thursday",
    platform: "PC",
    tiers: THURSDAY_TIERS,
    rounds: BASE_ROUNDS
  },
  monday: {
    id: "monday",
    name: "Monday",
    platform: "PlayStation",
    tiers: MONDAY_TIERS,
    rounds: offsetRounds(BASE_ROUNDS, -3)
  }
};
