export const createScrollytellingPrompt = (csvContent: string, fileName: string): string => {
  return `You are an expert web developer and data storyteller. Generate a **fully working HTML page** for scrollytelling using this CSV data:

CSV File: "${fileName}"
Content:
${csvContent}

Requirements:

1. Complete, self-contained HTML5 file with **inline CSS and JavaScript only**.
2. Sections:
   - Hero: page title and brief overview.
   - Key Insights (3–5 major findings), each with charts or visuals.
   - Data Exploration: filterable and sortable table of the CSV data.
   - Conclusion: key takeaways.
3. Use **Chart.js via CDN**: https://cdn.jsdelivr.net/npm/chart.js for charts.
4. Use **intersection observer** for scroll-triggered animations (fade-ins, slide-ups).
5. Modern, responsive design, suitable for desktop and mobile.
6. All HTML tags, IDs, and JavaScript variables must be correct and fully match.
7. Include **meta tags for SEO and social sharing**.
8. The page should run directly in a browser **without errors**.
9. **Return ONLY the full HTML code**, no markdown, no explanations, no comments.

The page must provide a visually engaging scrollytelling experience that reveals insights from the data as the user scrolls.`;
};

