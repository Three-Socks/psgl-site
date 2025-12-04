<script lang="ts">
    import { PARTNERS, AFFILIATE_LINKS } from "$lib/constants";
    import SectionHeader from "$lib/components/layout/SectionHeader.svelte";
    import AffiliateCard from "$lib/components/ui/AffiliateCard.svelte";

    const partnerHighlight = PARTNERS.length > 1 ? "Partners" : "Partner";
</script>

<section class="border-t border-white/10 bg-psgl-dark py-24">
    <div class="mx-auto max-w-7xl px-4">
        <SectionHeader title="Official" highlight={partnerHighlight} />

        <div class="mt-16 flex flex-wrap justify-center gap-6">
            {#each PARTNERS as partner (partner.name)}
                <AffiliateCard
                    item={partner}
                    ctaLabel="Visit Partner"
                    widthClass="sm:w-90"
                    titleSizeClass="text-2xl"
                />
            {/each}
        </div>

        <div class="mt-16">
            <div class="mb-8 flex items-center justify-center gap-4">
                <div class="h-px w-20 bg-white/10"></div>
                <h3 class="text-sm font-bold uppercase tracking-[0.2em] text-white/60">Affiliate Links</h3>
                <div class="h-px w-20 bg-white/10"></div>
            </div>

            <div class="flex flex-wrap justify-center gap-3">
                {#each AFFILIATE_LINKS as link (link.name)}
                    <AffiliateCard
                        item={link}
                        ctaLabel="Visit"
                        widthClass="sm:w-70"
                        titleSizeClass="text-xl"
                    />
                {/each}
            </div>
        </div>
    </div>
</section>
