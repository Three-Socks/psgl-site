<script lang="ts">
    import {
        CircleAlert,
    } from "@lucide/svelte";
    import SectionHeader from "$lib/components/layout/SectionHeader.svelte";
    import StandingsControls from "../ui/StandingsControls.svelte";
    import { Platform, ViewType } from "$lib/types";
    import { STANDINGS_IMAGE_BASE_URL } from "$lib/constants";
    import type { Tier } from "$lib/types";

    let { tiers } = $props<{ tiers: Tier[] }>();

    let selectedPlatform = $state<Platform>(Platform.PC);
    let selectedView = $state<ViewType>(ViewType.DRIVERS);

    const initialTier = tiers.find((t: Tier) => t.platform === Platform.PC);
    let selectedTierId = $state<string>(initialTier?.id || "");

    const tierSlug = (tierName: string) => tierName.replace(/\s+/g, "-");

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
</script>

<div class="relative mx-auto flex max-w-7xl flex-col gap-6">
    <SectionHeader title="League" subTitle="Season 40" highlight="Standings" align="left" />

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
