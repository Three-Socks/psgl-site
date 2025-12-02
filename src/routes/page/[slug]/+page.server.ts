import { error } from "@sveltejs/kit";
import { marked } from "marked";
import fs from "node:fs";
import path from "node:path";
import type { EntryGenerator } from "./$types";

export const prerender = true;

export const entries: EntryGenerator = () => {
    const pagesDir = path.join(process.cwd(), "src/lib/content/pages");
    if (!fs.existsSync(pagesDir)) {
        return [];
    }
    const files = fs.readdirSync(pagesDir);
    return files
        .filter((file) => file.endsWith(".md"))
        .map((file) => ({ slug: file.replace(".md", "") }));
};

export const load = async ({ params }) => {
    const { slug } = params;
    const filePath = path.join(process.cwd(), "src/lib/content/pages", `${slug}.md`);

    if (!fs.existsSync(filePath)) {
        error(404, "Page not found");
    }

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const html = await marked.parse(fileContent);

    return {
        content: html,
        title: slug
    };
};
