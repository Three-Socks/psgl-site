<script lang="ts">
	import PageShell from "$lib/components/layout/PageShell.svelte";
	import PageSection from "$lib/components/layout/PageSection.svelte";

let { data } = $props();

const capitalizeFirst = (raw?: string) => {
    if (!raw) return "";
    const firstChar = raw[0];
    if (!firstChar) return "";
    return firstChar.toUpperCase() + raw.slice(1);
};

</script>

<svelte:head>
    <title>PSGL | {capitalizeFirst(data.title)}</title>
</svelte:head>

<PageShell>
	<PageSection>
		<div class="prose prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-psgl-blue hover:prose-a:text-white prose-strong:text-white prose-code:text-psgl-accent">
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			{@html data.content}
		</div>
	</PageSection>
</PageShell>
