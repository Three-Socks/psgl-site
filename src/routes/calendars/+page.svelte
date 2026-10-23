<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/env";
    import Calendar from "@lucide/svelte/icons/calendar";
    import Users from "@lucide/svelte/icons/users";
    import PageShell from "#lib/components/layout/PageShell.svelte";
    import PageSection from "#lib/components/layout/PageSection.svelte";
    import SectionHeader from "#lib/components/layout/SectionHeader.svelte";
    import CalendarSubscriptions from "#lib/components/sections/CalendarSubscriptions.svelte";
    import type { CalendarData, RaceRound } from "#lib/types.ts";
    import { SvelteMap } from "svelte/reactivity";
    import type { PageProps } from "./$types";
    import { DEFAULT_TIMEZONE } from "#lib/constants.ts";
    import { getUKDateKey, resolveRaceDate } from "#lib/race-date.ts";

    let { data }: PageProps = $props();
    let calendars = $derived(data.calendars as Record<string, CalendarData>);
    let currentSeason = $derived(data.currentSeason);

    let activeCalendarSlugId = $state("");
    let resolvedActiveCalendarSlugId = $derived(
        activeCalendarSlugId && calendars[activeCalendarSlugId]
            ? activeCalendarSlugId
            : Object.keys(calendars)[0] || ""
    );
    let activeCalendar = $derived(calendars[resolvedActiveCalendarSlugId] as CalendarData);
    let activeRounds = $derived(activeCalendar?.rounds ?? []);
    let now = $state(new Date());
    let today = $derived(getUKDateKey(now));

    const getRoundSchedules = (round: RaceRound) => (activeCalendar?.tiers ?? [])
        .map(({ tiers_id: tier }) => ({ tier, date: resolveRaceDate(round, tier) }))
        .filter((schedule): schedule is { tier: CalendarData["tiers"][number]["tiers_id"]; date: Date } => schedule.date !== null);

    let roundSchedules = $derived(activeRounds.map((round) => {
        const schedules = getRoundSchedules(round);
        const baseDate = resolveRaceDate({ ...round, overrides: [] }, { id: "", time: "12:00:00" });
        const dates = schedules.length ? schedules.map(({ date }) => date) : baseDate ? [baseDate] : [];
        const sameDay = dates.every((date) => getUKDateKey(date) === getUKDateKey(dates[0]));
        const displayDate = sameDay ? dates[0] : baseDate;
        return { round, schedules, dates, displayDate };
    }));

    let activeRoundIndex = $derived.by(() => {
        let index = -1;
        let nearest = Infinity;
        roundSchedules.forEach(({ round, dates }, i) => {
            if (round.cancelled_at) return;
            const upcoming = dates.filter((date) => getUKDateKey(date) >= today);
            const timestamp = Math.min(...upcoming.map((date) => date.getTime()));
            if (timestamp < nearest) {
                nearest = timestamp;
                index = i;
            }
        });
        return index;
    });

    let referenceRound = $derived(activeRounds[activeRoundIndex] ?? activeRounds.findLast((round) => !round.cancelled_at));

    const formatRaceTime = (date: Date) => date.toLocaleTimeString("en-GB", {
        timeZone: DEFAULT_TIMEZONE, hour: "numeric", minute: "2-digit", hour12: true,
    });

    const raceTimeZone = (date: Date) => new Intl.DateTimeFormat("en-GB", {
        timeZone: DEFAULT_TIMEZONE, timeZoneName: "short",
    }).formatToParts(date).find((part) => part.type === "timeZoneName")?.value ?? "UK";

    const tiersByTime = (tiers: CalendarData["tiers"]) => {
        const timeMap = new SvelteMap<string, typeof tiers>();
        tiers.forEach((tierData) => {
            const date = referenceRound ? resolveRaceDate(referenceRound, tierData.tiers_id) : null;
            const time = date ? date.toISOString() : tierData.tiers_id.time;
            if (time) {
                timeMap.set(time, [...(timeMap.get(time) ?? []), tierData]);
            }
        });
        return Array.from(timeMap.entries())
            .map(([time, groupedTiers]) => {
                const date = referenceRound ? resolveRaceDate(referenceRound, groupedTiers[0].tiers_id) : null;
                return { time, tiers: groupedTiers, date };
            })
            .sort((a, b) => a.time.localeCompare(b.time, undefined, { numeric: true, sensitivity: "base" }));
    };

    let tierBlocks = $derived(activeCalendar ? tiersByTime(activeCalendar.tiers) : []);

    let hasSyncedCalendarFromUrl = $state(false);

    const applyCalendarFromUrl = () => {
        if (!browser) return;
        const params = new URLSearchParams(window.location.search);
        const calendarParam = params.get("calendar");
        const calendarId = params.get("calendar_id");
        const matchingCalendar = calendarId
            ? Object.entries(calendars).find(([, calendar]) => calendar.id === calendarId)
            : undefined;
        if (matchingCalendar) {
            activeCalendarSlugId = matchingCalendar[0];
        } else if (calendarParam && calendars[calendarParam]) {
            activeCalendarSlugId = calendarParam;
        }
    };

    const updateCalendarQueryParams = (calendarSlugId: string) => {
        if (!browser) return;
        const url = new URL(window.location.href);
        url.searchParams.delete("calendar_id");
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
    };

    onMount(() => {
        applyCalendarFromUrl();
        activeCalendarSlugId = resolvedActiveCalendarSlugId;
        hasSyncedCalendarFromUrl = true;
        updateCalendarQueryParams(resolvedActiveCalendarSlugId);
        now = new Date();
        const interval = setInterval(() => (now = new Date()), 60_000);
        return () => clearInterval(interval);
    });

    $effect(() => {
        if (!hasSyncedCalendarFromUrl) return;
        if (activeCalendarSlugId !== resolvedActiveCalendarSlugId) {
            activeCalendarSlugId = resolvedActiveCalendarSlugId;
        }
        updateCalendarQueryParams(resolvedActiveCalendarSlugId);
    });

    const formatDate = (date: Date) => date.toLocaleDateString("en-GB", {
        timeZone: DEFAULT_TIMEZONE,
        day: "numeric",
        month: "short",
        ...(getUKDateKey(date).slice(0, 4) !== today.slice(0, 4) ? { year: "numeric" } : {}),
    });

    const getRescheduledTiers = (round: RaceRound) => getRoundSchedules(round).filter(({ tier, date }) => {
        const original = resolveRaceDate({ ...round, overrides: [] }, tier);
        return original?.getTime() !== date.getTime();
    });

    const getFlagUrl = (code: string) => `https://flagcdn.com/${code}.svg`;
