<script lang="ts">
    import { page } from '$app/stores';
    import { NAV_LINKS, SOCIAL_LINKS } from '$lib/constants';
    import SocialIcon from '$lib/components/ui/SocialIcon.svelte';
    import logo from "$lib/assets/psgl-logo-125.png";
    import RealCarbonFibre from "$lib/assets/real-carbon-fibre.png";
    import { Menu, X } from '@lucide/svelte';

    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

    $: isActive = (href: string) => {
        if (href === '/') return $page.url.pathname === '/';
        return $page.url.pathname.startsWith(href);
    };
</script>

<header
    class="absolute top-0 left-0 right-0 z-50 flex flex-col border-b border-psgl-blue/70"
>
    {#if $page.url.pathname !== '/'}
    <div class="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <!-- Background Container -->
        <div class="absolute top-0 left-0 w-full h-screen overflow-hidden pointer-events-none">
            <div class="bg-hero-gradient absolute inset-0 opacity-90"></div>
            <div
                class="absolute inset-0 opacity-20 mix-blend-screen"
                style={`background-image: url('${RealCarbonFibre}')`}
            ></div>

            <!-- Decorative Racing Lines -->
            <div
                class="bg-psgl-blue/10 absolute top-0 right-[-10%] h-full w-[40%] -skew-x-12 origin-top border-l border-white/5"
            ></div>
            <div
                class="absolute bottom-0 left-[-10%] h-full w-[30%] -skew-x-12 origin-top border-r border-white/5 bg-white/5"
            ></div>
        </div>
    </div>
    {/if}
    <div class="absolute inset-0 -z-5 bg-black/20 backdrop-blur-sm"></div>

    <div class="flex items-center justify-between p-4 lg:p-6">
        <a href="/" class="flex items-center gap-4">
            <div class="flex h-12 w-12 items-center justify-center">
                <img
                    src={logo}
                    alt="PSGL logo"
                    class="h-full w-full object-contain"
                />
            </div>
            <span class="text-5xl font-black uppercase text-white lg:block">
                PSGL
            </span>
        </a>

        <nav class="hidden lg:flex items-center gap-8">
            {#each NAV_LINKS as link}
                <a
                    href={link.href}
                    class="text-sm font-bold uppercase tracking-widest transition-colors hover:text-white border-b-2 py-1 {isActive(link.href) ? 'text-white border-psgl-blue' : 'text-white/70 border-transparent'}"
                >
                    {link.name}
                </a>
            {/each}
        </nav>

        <div class="hidden lg:flex gap-2">
            {#each SOCIAL_LINKS as link}
                <SocialIcon icon={link.icon} url={link.url} />
            {/each}
        </div>

        <!-- Mobile Menu Button -->
        <button
            class="text-white lg:hidden"
            onclick={toggleMenu}
            aria-label="Toggle menu"
        >
            {#if isMenuOpen}
                <X size={32} />
            {:else}
                <Menu size={32} />
            {/if}
        </button>
    </div>

    <!-- Mobile Menu Dropdown -->
    {#if isMenuOpen}
        <div class="flex flex-col gap-2 border-t border-white/10 bg-black/95 p-4 backdrop-blur-xl lg:hidden">
            <nav class="flex flex-col gap-2">
                {#each NAV_LINKS as link}
                    <a
                        href={link.href}
                        class="text-xl font-bold uppercase tracking-widest text-center transition-colors py-3 border-b border-white/10 hover:text-white {isActive(link.href) ? 'text-psgl-blue' : 'text-white/70'}"
                        onclick={toggleMenu}
                    >
                        {link.name}
                    </a>
                {/each}
            </nav>

            <div class="flex flex-wrap gap-4 mt-2">
                {#each SOCIAL_LINKS as link}
                    <SocialIcon icon={link.icon} url={link.url} />
                {/each}
            </div>
        </div>
    {/if}

</header>
