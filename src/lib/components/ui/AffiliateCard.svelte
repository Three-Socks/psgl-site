<script lang="ts">
    import type { Affiliate } from "$lib/types";
    import { ExternalLink, Copy, Check } from "@lucide/svelte";
    import DecorativeCorners from "$lib/components/ui/DecorativeCorners.svelte";

    export let item: Affiliate;
    export let widthClass = "sm:w-90";
    export let ctaLabel = "Visit";
    export let titleSizeClass = "text-2xl";

    let copiedCode: string | null = null;

    function copyCode(e: MouseEvent, code: string | undefined) {
        if (!code) return;
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        copiedCode = code;
        setTimeout(() => {
            if (copiedCode === code) copiedCode = null;
        }, 2000);
    }
</script>

<a
    href={item.link}
    class={`hover:border-psgl-blue group relative flex w-full flex-col items-center border border-transparent bg-gray-900/30 p-4 text-center transition-all duration-500 ${widthClass}`}
>
    {#if item.partner}
        <DecorativeCorners />
    {/if}
    {#if "logoPath" in item}
        <div class="mb-4 flex h-20 w-full items-center justify-center">
            <img
                src={item.logoPath}
                alt={item.name}
                class="max-h-full object-contain"
                loading="lazy"
            />
        </div>
    {/if}

    <h3 class={`mb-2 ${titleSizeClass} font-black italic text-white`}>
        {item.name}
    </h3>
    {#if item.description}
        <p class="mb-6 text-sm font-medium leading-relaxed whitespace-pre-line text-gray-300">
            {item.description}
        </p>
    {/if}

    {#if item.code}
        <button
            class={`flex items-center gap-2 mb-5 rounded cursor-pointer border border-white/10 bg-psgl-dark px-3 py-1 text-sm font-mono font-bold tracking-widest text-white transition-colors hover:border-psgl-blue/50`}
            on:click={(e) => copyCode(e, item.code)}
        >
            {#if copiedCode === item.code}
                <span class="text-green-400">COPIED</span>
                <Check class="h-4 w-4 text-green-400" />
            {:else}
                {item.discount}: <span class="text-psgl-blue">{item.code}</span>
                <Copy class="h-4 w-4 text-white/50" />
            {/if}
        </button>
    {/if}

    <div class="text-psgl-blue mt-auto flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 group-hover:text-white">
        {ctaLabel} <ExternalLink class="h-3.5 w-3.5" />
    </div>
</a>
