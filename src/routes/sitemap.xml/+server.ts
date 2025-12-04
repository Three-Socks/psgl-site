import fs from "node:fs";
import path from "node:path";
import { SITE_URL, NAV_LINKS } from "$lib/constants";

export const prerender = true;

export async function GET() {
    const pagesDir = path.join(process.cwd(), "src/lib/content/pages");
    let pages: { loc: string; lastmod?: string; changefreq?: string }[] = [];

    if (fs.existsSync(pagesDir)) {
        const files = fs.readdirSync(pagesDir);
        pages = files
            .filter((file) => file.endsWith(".md"))
            .map((file) => {
                const filePath = path.join(pagesDir, file);
                const stats = fs.statSync(filePath);
                return {
                    loc: `/page/${file.replace(".md", "")}`,
                    lastmod: stats.mtime.toISOString().split("T")[0]
                };
            });
    }

    const staticPages = NAV_LINKS.map((link) => ({
        loc: link.href,
        lastmod: undefined,
        changefreq: "weekly"
    }));

    const allPages = [...staticPages, ...pages];

    const sitemap = `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
    xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="https://www.w3.org/1999/xhtml"
    xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
    xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
    xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
    xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
    ${allPages
        .map((page) => {
            return `
    <url>
        <loc>${SITE_URL}${page.loc}</loc>
        ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ""}
        ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
    </url>
            `;
        })
        .join("")}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "max-age=0, s-maxage=3600",
        },
    });
}
