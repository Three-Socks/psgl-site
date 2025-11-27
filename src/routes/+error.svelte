<script lang="ts">
    import { page } from '$app/stores';
    import PageShell from "$lib/components/layout/PageShell.svelte";
    import { ArrowLeft } from "@lucide/svelte";
</script>

<svelte:head>
    <title>404 | PSGL</title>
    <meta name="robots" content="noindex" />
</svelte:head>

<PageShell headerPadding={false}>
    <section class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
        <div class="relative z-10 flex max-w-4xl flex-col items-center px-4 text-center">
            <div class="relative mb-6">
                <h1
                    class="text-9xl font-black leading-none text-white md:text-[10rem]"
                >
                    <span class="text-psgl-blue">4</span>0<span class="text-psgl-blue">4</span>
                </h1>
            </div>

            <p class="mb-10 max-w-lg text-lg font-light text-gray-300">
                The page you are looking for does not exist or has been moved.
            </p>

            <div class="flex flex-col">
                <a
                    href="/"
                    class="btn-primary group"
                >
                    <ArrowLeft class="h-5 w-5" />
                    <span>Go Home</span>
                </a>
            </div>
        </div>
    </section>
</PageShell>
