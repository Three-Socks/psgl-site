<script>
    import StandingsViewer from "$lib/components/sections/StandingsViewer.svelte";
    import PageShell from "$lib/components/layout/PageShell.svelte";
    import PageSection from "$lib/components/layout/PageSection.svelte";
</script>

<svelte:head>
    <title>PSGL | Standings</title>
    <meta name="description" content="Season 40 standings." />
</svelte:head>

<PageShell>
    <PageSection>
        <StandingsViewer />
    </PageSection>
</PageShell>
