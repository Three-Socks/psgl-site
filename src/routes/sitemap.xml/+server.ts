import fs from "node:fs";
import path from "node:path";
import { SITE_URL, NAV_LINKS } from "#lib/constants.ts";

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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
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
