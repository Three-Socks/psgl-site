<script lang="ts">
  import Header from "$lib/components/layout/Header.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";

  const { headerPadding = true, children } = $props();
</script>

<div class="min-h-screen overflow-x-hidden font-display text-white selection:bg-blue-600 selection:text-white">
  <Header />
  <main class={`${headerPadding ? "pt-32 pb-32" : ""}`}>
    {@render children()}
  </main>
  <Footer />
</div>
