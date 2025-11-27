
<script lang="ts">
    import { DISCORD_LINK, LEAGUES } from "$lib/constants";
    import { MessageSquare } from "@lucide/svelte";
    import SectionHeader from "$lib/components/layout/SectionHeader.svelte";
</script>

<section class="relative z-10 w-full py-20 bg-psgl-dark">
    <div class="mx-auto max-w-7xl px-4">
        <SectionHeader title="Our" highlight="Leagues" />

        <div class="mt-16 grid gap-8 md:grid-cols-3">
            {#each LEAGUES as league}
                <div class="hover:border-psgl-blue group relative flex flex-col overflow-hidden border border-transparent bg-gray-900/30 hover:bg-gray-900 hover:-translate-y-1">
                    <!-- Decorative corners -->
                    <div
                        class="z-30 border-psgl-blue transition-opacity duration-500 group-hover:opacity-0 absolute top-0 left-0 h-4 w-4 border-t-2 border-l-2"
                    ></div>
                    <div
                        class="z-30 border-psgl-blue transition-opacity duration-500 group-hover:opacity-0 absolute top-0 right-0 h-4 w-4 border-t-2 border-r-2"
                    ></div>
                    <div
                        class="z-30 border-psgl-blue transition-opacity duration-500 group-hover:opacity-0 absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2"
                    ></div>
                    <div
                        class="z-30 border-psgl-blue transition-opacity duration-500 group-hover:opacity-0 absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2"
                    ></div>

                    <!-- Image Container (16:9) -->
                    <div class="relative aspect-video w-full overflow-hidden">
                        <div class="absolute inset-0 z-10"></div>
                        <picture>
                            {#if league.imageWebp}
                                <source srcset={league.imageWebp} type="image/webp" />
                            {/if}
                            <img
                                src={league.image}
                                alt={league.name}
                                class="h-full w-full object-cover"
                                loading="lazy"
                            />
                        </picture>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 flex flex-1 flex-col p-8">
                        <div class="mb-4 flex">
                            <div class="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1">
                                <div class="h-2 w-2 {league.signupsOpen ? 'bg-green-500 animate-pulse' : 'bg-red-500'}"></div>
                                <span class="text-xs font-bold uppercase tracking-wider text-white">
                                    SIGN-UPS {league.signupsOpen ? 'OPEN' : 'CLOSED'}
                                </span>
                            </div>
                        </div>

                        <h3 class="mb-3 text-2xl font-black uppercase text-white group-hover:text-psgl-blue transition-colors">
                            {league.name}
                        </h3>

                        <p class="text-sm text-gray-400 font-light leading-relaxed">
                            {league.description}
                        </p>
                    </div>
                </div>
            {/each}
        </div>

        <div class="mt-16 flex justify-center">
            <a
                href="{DISCORD_LINK}"
                target="_blank"
                rel="noreferrer"
                class="btn-primary"
            >
                <MessageSquare class="h-5 w-5" />
                <span>Join On Discord</span>
            </a>
        </div>
    </div>
</section>
