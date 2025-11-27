<script lang="ts">
    import { STATS } from "$lib/constants";
</script>

<section
    class="relative overflow-hidden py-16 bg-gradient-to-br from-[#0033cc] to-[#001540]"
>
    <!-- Background pattern -->
    <div
        class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/real-carbon-fibre.png')] opacity-50 mix-blend-overlay"
    ></div>

    <div class="relative z-10 mx-auto max-w-7xl px-4">
        <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
            {#each STATS as stat}
                {@const Icon = stat.icon}
                <div class="group flex flex-col items-center text-center">
                    <div
                        class="mb-6 rotate-45 border border-white/10 bg-black/20 p-5 text-white transition-all duration-500 group-hover:bg-white group-hover:text-psgl-blue"
                    >
                        <div class="-rotate-45">
                            <Icon class="h-8 w-8" />
                        </div>
                    </div>
                    <h3
                        class="mb-1 text-4xl font-black italic text-white md:text-5xl"
                    >
                        {stat.value}
                    </h3>
                    <p
                        class="w-full max-w-[100px] border-t border-white/20 pt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200 md:text-xs"
                    >
                        {stat.label}
                    </p>
                </div>
            {/each}
        </div>
    </div>
</section>
