<script lang="ts">
    import {
        AlertCircle,
    } from "@lucide/svelte";
    import SectionHeader from "$lib/components/layout/SectionHeader.svelte";
    import StandingsControls from "../ui/StandingsControls.svelte";
    import { LEAGUE_DATA } from "$lib/constants";
    import { Platform, ViewType } from "$lib/types";

    let selectedPlatform = $state<Platform>(Platform.PC);
    let selectedView = $state<ViewType>(ViewType.DRIVERS);

    const initialTier = LEAGUE_DATA.find((t) => t.platform === Platform.PC);
    let selectedTierId = $state<string>(initialTier?.id || "");


    let filteredTiers = $derived(
        LEAGUE_DATA.filter((tier) => tier.platform === selectedPlatform),
    );

    $effect(() => {
        const currentTierExists = filteredTiers.find(
            (t) => t.id === selectedTierId,
        );
        if (!currentTierExists && filteredTiers.length > 0) {
            selectedTierId = filteredTiers[0].id;
        }
    });

    let currentTier = $derived(
        filteredTiers.find((t) => t.id === selectedTierId),
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

        {#if currentTier}
            <img
                src={currentTier.images[selectedView]}
                alt={`${currentTier.name} - ${selectedView}`}
                class="block h-auto max-w-full mx-auto"
            />
    {:else}
            <div
                class="flex h-full w-full flex-col items-center justify-center text-gray-600"
            >
                <AlertCircle class="mb-4 h-12 w-12" />
                <p class="font-bold uppercase tracking-widest">
                    No Data Available
                </p>
            </div>
        {/if}
    </div>
</div>
