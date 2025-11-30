import { DISCORD_LINK } from "$lib/constants";
import { redirect } from "@sveltejs/kit";

export const load = () => {
    throw redirect(302, DISCORD_LINK);
};
