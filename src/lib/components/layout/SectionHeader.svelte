<script lang="ts">
    export let title: string;
    export let subTitle: string = '';
    export let highlight: string
    export let align: "left" | "center" | "right" = "center";

    const alignMap = {
        left: { container: "items-start text-left", accent: "self-start" },
        center: { container: "items-center text-center", accent: "self-center" },
        right: { container: "items-end text-right", accent: "self-end" }
    } as const;

    $: containerClasses = alignMap[align]?.container ?? alignMap.center.container;
    $: accentClass = alignMap[align]?.accent ?? alignMap.center.accent;
</script>

<div class={`flex flex-col ${containerClasses}`}>
    {#if subTitle}
        <div class={`mb-2 flex items-center gap-2 ${accentClass}`}>
            <div class="bg-psgl-blue h-1 w-8"></div>
            <span
                class="text-psgl-blue text-sm font-bold uppercase tracking-widest"
                >{subTitle}</span
            >
        </div>
    {/if}
    <h2 class="mb-4 text-5xl font-black uppercase text-white md:text-6xl">
        {title} <span class="from-psgl-blue bg-linear-to-r to-blue-600 bg-clip-text text-transparent">{highlight}</span>
    </h2>
    <div class={`bg-psgl-blue h-2 w-32 -skew-x-12 transform ${accentClass}`}></div>
</div>
