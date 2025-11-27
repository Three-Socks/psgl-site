<script lang="ts">
  const { className = "", children } = $props();
</script>

<section class={`px-4 md:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto ${className}`}>
  {@render children()}
</section>
