<script lang="ts">
    import type { SimpleIcon } from "simple-icons";

    let { icon, url, class: className = "h-4 w-4" }: { icon: SimpleIcon, url: string, class?: string } = $props();
    let isHovered = $state(false);
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -->
<a href="{url}"
    target="_blank"
    aria-label="{icon.title}"
    class="flex h-10 w-10 -skew-x-12 items-center justify-center border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
    onmouseenter={() => (isHovered = true)}
    onmouseleave={() => (isHovered = false)}
>
    <svg
        class="skew-fix transition-colors duration-300 {className}"
        role="img"
        aria-label={icon.title}
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        style:fill={isHovered ? (icon.hex === "000000" ? "#FFFFFF" : `#${icon.hex}`) : "currentColor"}
    >
        <path d={icon.path} />
    </svg>
</a>