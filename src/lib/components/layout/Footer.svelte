<script lang="ts">
    import Affiliates from "$lib/components/sections/Affiliates.svelte";
    import logo from "$lib/assets/psgl-logo-125.png";
    const currentYear = new Date().getFullYear();

    let logoActive = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const activateLogo = () => {
        clearTimeout(timeoutId);
        logoActive = true;
    };

    const deactivateLogo = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            logoActive = false;
        }, 500);
    };
</script>

<Affiliates />
<footer class="relative border-t border-white/10 bg-black py-12">
    <div
        class="absolute top-0 left-0 h-px w-full bg-linear-to-r from-transparent to-transparent opacity-50"
    ></div>

    <div
        class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 lg:flex-row"
    >
        <div class="flex items-center gap-4 group">
            <div
                class="logo-container group relative flex h-10 w-10 items-center select-none justify-center overflow-visible"
                class:active={logoActive}
                on:pointerenter={activateLogo}
                on:pointerleave={deactivateLogo}
                on:pointerdown={activateLogo}
                on:pointerup={deactivateLogo}
                on:pointercancel={deactivateLogo}
            >
                <div
                    class="speed-lines pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden="true"
                >
                    <div class="speed-line"></div>
                    <div class="speed-line"></div>
                    <div class="speed-line"></div>
                </div>

                <div
                    class="sparks-container pointer-events-none absolute bottom-0 left-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    aria-hidden="true"
                >
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                    <div class="spark"></div>
                </div>

                <img
                    src={logo}
                    alt="PSGL logo"
                    class="logo-img relative z-10 h-full w-full object-contain transition-all duration-300"
                />
            </div>
            <span
                class="text-3xl font-black uppercase text-white select-none lg:block"
                class:active={logoActive}
                on:pointerenter={activateLogo}
                on:pointerleave={deactivateLogo}
                on:pointerdown={activateLogo}
                on:pointerup={deactivateLogo}
                on:pointercancel={deactivateLogo}
                >PSGL</span
            >
        </div>

        <div class="text-center lg:text-right">
            <p
                class="mb-1 text-xs font-bold uppercase tracking-widest text-gray-500"
            >
                &copy; {currentYear} Premier Sim Gaming Leagues LTD
            </p>
        </div>
    </div>
</footer>

<style>
    /* F1 Sparks */
    .spark {
        position: absolute;
        bottom: 2px;
        left: 2px;
        width: 4px;
        height: 4px;
        background: radial-gradient(circle, #fff 0%, #ffaa00 50%, transparent 100%);
        border-radius: 50%;
        animation: spark-shoot 0.5s cubic-bezier(0.33, 0, 0.66, 1) infinite;
        animation-play-state: paused;
        opacity: 0;
    }

    .spark::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 12px;
        height: 2px;
        background: linear-gradient(to left, rgba(255, 170, 0, 0.8), transparent);
        transform: translate(-50%, -50%);
        border-radius: 2px;
    }

    @keyframes spark-shoot {
        0% {
            transform: translate(0, 0) scale(0.5);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        100% {
            transform: translate(var(--x), var(--y)) scale(0.2);
            opacity: 0;
        }
    }

    .spark:nth-child(1) {
        --x: -110px;
        --y: -20px;
        animation-delay: 0s;
    }

    .spark:nth-child(2) {
        --x: -130px;
        --y: -38px;
        animation-delay: 0.05s;
    }

    .spark:nth-child(3) {
        --x: -95px;
        --y: -45px;
        animation-delay: 0.1s;
    }

    .spark:nth-child(4) {
        --x: -150px;
        --y: -12px;
        animation-delay: 0.15s;
    }

    .spark:nth-child(5) {
        --x: -105px;
        --y: -55px;
        animation-delay: 0.02s;
    }

    .spark:nth-child(6) {
        --x: -138px;
        --y: -30px;
        animation-delay: 0.08s;
    }

    .spark:nth-child(7) {
        --x: -120px;
        --y: -50px;
        animation-delay: 0.12s;
    }

    .spark:nth-child(8) {
        --x: -88px;
        --y: -25px;
        animation-delay: 0.18s;
    }

    .spark:nth-child(9) {
        --x: -145px;
        --y: -42px;
        animation-delay: 0.04s;
    }

    .spark:nth-child(10) {
        --x: -100px;
        --y: -62px;
        animation-delay: 0.14s;
    }

    .spark:nth-child(11) {
        --x: -125px;
        --y: -22px;
        animation-delay: 0.06s;
    }

    .spark:nth-child(12) {
        --x: -110px;
        --y: -35px;
        animation-delay: 0.16s;
    }

    .spark:nth-child(13) {
        --x: -155px;
        --y: -28px;
        animation-delay: 0.03s;
    }

    .spark:nth-child(14) {
        --x: -90px;
        --y: -40px;
        animation-delay: 0.11s;
    }

    .spark:nth-child(15) {
        --x: -135px;
        --y: -48px;
        animation-delay: 0.07s;
    }

    .logo-container {
        overflow: visible !important;
    }

    .speed-line {
        position: absolute;
        top: 50%;
        right: 80%;
        width: 60px;
        height: 2px;
        background: linear-gradient(to left, rgba(255, 255, 255, 0.1), transparent);
        animation: speed-whoosh 0.4s ease-out infinite;
        animation-play-state: paused;
        transform: translateY(-50%);
    }

    @keyframes speed-whoosh {
        0% {
            transform: translateX(40px) translateY(-50%) scaleX(0.5);
            opacity: 0;
        }
        20% {
            opacity: 1;
        }
        100% {
            transform: translateX(-60px) translateY(-50%) scaleX(1.5);
            opacity: 0;
        }
    }

    .speed-line:nth-child(1) {
        top: 20%;
        animation-delay: 0s;
        width: 70px;
    }

    .speed-line:nth-child(2) {
        top: 40%;
        animation-delay: 0.08s;
        width: 50px;
    }

    .speed-line:nth-child(3) {
        top: 60%;
        animation-delay: 0.16s;
        width: 65px;
    }

    .logo-container.active .speed-lines,
    .logo-container.active .sparks-container {
        opacity: 1;
    }

    .logo-container.active .spark,
    .logo-container.active .speed-line {
        animation-play-state: running;
    }
</style>
