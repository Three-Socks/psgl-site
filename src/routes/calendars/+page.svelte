<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import { Calendar, Users } from "@lucide/svelte";
    import PageShell from "$lib/components/layout/PageShell.svelte";
    import PageSection from "$lib/components/layout/PageSection.svelte";
    import SectionHeader from "$lib/components/layout/SectionHeader.svelte";
    import type { CalendarData } from "$lib/types";
    import { SvelteMap } from "svelte/reactivity";

    let { data } = $props();
    const calendars = data.calendars as Record<string, CalendarData>;
    const timeZoneName = $derived(data.timeZoneName);
    const currentSeason = $derived(data.currentSeason);

    let activeCalendarSlugId = $state<string>(Object.keys(calendars)[0] || "");
    let activeCalendar = $derived(calendars[activeCalendarSlugId]);
    let activeRounds = $derived(activeCalendar.rounds);
    let activeRoundIndex = $state(-1);

    const tiersByTime = (tiers: CalendarData["tiers"]) => {
        const timeMap = new SvelteMap<string, typeof tiers>();
        tiers.forEach((tierData) => {
            const time = tierData.tiers_id.time;
            if (time) {
                timeMap.set(time, [...(timeMap.get(time) ?? []), tierData]);
            }
        });
        return Array.from(timeMap.entries())
            .map(([time, groupedTiers]) => ({ time, tiers: groupedTiers }))
            .sort((a, b) => a.time.localeCompare(b.time, undefined, { numeric: true, sensitivity: "base" }));
    };

    let tierBlocks = $derived(tiersByTime(activeCalendar.tiers));

    let hasSyncedCalendarFromUrl = $state(false);

    const applyCalendarFromUrl = () => {
        if (!browser) return;
        const params = new URLSearchParams(window.location.search);
        const calendarParam = params.get("calendar");
        if (calendarParam && calendars[calendarParam]) {
            activeCalendarSlugId = calendarParam;
        }
    };

    const updateCalendarQueryParams = (calendarSlugId: string) => {
        if (!browser) return;
        const url = new URL(window.location.href);
        if (calendarSlugId) {
            url.searchParams.set("calendar", calendarSlugId);
        } else {
            url.searchParams.delete("calendar");
        }
        const query = url.searchParams.toString();
        const nextUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
        window.history.replaceState(window.history.state, "", nextUrl);
    };

    const formatTime = (timeStr: string) => {
        if (!timeStr) return "";

        const [hourStr, minuteStr] = timeStr.split(":");
        const hour = Number(hourStr);
        const minute = Number(minuteStr);

        if (Number.isNaN(hour) || Number.isNaN(minute)) {
            return timeStr;
        }

        const period = hour >= 12 ? "pm" : "am";
        const twelveHour = ((hour + 11) % 12) + 1;

        if (minute === 0) {
            return `${twelveHour}${period}`;
        }

        const minutePadded = minute.toString().padStart(2, "0");
        return `${twelveHour}:${minutePadded}${period}`;
    };

    const setActiveCalendar = (slugId: string) => {
        activeCalendarSlugId = slugId;
        updateActiveRound();
    };

    const updateActiveRound = () => {
        const todayIso = new Date().toISOString().split("T")[0];
        const upcomingIndex = activeRounds.findIndex((round) => round.date >= todayIso);
        activeRoundIndex = upcomingIndex;
    };

    onMount(() => {
        applyCalendarFromUrl();
        updateActiveRound();
        hasSyncedCalendarFromUrl = true;
        updateCalendarQueryParams(activeCalendarSlugId);
    });

    $effect(() => {
        if (!hasSyncedCalendarFromUrl) return;
        updateCalendarQueryParams(activeCalendarSlugId);
    });

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const year = Number(dateStr.split("-")[0]);
        const currentYear = new Date().getFullYear();
        return date.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            ...(year > currentYear ? { year: "numeric" } : {})
        });
    };

    const getFlagUrl = (code: string) => `https://flagcdn.com/${code}.svg`;
</script>

<svelte:head>
    <title>PSGL | Calendars</title>
    <meta name="description" content="League Calendars." />
</svelte:head>

