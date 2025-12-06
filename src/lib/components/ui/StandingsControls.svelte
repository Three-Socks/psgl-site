<script lang="ts">
    import { Monitor, Gamepad2, ChevronDown, Trophy, Users, Flag } from "@lucide/svelte";
    import { Platform, ViewType } from "$lib/types";
    import type { Tier } from "$lib/types";

    let {
        selectedPlatform = $bindable(),
        selectedTierId = $bindable(),
        selectedView = $bindable(),
        filteredTiers,
        currentTier
    } = $props<{
        selectedPlatform: Platform;
        selectedTierId: string;
        selectedView: ViewType;
        filteredTiers: Tier[];
        currentTier: Tier | undefined;
    }>();

    let isTierMenuOpen = $state(false);
    let menuRef: HTMLDivElement | undefined = $state();
    let tierCloseTimeout: ReturnType<typeof setTimeout> | undefined = $state();

    function handleClickOutside(event: MouseEvent) {
        if (menuRef && !menuRef.contains(event.target as Node)) {
            isTierMenuOpen = false;
        }
    }

    $effect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    });

    const handleTierSelect = (id: string) => {
        selectedTierId = id;

        if (tierCloseTimeout) clearTimeout(tierCloseTimeout);
        tierCloseTimeout = setTimeout(() => {
            isTierMenuOpen = false;
        }, 160);
    };

    $effect(() => {
        return () => tierCloseTimeout && clearTimeout(tierCloseTimeout);
    });

    const getViewLabel = (type: ViewType) => {
        switch (type) {
            case ViewType.DRIVERS:
                return "Drivers";
            case ViewType.CONSTRUCTORS:
                return "Constructors";
            case ViewType.RESULTS:
                return "Results";
            default:
                return type;
        }
    };
</script>

<div class="mt-6 flex w-full flex-col gap-4 md:flex-row">
    <!-- Platform Switcher -->
    <div class="flex w-full gap-1 md:w-auto">
        <button
            onclick={() => (selectedPlatform = Platform.PC)}
            class="psgl-button flex-1 px-6 py-3 md:flex-none md:text-base"
            class:psgl-button-active={selectedPlatform === Platform.PC}
        >
            <div class="flex items-center justify-center gap-2">
                <Monitor class="h-5 w-5" /> PC
            </div>
        </button>
        <button
            onclick={() => (selectedPlatform = Platform.PS)}
            class="psgl-button flex-1 px-6 py-3 md:flex-none md:text-base"
            class:psgl-button-active={selectedPlatform === Platform.PS}
        >
            <div class="flex items-center justify-center gap-2">
                <Gamepad2 class="h-5 w-5" /> PS
            </div>
        </button>
    </div>

    <!-- Tier Dropdown -->
    <div class="relative z-40 w-full md:w-64" bind:this={menuRef}>
        <button
            onclick={() => (isTierMenuOpen = !isTierMenuOpen)}
            class="psgl-button flex w-full items-center justify-between px-6 py-3 md:flex-none md:text-base"
        >
            <div class="flex flex-col items-start">
                <span
                    class="text-psgl-blue mb-1 text-[9px] font-bold leading-none uppercase tracking-widest"
                    >Selected Tier</span
                >
                <span class="text-xl uppercase leading-none">
                    {currentTier?.name || "Select"}
                </span>
            </div>
            <div
                class="bg-white/5 p-1 transition-transform duration-300"
                class:rotate-180={isTierMenuOpen}
            >
                <ChevronDown class="text-psgl-blue h-4 w-4" />
            </div>
        </button>

        {#if isTierMenuOpen}
            <div
                class="psgl-button cursor-auto! hover:bg-gray-950! animate-in fade-in zoom-in-95 absolute top-full right-0 left-0 mt-2 grid origin-top grid-cols-2 gap-2 p-2 shadow-2xl duration-200"
            >
                {#each filteredTiers as tier (tier.id)}
                    <button
                        onclick={() => handleTierSelect(tier.id)}
                        class="psgl-dropdown group flex items-center justify-between px-3 py-2"
                        class:psgl-dropdown-active={selectedTierId === tier.id}
                    >
                        <span class="text-sm uppercase font-bold"
                            >{tier.name}</span
                        >
                    </button>
                {/each}
            </div>
        {/if}
    </div>
</div>

<!-- VIEW TABS (Full width, no scroll) -->
<div class="flex w-full gap-1">
    {#each [ViewType.DRIVERS, ViewType.CONSTRUCTORS, ViewType.RESULTS] as type (type)}
        <button
            onclick={() => (selectedView = type)}
            class="psgl-button flex-1 min-w-0 py-3 text-[10px] md:py-4 {selectedView ===
            type
                ? "psgl-button-active"
                : ""}"
        >
            <div
                class="flex flex-col items-center justify-center gap-1 text-center md:flex-row md:gap-2"
            >
                {#if type === ViewType.DRIVERS}
                    <Users class="h-3 w-3 md:h-4 md:w-4" />
                {/if}
                {#if type === ViewType.CONSTRUCTORS}
                    <Trophy class="h-3 w-3 md:h-4 md:w-4" />
                {/if}
                {#if type === ViewType.RESULTS}
                    <Flag class="h-3 w-3 md:h-4 md:w-4" />
                {/if}
                <span>{getViewLabel(type)}</span>
            </div>
        </button>
    {/each}
</div>
