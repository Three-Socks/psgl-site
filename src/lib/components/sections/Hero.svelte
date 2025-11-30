<script lang="ts">
    import {
        Calendar,
        MapPin,
        Trophy,
        ArrowRight,
    } from "@lucide/svelte";
    import { siDiscord } from "simple-icons";
    import RealCarbonFibre from "$lib/assets/real-carbon-fibre.png";
    import { onMount } from "svelte";
    import { resolve } from "$app/paths";
    import type { CalendarData } from "$lib/types";
    import { DEFAULT_TIMEZONE } from "$lib/constants";

    type NextRace = {
        tier: string;
        round: string;
        track: string;
        date: string;
        dateText: string;
        flag: string;
    };

    const props = $props<{ calendars: Record<string, CalendarData>; nextRaceTierId?: string | null }>();
    let { calendars, nextRaceTierId } = props;

    let nextRace = $state<NextRace | null>(null);

    let timeRemaining = $state("");
    let isLive = $state(false);

    const computeNextRace = (): NextRace | null => {
        if (!nextRaceTierId) return null;
        const calendarEntries = Object.values(calendars ?? {}) as CalendarData[];
        if (!calendarEntries.length) return null;

        for (const calendar of calendarEntries) {
            const targetTier = calendar.tiers.find((t) => t.tiers_id.id === nextRaceTierId);
            if (!targetTier || !targetTier.tiers_id.time) continue;

            const upcomingRounds = calendar.rounds
                .map((round) => {
                    const dateTimeStr = `${round.date}T${targetTier.tiers_id.time}`;
                    return {
                        round,
                        dateTimeStr,
                        date: new Date(dateTimeStr)
                    };
                })
                .filter(({ date }) => date.getTime() >= Date.now())
                .sort((a, b) => a.date.getTime() - b.date.getTime());

            if (!upcomingRounds.length) {
                continue;
            }

            const { round, dateTimeStr } = upcomingRounds[0];
            const dateText = new Date(dateTimeStr).toLocaleDateString("en-GB", {
                weekday: "long",
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
                timeZone: DEFAULT_TIMEZONE,
                timeZoneName: "short"
            });

            return {
                tier: targetTier.tiers_id.name,
                round: `Round ${round.number}`,
                track: round.name.split(" - ")[1] || round.name,
                date: dateTimeStr,
                dateText,
                flag: round.flag
            };
        }

        return null;
    };

    const setNextRace = () => {
        nextRace = computeNextRace();
    };

    const updateCountdown = () => {
        if (!nextRace?.date) return;

        const now = new Date();
        const target = new Date(nextRace.date);
        const diff = target.getTime() - now.getTime();

        // Check if live (race started less than 2 hours ago)
        const twoHours = 2 * 60 * 60 * 1000;
        if (diff <= 0 && Math.abs(diff) < twoHours) {
            isLive = true;
            timeRemaining = "LIVE NOW";
            return;
        }

        isLive = false;

        if (diff <= -twoHours) {
            setNextRace();
            updateCountdown();
            return;
        }

        if (diff <= 0) {
            timeRemaining = "00d 00h 00m 00s";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const d = days.toString().padStart(2, "0");
        const h = hours.toString().padStart(2, "0");
        const m = minutes.toString().padStart(2, "0");
        const s = seconds.toString().padStart(2, "0");

        timeRemaining = `${d}d ${h}h ${m}m ${s}s`;
    };

    onMount(() => {
        setNextRace();
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    });
</script>

<svelte:head>
    {#if nextRace?.flag}
        <link rel="preload" as="image" href={`https://flagcdn.com/${nextRace.flag}.svg`} />
    {/if}
</svelte:head>

<section
    class="relative py-32 flex flex-col items-center justify-center overflow-x-hidden overflow-hidden min-h-screen lg:min-h-0"
>
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <!-- Background Container -->
        <div class="absolute top-0 left-0 w-full h-full lg:h-screen overflow-hidden pointer-events-none">
            <div class="bg-hero-gradient absolute inset-0 opacity-90"></div>
            <div
                class="absolute inset-0 opacity-20 mix-blend-screen"
                style={`background-image: url('${RealCarbonFibre}')`}
            ></div>

            <!-- Decorative Racing Lines -->
            <div
                class="bg-psgl-blue/10 absolute top-0 right-[-10%] h-full w-[40%] -skew-x-12 origin-top border-l border-white/5"
            ></div>
            <div
                class="absolute bottom-0 left-[-10%] h-full w-[30%] -skew-x-12 origin-top border-r border-white/5 bg-white/5"
            ></div>
        </div>
    </div>
    <div
        class="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 lg:grid-cols-12"
    >
        <!-- Left: Main Text -->
        <div class="flex flex-col items-start text-left lg:col-span-7">
            <h1
                class="text-6xl font-black uppercase leading-none tracking-tight text-white drop-shadow-2xl md:text-6xl lg:text-7xl"
            >
                Premier Sim
            </h1>
            <h1
                class="text-6xl font-black uppercase leading-none tracking-tight drop-shadow-2xl md:text-6xl lg:text-7xl
                mb-8 from-psgl-blue bg-linear-to-r to-blue-400 bg-clip-text text-transparent"
            >
                Gaming Leagues
            </h1>

            <p
                class="border-psgl-blue mb-10 max-w-xl border-l-4 pl-6 py-1 text-lg font-light text-gray-300 md:text-xl"
            >
                The world's largest Formula 1 league on PlayStation & PC.
            </p>

            <div
                class="mb-8 flex w-full flex-col gap-4 sm:mb-0 sm:w-auto sm:flex-row"
            >
                <a
                    href={resolve("/discord")}
                    target="_blank"
                    class="btn-primary text-lg"
                >
                    <svg role="img" viewBox="0 0 24 24" class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                        <title>{siDiscord.title}</title>
                        <path d={siDiscord.path} />
                    </svg>
                    <span>JOIN DISCORD</span>
                </a>

                <a
                    href={resolve("/standings")}
                    class="btn-primary text-lg"
                >
                    <Trophy class="h-5 w-5" />
                    <span>VIEW STANDINGS</span>
                </a>
            </div>
        </div>

        <!-- Right: Next Round Card -->
        {#if nextRace}
        <div
            class="animate-in fade-in slide-in-from-right duration-1000 mt-8 w-full lg:col-span-5 lg:mt-0"
        >
            <div class="relative">
                <!-- Card Background effects -->
                <div
                    class="bg-psgl-blue/20 absolute inset-0 blur-3xl rounded-full opacity-30"
                ></div>

                <div
                    class="relative border border-white/10 bg-black/40 p-1 backdrop-blur-md"
                >
                    <!-- Decorative corners -->
                    <div
                        class="border-psgl-blue absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2"
                    ></div>
                    <div
                        class="border-psgl-blue absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2"
                    ></div>
                    <div
                        class="border-psgl-blue absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2"
                    ></div>
                    <div
                        class="border-psgl-blue absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2"
                    ></div>

                    <!-- Content -->
                    <div
                        class="flex flex-col gap-6 bg-size-[20px_20px] p-6 md:p-8"
                    >
                        <div
                            class="flex items-start justify-between border-b border-white/10 pb-4"
                        >
                            <div>
                                <div
                                    class="text-psgl-blue mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                                >
                                    <span class={`h-2 w-2 ${isLive ? "bg-red-500 animate-ping" : "bg-white animate-pulse"}`}
                                    ></span>
                                    {isLive ? "LIVE NOW" : "Next Race"}
                                </div>
                                <div
                                    class="text-white text-2xl font-bold uppercase leading-none mb-1"
                                >
                                    {nextRace.tier}
                                </div>
                                <p class="text-white/60 text-xs font-bold uppercase tracking-widest">
                                    {nextRace.round}
                                </p>
                            </div>
                            <div class="text-right">
                                <img
                                    src={`https://flagcdn.com/${nextRace.flag}.svg`}
                                    alt={nextRace.flag}
                                    class="w-16 h-10 object-cover shadow-lg border border-white/10 ml-auto"
                                />
                                <div class="text-psgl-blue font-mono text-sm font-bold mt-1">
                                    {timeRemaining}
                                </div>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div class="group flex items-center gap-4">
                                <div
                                    class="bg-white/5 group-hover:bg-psgl-blue group-hover:border-psgl-blue flex h-12 w-12 items-center justify-center border border-white/10 transition-colors"
                                >
                                    <MapPin
                                        class="h-6 w-6 text-gray-400 group-hover:text-white"
                                    />
                                </div>
                                <div>
                                    <p
                                        class="text-xs font-bold uppercase tracking-widest text-gray-500"
                                    >
                                        Track
                                    </p>
                                    <p class="text-xl uppercase text-white">
                                        {nextRace.track}
                                    </p>
                                </div>
                            </div>

                            <div class="group flex items-center gap-4">
                                <div
                                    class="bg-white/5 group-hover:bg-psgl-blue group-hover:border-psgl-blue flex h-12 w-12 items-center justify-center border border-white/10 transition-colors"
                                >
                                    <Calendar
                                        class="h-6 w-6 text-gray-400 group-hover:text-white"
                                    />
                                </div>
                                <div>
                                    <p
                                        class="text-xs font-bold uppercase tracking-widest text-gray-500"
                                    >
                                        Date & Time
                                    </p>
                                    <p class="text-xl uppercase text-white">
                                        {nextRace.dateText}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <a
                            href={resolve("/calendars")}
                            class="btn-primary mt-2 w-full"
                        >
                            <span>View Full Calendar</span>
                            <ArrowRight class="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
        {/if}
    </div>
</section>
