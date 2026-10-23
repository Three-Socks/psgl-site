<script lang="ts">
    import { SITE_URL } from "#lib/constants.ts";
    import { calendarSubscriptionUrl, MAX_CALENDAR_SELECTIONS, selectionKey } from "#lib/calendar-subscription.ts";
    import type { CalendarData } from "#lib/types.ts";

    let { calendars, enabled = true }: { calendars: Record<string, CalendarData>; enabled?: boolean } = $props();
    let selected: string[] = $state([]);
    let copyMessage = $state("");
    let setupApp = $state<"outlook" | "all" | "">("");
    const availableCalendars = $derived(Object.values(calendars).filter((calendar) => calendar.tiers.length));
    const url = $derived(selected.length ? calendarSubscriptionUrl(selected, SITE_URL) : "");
    const subscribeUrl = $derived(url.replace(/^https:/, "webcal:"));
    const googleSubscribeUrl = $derived.by(() => {
        if (!url) return "";
        const google = new URL("https://calendar.google.com/calendar/render");
        google.searchParams.set("cid", subscribeUrl);
        return google.href;
    });

    const toggle = (key: string, checked: boolean) => {
        selected = checked ? [...selected, key] : selected.filter((value) => value !== key);
        copyMessage = "";
    };

    const copyUrl = async () => {
        const copiedUrl = url;
        try {
            await navigator.clipboard.writeText(copiedUrl);
            if (url === copiedUrl) copyMessage = "Link copied.";
        } catch {
            setupApp = "all";
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
                <fieldset>
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
            <p class="mb-3 text-sm text-gray-300">Add {selected.length} selected {selected.length === 1 ? "tier" : "tiers"} to:</p>
            <div class="flex flex-wrap items-center gap-3">
                <a
                    href={googleSubscribeUrl} target="_blank" rel="noopener noreferrer"
                    class="psgl-button psgl-button-active px-4 py-3 text-sm font-bold"
                >
                    Google Calendar
                </a>
                <a
                    href={subscribeUrl} class="psgl-button px-4 py-3 text-sm font-bold" rel="external"
                >
                    Apple Calendar
                </a>
                <button
                    type="button" onclick={() => setupApp = "outlook"}
                    aria-expanded={setupApp === "outlook" || setupApp === "all"} aria-controls="calendar-subscription-setup"
                    class="psgl-button px-4 py-3 text-sm font-bold"
                >
                    Outlook
                </button>
                <button type="button" onclick={copyUrl} class="psgl-button px-4 py-3 text-sm font-bold">
                    Copy link
                </button>
                <button
                    type="button" onclick={() => setupApp = setupApp ? "" : "all"}
                    aria-expanded={Boolean(setupApp)} aria-controls="calendar-subscription-setup"
                    class="cursor-pointer text-sm text-gray-300 underline hover:text-white"
                >
                    Setup help
                </button>
            </div>
            <p class="mt-2 text-sm text-gray-300" role="status">{copyMessage}</p>
            <div id="calendar-subscription-setup" hidden={!setupApp} class="mt-4 border-t border-white/10 pt-4 text-sm text-gray-300">
                <h3 class="font-bold text-white">Setup help</h3>
                <label class="mt-4 block text-xs text-gray-400">
                    Calendar link
                    <input
                        type="text" readonly value={url} onclick={(event) => event.currentTarget.select()}
                        class="mt-1 w-full border border-white/10 bg-black/40 p-2 text-sm text-gray-200"
                    />
                </label>
                <ul class="mt-4 space-y-3">
                    {#if setupApp === "all"}
                    <li>
                        <a class="text-psgl-blue-2 underline" href="https://support.google.com/calendar/answer/37100">Google Calendar</a>:
                        If Google Calendar opens without adding the calendar, use From URL on a computer.
                        Open
                        <a class="text-psgl-blue-2 underline" href="https://calendar.google.com/" target="_blank" rel="noopener noreferrer">Google Calendar</a>.
                        Under Other calendars, choose +, then From URL. Paste the link above and choose Add calendar.
                    </li>
                    {/if}
                    {#if setupApp === "all"}
                    <li>
                        <a class="text-psgl-blue-2 underline" href="https://support.apple.com/en-gb/102301">Apple Calendar</a>:
                        On iPhone or iPad, open Calendars, Add Calendar, then Add Subscription Calendar. Paste the link.
                        On Mac, choose File, then New Calendar Subscription.
                    </li>
                    {/if}
                    {#if setupApp === "outlook" || setupApp === "all"}
                    <li>
                        <a class="text-psgl-blue-2 underline" href="https://learn.microsoft.com/en-us/troubleshoot/outlook/calendaring/cannot-add-an-internet-calendar">Outlook</a>:
                        In new Outlook, open Calendar, Add calendar, then Subscribe from web. Paste the link.
                    </li>
                    {/if}
                </ul>
                <p class="mt-4 text-gray-400">Subscribe with the link. Importing a file won't receive updates.</p>
            </div>
        {:else}
            <p class="text-sm text-gray-400">Select a tier to get started.</p>
        {/if}
    {/if}
</details>
