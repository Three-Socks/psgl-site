<script lang="ts">
    import { DISCORD_LINK } from "$lib/constants";
    import {
        MessageSquare,
        Calendar,
        MapPin,
        Trophy,
        ArrowRight,
    } from "@lucide/svelte";
    import RealCarbonFibre from "$lib/assets/real-carbon-fibre.png";
    import { onMount } from "svelte";

    const scrollToStandings = () => {
        const element = document.getElementById("standings");
        element?.scrollIntoView({ behavior: "smooth" });
    };

    const nextRace = {
        tier: "PC F1",
        round: "Round 7",
        countryCode: "BEL",
        track: "Belgian GP",
        date: "2025-11-26T19:00:00Z", // Wednesday 7PM GMT
        dateText: "Wednesday 7:00 PM GMT"
    };

    let timeRemaining = $state("");

    const updateCountdown = () => {
        const now = new Date();
        const target = new Date(nextRace.date);
        const diff = target.getTime() - now.getTime();

        if (diff <= 0) {
            timeRemaining = "00d 00h 00m 00s";
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const d = days.toString().padStart(2, '0');
        const h = hours.toString().padStart(2, '0');
        const m = minutes.toString().padStart(2, '0');
        const s = seconds.toString().padStart(2, '0');

        timeRemaining = `${d}d ${h}h ${m}m ${s}s`;
    };

    onMount(() => {
        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);
        return () => clearInterval(interval);
    });
</script>

<section
    class="relative py-32 flex flex-col items-center justify-center overflow-x-hidden overflow-hidden"
>
    <!-- Dynamic Background Elements -->
    <div class="absolute top-0 left-0 z-0 h-screen w-full overflow-hidden pointer-events-none">
        <div class="bg-hero-gradient absolute inset-0 opacity-90"></div>
        <div
            class="absolute inset-0 opacity-20 mix-blend-screen"
            style={`background-image: url('${RealCarbonFibre}')`}
        ></div>

        <!-- Decorative Racing Lines -->
        <div
            class="bg-psgl-blue/10 absolute top-0 right-[-10%] h-full w-[40%] -skew-x-12 border-l border-white/5"
        ></div>
        <div
            class="absolute bottom-0 left-[-10%] h-full w-[30%] -skew-x-12 border-r border-white/5 bg-white/5"
        ></div>
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
                mb-8 from-psgl-blue bg-gradient-to-r to-blue-400 bg-clip-text text-transparent"
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
                    href="{DISCORD_LINK}"
                    target="_blank"
                    rel="noreferrer"
                    class="btn-primary text-lg"
                >
                    <MessageSquare class="h-5 w-5 fill-current" />
                    <span>JOIN DISCORD</span>
                </a>

                <button
                    onclick={scrollToStandings}
                    class="btn-primary text-lg"
                >
                    <Trophy class="h-5 w-5" />
                    <span>VIEW STANDINGS</span>
                </button>
            </div>
        </div>

        <!-- Right: Next Round Card -->
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
                        class="flex flex-col gap-6 bg-[length:20px_20px] p-6 md:p-8"
                    >
                        <div
                            class="flex items-start justify-between border-b border-white/10 pb-4"
                        >
                            <div>
                                <div
                                    class="text-psgl-blue mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
                                >
                                    <span class="h-2 w-2 animate-pulse bg-white"
                                    ></span>
                                    Next Race
                                </div>
                                <h3
                                    class="text-white text-2xl font-bold uppercase leading-none mb-1"
                                >
                                    {nextRace.tier}
                                </h3>
                                <p class="text-white/60 text-xs font-bold uppercase tracking-widest">
                                    {nextRace.round}
                                </p>
                            </div>
                            <div class="text-right">
                                <div
                                    class="select-none text-4xl font-bold text-white/10"
                                >
                                    {nextRace.countryCode}
                                </div>
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
                            href="/calendar"
                            class="btn-primary mt-2 w-full"
                        >
                            <span>View Full Calendar</span>
                            <ArrowRight class="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
