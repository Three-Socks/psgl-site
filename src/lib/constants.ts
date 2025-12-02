import type {
    Affiliate,
} from "./types";
import { siX, siYoutube, siTwitch, siInstagram, siTiktok, siDiscord } from "simple-icons";
import SimRacingSetup from "$lib/assets/psgl-x-simracingsetup-360.png";
import { resolve } from "$app/paths";

export const NAV_LINKS = [
    { name: "Home", href: "/" },
    { name: "Standings", href: "/standings" },
    { name: "Calendars", href: "/calendars" }
] as const;

export const DEFAULT_TIMEZONE = "Europe/London";
export const DISCORD_LINK = "https://discord.gg/s9TzzCb";
export const STANDINGS_IMAGE_BASE_URL = "https://i.premiersimgl.com/standings";

export const SOCIAL_LINKS = [
    { icon: siDiscord, url: resolve("/discord"), name: "Discord" },
    { icon: siYoutube, url: "https://www.youtube.com/channel/UCJOgL44GC1W1dWLIB7Er-2w?sub_confirmation=1", name: "YouTube" },
    { icon: siTwitch, url: "https://www.twitch.tv/premiersimgl", name: "Twitch" },
    { icon: siX, url: "https://x.com/PremierSimGL", name: "X" },
    { icon: siInstagram, url: "https://www.instagram.com/premiersimgl", name: "Instagram" },
    { icon: siTiktok, url: "https://www.tiktok.com/@premiersimgl", name: "TikTok" }
];

export const LEAGUE_METADATA = {
    F1: {
        description: "Join the world's largest F1 league. With tiers for every skill level on PC & PlayStation.",
        image: "/leagues/f125.jpg",
        imageWebp: "/leagues/f125.webp"
    },
    GT: {
        description: "Experience competitive Gran Turismo 7 racing.",
        image: "/leagues/gt7.jpg",
        imageWebp: "/leagues/gt7.webp"
    },
    "E-Series": {
        description: "E-Series is a PC team event bringing the biggest and best organisations together.",
        image: "/leagues/e-series-s6.jpg",
        imageWebp: "/leagues/e-series-s6.webp"
    }
};

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
