<script lang="ts">
    import StandingsViewer from "#lib/components/sections/StandingsViewer.svelte";
    import PageShell from "#lib/components/layout/PageShell.svelte";
    import PageSection from "#lib/components/layout/PageSection.svelte";

    let { data } = $props();
</script>

<svelte:head>
    <title>PSGL | Standings</title>
    <meta name="description" content={`${data.currentSeason} league standings for PC and console.`} />
</svelte:head>

<PageShell>
    <PageSection>
        <StandingsViewer tiers={data.tiers} currentSeason={data.currentSeason} />
    </PageSection>
</PageShell>
