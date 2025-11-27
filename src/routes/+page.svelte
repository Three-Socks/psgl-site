<script>
    import Hero from "$lib/components/sections/Hero.svelte";
    import Stats from "$lib/components/sections/Stats.svelte";
    import Leagues from "$lib/components/sections/Leagues.svelte";
    import PageShell from "$lib/components/layout/PageShell.svelte";
</script>

<svelte:head>
    <title>PSGL | Premier Sim Gaming League</title>
    <meta name="description" content="The biggest Formula 1 racing gaming league on PlayStation & PC" />
</svelte:head>

<PageShell headerPadding={false}>
        <Hero />
        <Leagues />
        <Stats />
</PageShell>
