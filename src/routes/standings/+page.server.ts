import type { StandingsTier } from '$lib/types';

export const load = async ({ parent }) => {
    const { tiers } = await parent();

    return {
        tiers: tiers as StandingsTier[]
    };
};
