<script lang="ts">
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
    import {
        CircleAlert,
    } from "@lucide/svelte";
    import SectionHeader from "$lib/components/layout/SectionHeader.svelte";
    import StandingsControls from "../ui/StandingsControls.svelte";
    import { Platform, ViewType } from "$lib/types";
    import { STANDINGS_IMAGE_BASE_URL } from "$lib/constants";
    import type { Tier } from "$lib/types";

    let { tiers, currentSeason } = $props<{ tiers: Tier[], currentSeason: string }>();

    let selectedPlatform = $state<Platform>(Platform.PC);
    let selectedView = $state<ViewType>(ViewType.DRIVERS);

    const initialTier = tiers.find((t: Tier) => t.platform === Platform.PC);
    let selectedTierId = $state<string>(initialTier?.id || "");

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
        `${STANDINGS_IMAGE_BASE_URL}/${tierSlug(tierName)}-${viewSuffix[view]}.png`;


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
        class="group relative w-fit mx-auto max-w-full overflow-hidden border border-white/10 bg-black"
    >
        {#if currentTier && currentImageUrl}
            <!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
            <a href={currentImageUrl}>
                <img
                    src={currentImageUrl}
                    alt={`${currentTier.name} - ${selectedView}`}
                    class="block h-auto max-w-full mx-auto"
                />
            </a>
        {:else}
            <div
                class="flex h-full w-full flex-col items-center justify-center text-gray-600"
            >
                <CircleAlert class="mb-4 h-12 w-12" />
                <p class="font-bold uppercase tracking-widest">
                    No Data Available
                </p>
            </div>
        {/if}
    </div>
</div>