</script>

<svelte:head>
    <title>PSGL | Calendars</title>
    <meta name="description" content={currentSeason
        ? `${currentSeason} league race calendars and tier start times.`
        : "League race calendars and tier start times."} />
</svelte:head>

<PageShell>
    <PageSection className="relative z-10">
        <SectionHeader title="League" subTitle={currentSeason} highlight="Calendar" align="left" />

        {#if !activeCalendar}
            <p class="mt-8 border border-white/10 bg-psgl-card p-8 text-center text-gray-400" role="status">
                No calendars are available yet.
            </p>
        {:else}
            <!-- Calendar Switcher (Top) -->
            <div class="mt-8 flex justify-center mb-12">
                <div class="flex flex-wrap justify-center gap-2 w-full max-w-5xl px-4">
                    {#each Object.entries(calendars) as [calSlugId, cal] (calSlugId)}
                        <button
                            class="psgl-button group relative flex-1 min-w-40 max-w-60 px-6 py-4"
                            class:psgl-button-active={resolvedActiveCalendarSlugId === calSlugId}
                            aria-pressed={resolvedActiveCalendarSlugId === calSlugId}
                            onclick={() => setActiveCalendar(calSlugId)}
                        >
                            <div class="flex items-center justify-center gap-3">
                                <span class="leading-none">{cal.name}</span>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>

            <CalendarSubscriptions {calendars} enabled={data.calendarSubscriptionsEnabled} />

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">

                <!-- Left Column: Rounds -->
                <div class="lg:col-span-7 space-y-8 order-2 lg:order-1">
                    <div class="flex items-center gap-4 mb-8">
                        <div class="bg-psgl-blue/20 p-3 border border-psgl-blue/50">
                            <Calendar class="w-8 h-8 text-psgl-blue" />
                        </div>
                        <div>
                            <h2 class="text-3xl font-bold uppercase tracking-wide">Rounds</h2>
                            <p class="text-psgl-blue font-bold uppercase tracking-widest text-sm">{activeCalendar?.name ?? ""} Calendar</p>
                        </div>
                    </div>

                    <div class="grid gap-4">
                        {#each roundSchedules as { round, dates, displayDate }, i (round.id)}
                            <div id={`round-${round.id}`} class={`group relative overflow-hidden border border-white/10 transition-all duration-300
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
                                                {#if round.cancelled_at}
                                                    <span class="mt-2 inline-block border border-red-400/40 bg-red-950/40 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-200">Cancelled</span>
                                                {/if}
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
                                                {dates.some((date) => getUKDateKey(date) === today) ? "Race Day" : "Next Race"}
                                            </div>
                                        </div>
                                    {/if}

                                    <!-- Date -->
                                    <div class="shrink-0 text-right min-w-[140px]">
                                        <div class="flex flex-col items-center sm:items-end gap-1">
                                            <div class="flex items-center gap-2 text-psgl-blue font-bold text-lg uppercase">
                                                <Calendar class="w-4 h-4" />
                                                {displayDate ? formatDate(displayDate) : round.cancelled_at ? "Cancelled" : "Date to be confirmed"}
                                            </div>
                                            {#if round.cancelled_at && displayDate}
                                                <p class="text-xs text-gray-400">Originally scheduled</p>
                                            {/if}
                                        </div>
                                    </div>
                                </div>
                                {#if round.cancelled_at}
                                    <p class="px-4 pb-4 text-sm text-red-200 md:px-6">{round.cancellation_reason || "This round has been cancelled."}</p>
                                {/if}
                                {#each getRescheduledTiers(round) as { tier, date } (tier.id)}
                                    <p class="px-4 pb-4 text-sm text-gray-300 md:px-6">
                                        {tier.name}{round.cancelled_at ? " originally rescheduled" : " rescheduled"}: {formatDate(date)}, {formatRaceTime(date)} {raceTimeZone(date)}
                                    </p>
                                {/each}
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
                                <span class="inline-block h-2 w-2 bg-psgl-blue"></span>
                                Live Streamed
                            </div>
                        </div>

                        {#if referenceRound}
                            <p class="mb-4 text-sm text-gray-400">Start times for round {referenceRound.number}</p>
                        {:else if activeRounds.length}
                            <p class="mb-4 text-sm text-gray-400">All rounds in this calendar are cancelled. Normal tier times are shown below.</p>
                        {/if}
                        <!-- Tiers Grid -->
                        <div class="bg-psgl-card border border-white/10 p-6 md:p-8 shadow-lg">
                            <div class="space-y-8">
                                {#each tierBlocks as block, idx (block.time)}
                                    <div class={`pt-4 ${idx > 0 ? "border-t border-white/5" : ""}`}>
                                        <div class="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
                                            <div class="w-32 shrink-0 flex flex-col gap-1">
                                                <div class="text-3xl font-black text-white leading-none">
                                                    {block.date ? formatRaceTime(block.date) : formatTime(block.time)}
                                                </div>
                                                <div class="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                                    {block.date ? `${formatDate(block.date)} · ${raceTimeZone(block.date)}` : "UK time (GMT/BST)"}
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
        {/if}
    </PageSection>
</PageShell>
