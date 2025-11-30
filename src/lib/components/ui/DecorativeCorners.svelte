<script lang="ts">
    export let zIndex: string = "";

    const corners = [
        "top-0 left-0 border-t border-l",
        "top-0 right-0 border-t border-r",
        "bottom-0 left-0 border-b border-l",
        "bottom-0 right-0 border-b border-r"
    ];
</script>

{#each corners as corner (corner)}
    <div
        class="{zIndex} border-psgl-blue transition-opacity duration-500 group-hover:opacity-0 absolute {corner} h-4 w-4"
    ></div>
{/each}
