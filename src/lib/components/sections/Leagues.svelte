
<script lang="ts">
    import type { HomepageLeagueCard } from "$lib/types";
    import { siDiscord } from "simple-icons";
    import SectionHeader from "$lib/components/layout/SectionHeader.svelte";
    import DecorativeCorners from "$lib/components/ui/DecorativeCorners.svelte";
    import { resolve } from "$app/paths";

    let { leagues = [] }: { leagues: HomepageLeagueCard[] } = $props();
</script>

<section class="relative z-10 w-full py-20 bg-psgl-dark">
    <div class="mx-auto max-w-7xl px-4">
        <SectionHeader title="Our" highlight="Leagues" />

        <div class="mt-16 grid gap-8 md:grid-cols-3">
            {#each leagues as league (league.id)}
                <div class="hover:border-psgl-blue group relative flex flex-col overflow-hidden border border-transparent bg-gray-900/30 transition-all duration-500 hover:bg-gray-900">
                    <DecorativeCorners zIndex="z-30" />

                    <!-- Image Container (16:9) -->
                    <div class="relative aspect-video w-full overflow-hidden">
                        <div class="absolute inset-0 z-10"></div>
                        <picture>
                            {#if league.imageWebp}
                                <source srcset={league.imageWebp} type="image/webp" />
                            {/if}
                            {#if league.image}
                                <img
                                    src={league.image}
                                    alt={league.title}
                                    class="h-full w-full object-cover"
                                    loading="lazy"
                                />
                            {/if}
                        </picture>
                    </div>

                    <!-- Content -->
                    <div class="relative z-10 flex flex-1 flex-col p-8">
                        <h3 class="mb-3 text-2xl font-black uppercase text-white group-hover:text-psgl-blue transition-colors duration-300">
                            {league.title}
                        </h3>

                        <div class="mb-3 flex flex-wrap gap-3">
                            {#each league.entries as entry (entry.id)}
                                <div class="flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-1">
                                    <div
                                        class="h-2 w-2"
                                        style={`background-color: ${entry.color ?? (entry.closed ? "#ef4444" : "#22c55e")};`}
                                    ></div>
                                    <span class="text-xs font-bold uppercase tracking-widest text-white">
                                        {(entry.platform ?? "") + (entry.platform && entry.phase ? " " : "") + (entry.phase ?? " Sign Ups")}
                                    </span>
                                    <span class={`text-xs font-bold uppercase tracking-widest ${entry.closed ? "text-red-500" : "text-green-500"}`}>
                                        {entry.closed ? "Closed" : "Open"}
                                    </span>
                                </div>
                            {/each}
                        </div>

                        <p class="text-sm text-gray-400 font-light leading-relaxed">
                            {league.description}
                        </p>

                    </div>
                </div>
            {/each}
        </div>

        <div class="mt-16 flex justify-center">
            <a
                href="{resolve("/discord")}"
                target="_blank"
                rel="noreferrer"
                class="btn-primary"
            >
                <svg role="img" viewBox="0 0 24 24" class="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <title>{siDiscord.title}</title>
                    <path d={siDiscord.path} />
                </svg>
                <span>Join On Discord</span>
            </a>
        </div>
    </div>
</section>
