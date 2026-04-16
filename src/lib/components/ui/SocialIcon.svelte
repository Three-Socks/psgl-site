<script lang="ts">
    import type { Component } from "svelte";

    type IconComponent = Component<{ color?: string; size?: number; title?: string; class?: string }>;

    let { icon: Icon, url, name, class: className = "h-4 w-4" }: { icon: IconComponent, url: string, name: string, class?: string } = $props();
    let isHovered = $state(false);
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a href="{url}"
    target="_blank"
    aria-label={name}
    class="flex h-10 w-10 -skew-x-12 items-center justify-center border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
>
    <Icon
        class={`skew-fix transition-colors duration-300 ${className}`}
        title={name}
        color={isHovered ? "white" : "currentColor"}
    />
</a>
