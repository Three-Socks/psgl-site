import { DISCORD_LINK } from "#lib/constants.ts";
import { redirect } from "@sveltejs/kit";

export const load = () => {
    redirect(302, DISCORD_LINK, { external: true });
};
