<script lang="ts">
    import { Icon, Trophy, Layers, Users } from "@lucide/svelte";
    import { motorRacingHelmet } from "@lucide/lab";
    import RealCarbonFibre from "$lib/assets/real-carbon-fibre.png";
    import type { SiteStats } from "$lib/types";

    const { stats }: { stats: SiteStats | null } = $props();

    const DEFAULT_STATS: SiteStats = {
        driver_count: 0,
        races_completed: 0,
        member_count: 0,
        tier_count: 0,
    };

    type StatCardConfig = {
        label: string;
        key: keyof SiteStats;
        icon?: typeof Users;
        iconNode?: typeof motorRacingHelmet;
    };

    const STAT_CARDS = [
        { label: "Discord Members", key: "member_count", icon: Users },
        { label: "Races Completed", key: "races_completed", icon: Trophy },
        { label: "Total\nTiers", key: "tier_count", icon: Layers },
        { label: "Active Drivers", key: "driver_count", iconNode: motorRacingHelmet },
    ] satisfies readonly StatCardConfig[];

    const numberFormatter = new Intl.NumberFormat("en-GB", {
        notation: "compact",
        maximumFractionDigits: 1,
    });

    const formatStatValue = (value?: number | null) => {
        if (value == null || Number.isNaN(value)) {
            return "0";
        }

        return numberFormatter.format(value);
    };

    const resolvedStats = $derived(STAT_CARDS.map((config) => {
        const source = stats ?? DEFAULT_STATS;
        return {
            ...config,
            value: formatStatValue(source[config.key]),
        };
    }));
</script>

<section
    class="relative overflow-hidden py-16 bg-linear-to-br from-[#0033cc] to-[#001540]"
>
    <!-- Background pattern -->
    <div
        class="absolute inset-0 opacity-50 mix-blend-overlay"
        style={`background-image: url('${RealCarbonFibre}')`}
    ></div>

    <div class="relative z-10 mx-auto max-w-7xl px-4">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
            {#each resolvedStats as stat (stat.label)}
                {@const IconComponent = stat.icon}
                <div class="group flex flex-col items-center text-center">
                    <div
                        class="mb-6 rotate-45 border border-white/10 bg-black/20 p-5 text-white transition-all duration-500 group-hover:bg-white group-hover:text-psgl-blue"
                    >
                        <div class="-rotate-45">
                            {#if IconComponent}
                                <IconComponent class="h-8 w-8" />
                            {:else if stat.iconNode}
                                <Icon
                                    class="h-8 w-8"
                                    iconNode={stat.iconNode}
                                />
                            {/if}
                        </div>
                    </div>
                    <h3
                        class="mb-1 text-4xl font-black italic text-white md:text-5xl"
                    >
                        {stat.value}
                    </h3>
                    <p
                        class="w-full max-w-[100px] whitespace-pre-line border-t border-white/20 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 md:text-xs"
                    >
                        {stat.label}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</section>
