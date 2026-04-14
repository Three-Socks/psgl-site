<script lang="ts">
    import Trophy from "@lucide/svelte/icons/trophy";
    import Layers from "@lucide/svelte/icons/layers";
    import Users from "@lucide/svelte/icons/users";
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
        motorRacingHelmet?: boolean;
    };

    const STAT_CARDS = [
        { label: "Discord Members", key: "member_count", icon: Users },
        { label: "Races Completed", key: "races_completed", icon: Trophy },
        { label: "Total\nTiers", key: "tier_count", icon: Layers },
        { label: "Active Drivers", key: "driver_count", motorRacingHelmet: true },
    ] satisfies readonly StatCardConfig[];

    const numberFormatter = new Intl.NumberFormat("en-GB", {
        notation: "compact",
        maximumFractionDigits: 1,
    });

    const formatStatValue = (value?: number | null) => {
        if (!value || Number.isNaN(value)) {
            return "0";
        }

        return numberFormatter.format(value);
    };

    const resolvedStats = $derived(STAT_CARDS.map((config) => {
        const source = stats ?? DEFAULT_STATS;
        const rawValue = source[config.key];
        return {
            ...config,
            value: formatStatValue(rawValue),
            isVisible: (rawValue ?? 0) > 0
        };
    }).filter(stat => stat.isVisible));
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
        <div class="flex flex-wrap justify-center gap-8 md:gap-16">
            {#each resolvedStats as stat (stat.label)}
                {@const IconComponent = stat.icon}
                <div class="group flex w-[45%] flex-col items-center text-center md:w-64">
                    <div
                        class="mb-6 rotate-45 border border-white/10 bg-black/20 p-5 text-white transition-all duration-500 group-hover:bg-white group-hover:text-psgl-blue"
                    >
                        <div class="-rotate-45">
                            {#if IconComponent}
                                <IconComponent class="h-8 w-8" />
                            {:else if stat.motorRacingHelmet}
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" class="lucide-icon lucide h-8 w-8"><!----><path d="M22 12.2a10 10 0 1 0-19.4 3.2c.2.5.8 1.1 1.3 1.3l13.2 5.1c.5.2 1.2 0 1.6-.3l2.6-2.6c.4-.4.7-1.2.7-1.7Z"></path><!----><path d="m21.8 18-10.5-4a2 2.06 0 0 1 .7-4h9.8"></path><!----><!----></svg>
                            {/if}
                        </div>
                    </div>
                    <h3
                        class="mb-1 text-4xl font-black tracking-wider text-white md:text-5xl"
                    >
                        {stat.value}
                    </h3>
                    <p
                        class="w-full max-w-25 whitespace-pre-line border-t border-white/20 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 md:text-xs"
                    >
                        {stat.label}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</section>
