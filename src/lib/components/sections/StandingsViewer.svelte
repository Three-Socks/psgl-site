<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/env";
    import CircleAlert from "@lucide/svelte/icons/circle-alert";
    import SectionHeader from "#lib/components/layout/SectionHeader.svelte";
    import StandingsControls from "../ui/StandingsControls.svelte";
    import { Platform, ViewType } from "#lib/types.ts";
    import { STANDINGS_IMAGE_BASE_URL } from "#lib/constants.ts";
    import type { Tier } from "#lib/types.ts";

    let { tiers, currentSeason } = $props<{ tiers: Tier[], currentSeason: string }>();

    let selectedPlatform = $state<Platform>(Platform.PC);
    let selectedView = $state<ViewType>(ViewType.DRIVERS);
    let selectedTierId = $state("");
    let imageState = $state<"loading" | "loaded" | "error">("loading");
    let retryCount = $state(0);

    const viewParamMap: Record<string, ViewType> = {
        drivers: ViewType.DRIVERS,
        constructors: ViewType.CONSTRUCTORS,
        results: ViewType.RESULTS
    };

    const viewValueMap: Record<ViewType, string> = {
        [ViewType.DRIVERS]: "drivers",
        [ViewType.CONSTRUCTORS]: "constructors",
        [ViewType.RESULTS]: "results"
    };

    const tierSlug = (tierName: string) => tierName.replace(/\s+/g, "-");

    let hasSyncedFromUrl = $state(false);

    const tierNameMatchesParam = (tier: Tier, paramValue: string) =>
        tierSlug(tier.name).toLowerCase() === paramValue.toLowerCase();

    const applyStandingsParams = () => {
        if (!browser) return;
        const params = new URLSearchParams(window.location.search);
        const tierParam = params.get("tier");
        if (tierParam) {
            const tierMatch = tiers.find((tier: Tier) => tierNameMatchesParam(tier, tierParam));
            if (tierMatch) {
                selectedPlatform = tierMatch.platform;
                selectedTierId = tierMatch.id;
            }
        }

        const viewParam = params.get("view");
        if (viewParam) {
            const normalizedView = viewParam.toLowerCase();
            const mappedView = viewParamMap[normalizedView];
            if (mappedView) {
                selectedView = mappedView;
            }
        }
    };

    const updateStandingsQueryParams = (tier: Tier | undefined, view: ViewType) => {
        if (!browser) return;
        const url = new URL(window.location.href);
        if (tier) {
            url.searchParams.set("tier", tierSlug(tier.name).toLowerCase());
        } else {
            url.searchParams.delete("tier");
        }
        url.searchParams.set("view", viewValueMap[view]);
        const query = url.searchParams.toString();
        const nextUrl = `${url.pathname}${query ? `?${query}` : ""}${url.hash}`;
        window.history.replaceState(window.history.state, "", nextUrl);
    };

    onMount(() => {
        applyStandingsParams();
        hasSyncedFromUrl = true;
        updateStandingsQueryParams(currentTier, selectedView);
    });

    const viewSuffix: Record<ViewType, string> = {
        [ViewType.DRIVERS]: "drivers-standings",
        [ViewType.CONSTRUCTORS]: "constructors-standings",
        [ViewType.RESULTS]: "results"
    };

    const buildImageUrl = (tierName: string, view: ViewType) =>
        `${STANDINGS_IMAGE_BASE_URL}/${tierSlug(tierName)}-${viewSuffix[view]}.webp`;


    let filteredTiers = $derived(
        tiers.filter((tier: Tier) => tier.platform === selectedPlatform),
    );

    $effect(() => {
        const currentTierExists = filteredTiers.find(
            (t: Tier) => t.id === selectedTierId,
        );
        if (!currentTierExists && filteredTiers.length > 0) {
            selectedTierId = filteredTiers[0].id;
        }
    });

    let currentTier = $derived(
        filteredTiers.find((t: Tier) => t.id === selectedTierId),
    );

    let currentImageUrl = $derived(
        currentTier ? buildImageUrl(currentTier.name, selectedView) : undefined,
    );

    let imageRequestUrl = $derived(currentImageUrl
        ? `${currentImageUrl}${retryCount ? `?retry=${retryCount}` : ""}`
        : undefined);

    $effect(() => {
        if (currentImageUrl) {
            retryCount = 0;
            imageState = "loading";
        }
    });

    function retryImage() {
        imageState = "loading";
        retryCount += 1;
    }

    $effect(() => {
        if (!hasSyncedFromUrl) return;
        updateStandingsQueryParams(currentTier, selectedView);
    });
</script>

<div class="relative mx-auto flex max-w-7xl flex-col gap-6">
    <SectionHeader title="League" subTitle={currentSeason} highlight="Standings" align="left" />

    <!-- CONTROLS BAR: Platform + Tier Selector -->
    <StandingsControls
        bind:selectedPlatform
        bind:selectedTierId
        bind:selectedView
        {filteredTiers}
        {currentTier}
    />

    <!-- IMAGE VIEWER -->
    <div
        class="group relative w-full mx-auto max-w-full overflow-hidden border border-white/10 bg-black"
        aria-busy={currentTier && imageState === "loading"}
    >
        {#if currentTier && currentImageUrl}
            {#key imageRequestUrl}
                <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
                <a href={currentImageUrl} class:hidden={imageState !== "loaded"}>
                    <img
                        src={imageRequestUrl}
                        alt={`${currentTier.name} - ${selectedView}`}
                        onload={() => (imageState = "loaded")}
                        onerror={() => (imageState = "error")}
                        class="block h-auto max-w-full mx-auto"
                    />
                </a>
            {/key}
            <div role="status" aria-live="polite">
                {#if imageState === "loading"}
                    <p class="p-12 text-center text-gray-300">Loading {currentTier.name} {selectedView.toLowerCase()}…</p>
                {:else if imageState === "error"}
                    <div class="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
                        <CircleAlert class="h-10 w-10 text-gray-400" />
                        <p class="text-gray-300">These standings may not have been published yet, or could not be loaded.</p>
                        <button class="psgl-button px-6 py-3" onclick={retryImage}>Try again</button>
                    </div>
                {/if}
            </div>
        {:else}
            <div
                class="flex min-h-64 w-full flex-col items-center justify-center p-8 text-gray-400"
                role="status"
            >
                <CircleAlert class="mb-4 h-12 w-12" />
                <p class="font-bold uppercase tracking-widest">
                    No tiers are available for this platform.
                </p>
            </div>
        {/if}
    </div>
</div>
