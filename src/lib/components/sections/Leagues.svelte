
<script lang="ts">
    import { LEAGUES } from "$lib/constants";
    import { siDiscord } from "simple-icons";
    import SectionHeader from "$lib/components/layout/SectionHeader.svelte";
    import DecorativeCorners from "$lib/components/ui/DecorativeCorners.svelte";
    import { resolve } from "$app/paths";
</script>

<section class="relative z-10 w-full py-20 bg-psgl-dark">
    <div class="mx-auto max-w-7xl px-4">
        <SectionHeader title="Our" highlight="Leagues" />

        <div class="mt-16 grid gap-8 md:grid-cols-3">
            {#each LEAGUES as league (league.name)}
                <div class="hover:border-psgl-blue group relative flex flex-col overflow-hidden border border-transparent bg-gray-900/30 transition-all duration-500 hover:bg-gray-900">
                    <DecorativeCorners zIndex="z-30" />

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
                                <div class="h-2 w-2 {league.signupsOpen ? "bg-green-500 animate-pulse" : "bg-red-500"}"></div>
                                <span class="text-xs font-bold uppercase tracking-wider text-white">
                                    SIGN-UPS {league.signupsOpen ? "OPEN" : "CLOSED"}
                                </span>
                            </div>
                        </div>

                        <h3 class="mb-3 text-2xl font-black uppercase text-white group-hover:text-psgl-blue transition-colors duration-300">
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
