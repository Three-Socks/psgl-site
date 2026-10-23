<script lang="ts">
    import { resolve } from "$app/paths";
    import { SITE_URL } from "#lib/constants.ts";
    import { calendarSubscriptionUrl, MAX_CALENDAR_SELECTIONS, selectionKey } from "#lib/calendar-subscription.ts";
    import type { CalendarData } from "#lib/types.ts";

    let { calendars, enabled = true }: { calendars: Record<string, CalendarData>; enabled?: boolean } = $props();
    let selected: string[] = $state([]);
    let copyMessage = $state("");
    let subscriptionMessage = $state("");
    let checking = $state(false);
    let manualSetup = $state(false);
    const availableCalendars = $derived(Object.values(calendars).filter((calendar) => calendar.tiers.length));
    const url = $derived(selected.length ? calendarSubscriptionUrl(selected, SITE_URL) : "");
    const subscribeUrl = $derived(url.replace(/^https:/, "webcal:"));

    const toggle = (key: string, checked: boolean) => {
        selected = checked ? [...selected, key] : selected.filter((value) => value !== key);
        copyMessage = "";
        subscriptionMessage = "";
    };

    const subscribe = async (event: MouseEvent) => {
        event.preventDefault();
        if (checking) return;
        checking = true;
        subscriptionMessage = "";
        try {
            // Check the feed only when requested, without delaying the calendars page.
            const feed = new URL(url);
            const response = await fetch(`${feed.pathname}${feed.search}`, {
                method: "HEAD", cache: "no-store", signal: AbortSignal.timeout(20_000),
            });
            if (!response.ok) throw new Error("Subscription unavailable");
        } catch {
            subscriptionMessage = "Calendar subscriptions are temporarily unavailable. Try again shortly.";
            return;
        } finally {
            checking = false;
        }
        subscriptionMessage = "App didn't open? Use Manual setup below.";
        try {
            window.location.assign(subscribeUrl);
        } catch {
            manualSetup = true;
        }
    };

    const copyUrl = async () => {
        const copiedUrl = url;
        subscriptionMessage = "";
        try {
            await navigator.clipboard.writeText(copiedUrl);
            if (url === copiedUrl) copyMessage = "Link copied.";
        } catch {
            manualSetup = true;
            copyMessage = "Select and copy the link below.";
        }
    };
</script>

<details class="mb-10 border border-white/10 bg-psgl-card p-5 md:p-6">
    <summary class="cursor-pointer text-lg font-bold text-white">Subscribe to calendars</summary>
    {#if !enabled}
        <p class="mt-4 text-sm text-gray-300" role="status">Calendar subscriptions are temporarily unavailable.</p>
    {:else if !availableCalendars.length}
        <p class="mt-4 text-sm text-gray-300" role="status">No tiers are available to subscribe to yet.</p>
    {:else}
        <p class="mt-4 text-sm text-gray-300">Choose tiers to follow in your calendar app.</p>
        <div class="my-5 grid gap-5 sm:grid-cols-2">
            {#each availableCalendars as calendar (calendar.id)}
                <fieldset disabled={checking}>
                    <legend class="mb-2 font-bold text-white">{calendar.name}</legend>
                    <div class="flex flex-wrap gap-2">
                        {#each calendar.tiers as { tiers_id: tier } (tier.id)}
                            {@const key = selectionKey({ calendarId: calendar.id, tierId: tier.id })}
                            <label
                                class="flex cursor-pointer select-none items-center gap-2 border border-white/10 px-3 py-2 text-sm text-gray-200 has-checked:border-psgl-blue has-checked:bg-psgl-blue/15 has-disabled:cursor-not-allowed has-disabled:opacity-50"
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(key)}
                                    disabled={selected.length >= MAX_CALENDAR_SELECTIONS && !selected.includes(key)}
                                    onchange={(event) => toggle(key, event.currentTarget.checked)}
                                    class="accent-psgl-blue"
                                />
                                {tier.name}
                            </label>
                        {/each}
                    </div>
                </fieldset>
            {/each}
        </div>
        {#if selected.length >= MAX_CALENDAR_SELECTIONS}
            <p class="mb-3 text-sm text-gray-300">You can select up to {MAX_CALENDAR_SELECTIONS} tiers.</p>
        {/if}
        {#if url}
            <div class="flex flex-wrap items-center gap-3">
                <a
                    href={subscribeUrl} onclick={subscribe} aria-disabled={checking} aria-busy={checking}
                    class="psgl-button psgl-button-active px-4 py-3 text-sm font-bold" rel="external"
                >
                    {checking ? "Checking availability..." : `Add to calendar (${selected.length})`}
                </a>
                <button type="button" onclick={copyUrl} class="psgl-button px-4 py-3 text-sm font-bold">
                    Copy link
                </button>
            </div>
            <p class="mt-2 text-sm text-gray-300" role="status">{subscriptionMessage || copyMessage}</p>
            <details bind:open={manualSetup} class="mt-4 border-t border-white/10 pt-4 text-sm text-gray-300">
                <summary class="cursor-pointer font-bold text-white">Manual setup</summary>
                <label class="mt-4 block text-xs text-gray-400">
                    Calendar link
                    <input
                        type="text" readonly value={url} onclick={(event) => event.currentTarget.select()}
                        class="mt-1 w-full border border-white/10 bg-black/40 p-2 text-sm text-gray-200"
                    />
                </label>
                <ul class="mt-4 space-y-3">
                    <li>
                        <a class="text-psgl-blue-2 underline" href="https://support.google.com/calendar/answer/37100">Google Calendar</a>:
                        On a computer, open Other calendars, choose +, then From URL. Paste the link and choose Add calendar.
                    </li>
                    <li>
                        <a class="text-psgl-blue-2 underline" href="https://support.apple.com/en-gb/102301">Apple Calendar</a>:
                        On iPhone or iPad, open Calendars, Add Calendar, then Add Subscription Calendar. Paste the link.
                        On Mac, choose File, then New Calendar Subscription.
                    </li>
                    <li>
                        <a class="text-psgl-blue-2 underline" href="https://learn.microsoft.com/en-us/troubleshoot/outlook/calendaring/cannot-add-an-internet-calendar">Outlook</a>:
                        In new Outlook, open Calendar, Add calendar, then Subscribe from web. Paste the link.
                    </li>
                </ul>
            </details>
        {:else}
            <p class="text-sm text-gray-400">Select a tier to get started.</p>
        {/if}
    {/if}
</details>