<PageShell>
    <PageSection className="relative z-10">
        <SectionHeader title="League" subTitle={currentSeason} highlight="Calendar" align="left" />

        <!-- Calendar Switcher (Top) -->
        <div class="mt-8 flex justify-center mb-12">
            <div class="flex flex-wrap justify-center gap-2 w-full max-w-5xl px-4">
                {#each Object.entries(calendars) as [calSlugId, cal] (calSlugId)}
                    <button
                        class="psgl-button group relative flex-1 min-w-40 max-w-60 px-6 py-4"
                        class:psgl-button-active={activeCalendarSlugId === calSlugId}
                        onclick={() => setActiveCalendar(calSlugId)}
                    >
                        <div class="flex items-center justify-center gap-3">
                            <span class="leading-none">{cal.name}</span>
                        </div>
                    </button>
                {/each}
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">

            <!-- Left Column: Rounds -->
            <div class="lg:col-span-7 space-y-8 order-2 lg:order-1">
                <div class="flex items-center gap-4 mb-8">
                    <div class="bg-psgl-blue/20 p-3 border border-psgl-blue/50">
                        <Calendar class="w-8 h-8 text-psgl-blue" />
                    </div>
                    <div>
                        <h2 class="text-3xl font-bold uppercase tracking-wide">Rounds</h2>
                        <p class="text-psgl-blue font-bold uppercase tracking-widest text-sm">{activeCalendar.name} Calendar</p>
                    </div>
                </div>

                <div class="grid gap-4">
                    {#each activeRounds as round, i (round.number)}
                        <div class={`group relative overflow-hidden border border-white/10 transition-all duration-300
                            ${activeRoundIndex === i
                            ? "bg-[#111116] border-psgl-blue/50 hover:border-psgl-blue shadow-lg"
                            : "bg-psgl-card hover:bg-[#111116] hover:border-psgl-blue"}`}>

                            <!-- Decorative corners -->
                            {#if activeRoundIndex === i}
                                <div class="absolute top-0 left-0 h-4 w-4 border-t border-l border-psgl-blue transition-opacity duration-500 group-hover:opacity-0"></div>
                                <div class="absolute top-0 right-0 h-4 w-4 border-t border-r border-psgl-blue transition-opacity duration-500 group-hover:opacity-0"></div>
                                <div class="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-psgl-blue transition-opacity duration-500 group-hover:opacity-0"></div>
                                <div class="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-psgl-blue transition-opacity duration-500 group-hover:opacity-0"></div>
                            {/if}

                            <div class="relative p-4 md:p-6 flex flex-col sm:flex-row items-center gap-6">

                                <!-- Round Number Box -->
                                <div class={`shrink-0 flex flex-col items-center justify-center w-16 h-16 bg-black/60 border border-white/10 transition-colors ${activeRoundIndex === i ? "border-psgl-blue/50 group-hover:border-psgl-blue" : "group-hover:border-psgl-blue"}`}>
                                    <span class="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Round</span>
                                    <span class="text-3xl font-black text-white leading-none">{round.number}</span>
                                </div>

                                <!-- Flag & Details -->
                                <div class="grow text-center sm:text-left flex flex-col sm:flex-row items-center gap-6 w-full">
                                    <img
                                        src={getFlagUrl(round.flag)}
                                        alt={round.flag}
                                        class="w-16 h-10 object-cover shadow-lg border border-white/10"
                                    />
                                    <div class="grow relative w-full">
                                        <div class="relative z-10">
                                            <h3 class={`text-2xl font-black uppercase italic transition-colors ${activeRoundIndex === i ? "text-psgl-blue" : "text-white group-hover:text-psgl-blue"}`}>
                                                {round.name.split(" - ")[0]}
                                            </h3>
                                            <p class="text-gray-400 text-xs font-bold uppercase tracking-[0.15em]">
                                                {round.name.split(" - ")[1] || round.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Next Race Badge -->
                                {#if activeRoundIndex === i}
                                    <div class="shrink-0">
                                        <div class="inline-flex items-center gap-2 px-4 py-2 bg-psgl-blue text-white text-xs font-bold uppercase tracking-widest">
                                            <span class="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                            {round.date === new Date().toISOString().split("T")[0] ? "Race Day" : "Next Race"}
                                        </div>
                                    </div>
                                {/if}

                                <!-- Date -->
                                <div class="shrink-0 text-right min-w-[140px]">
                                    <div class="flex flex-col items-center sm:items-end gap-1">
                                        <div class="flex items-center gap-2 text-psgl-blue font-bold text-lg uppercase">
                                            <Calendar class="w-4 h-4" />
                                            {formatDate(round.date)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Right Column: Tiers -->
            <div class="lg:col-span-5 space-y-8 order-1 lg:order-2">
                <div class="sticky top-8">
                    <div class="flex items-center justify-between mb-8">
                        <div class="flex items-center gap-4">
                            <div class="bg-psgl-blue/20 p-3 border border-psgl-blue/50">
                                <Users class="w-8 h-8 text-psgl-blue" />
                            </div>
                            <h2 class="text-3xl font-bold uppercase tracking-wide">Tiers</h2>
                        </div>
                        <div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white bg-black/40 px-3 py-1.5 border border-white/10">
                            <span class="inline-block h-2 w-2 bg-psgl-blue animate-pulse"></span>
                            Live Streamed
                        </div>
                    </div>

                    <!-- Tiers Grid -->
                    <div class="bg-psgl-card border border-white/10 p-6 md:p-8 shadow-lg">
                        <div class="space-y-8">
                            {#each tierBlocks as block, idx (block.time)}
                                <div class={`pt-4 ${idx > 0 ? "border-t border-white/5" : ""}`}>
                                    <div class="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                                        <div class="w-32 shrink-0 flex flex-col gap-1">
                                            <div class="text-3xl font-black text-white leading-none">
                                                {formatTime(block.time)}
                                            </div>
                                            <div class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                                {timeZoneName}
                                            </div>
                                        </div>

                                        <div class="flex flex-wrap gap-2">
                                            {#each block.tiers as tierData (tierData.tiers_id.id)}
                                                <div class={`min-w-20 text-center px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition ${tierData.tiers_id.comm_confirm ? "bg-psgl-blue text-white shadow-md" : "bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10"}`}>
                                                    {tierData.tiers_id.name}
                                                </div>
                                            {/each}
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </PageSection>
</PageShell>
