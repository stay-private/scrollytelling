export const createScrollytellingPrompt = (csvContent: string, fileName: string): string => {
  return `You are an expert data storyteller and web developer. I have uploaded a CSV file named "${fileName}" with the following content:

${csvContent}

Please create a complete, self-contained HTML file that tells a compelling scrollytelling story about this data. The HTML should:

1. **Be completely self-contained** - include all CSS and JavaScript inline, no external dependencies
2. **Create a scrollytelling experience** - content reveals as the user scrolls down
3. **Include data visualizations** - use Chart.js (via CDN) or D3.js (via CDN) or pure CSS/SVG for charts
4. **Have these sections:**
   - Hero section with compelling title and overview
   - Key insights sections (3-5 major findings)
   - Interactive charts and visualizations
   - Data exploration section with filterable/sortable table
   - Conclusion with takeaways
5. **Modern, beautiful design** - use a clean, professional aesthetic
6. **Responsive layout** - works on mobile and desktop
7. **Smooth animations** - fade-ins, slide-ups as content enters viewport
8. **Include the raw data** - embed the CSV data in JavaScript for interactivity

Technical requirements:
- Use modern HTML5, CSS3, and vanilla JavaScript
- Include Chart.js from CDN for charts: https://cdn.jsdelivr.net/npm/chart.js
- Use intersection observer for scroll-triggered animations
- Make it production-ready with proper error handling
- Include meta tags for SEO and social sharing

The story should be engaging, insightful, and reveal meaningful patterns in the data. Make it visually stunning and professionally designed.

Return ONLY the complete HTML code, no explanations or markdown formatting.`;
};