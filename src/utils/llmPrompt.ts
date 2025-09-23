export const createScrollytellingPrompt = (csvContent: string, fileName: string): string => {
  return `You are an expert web developer and data storyteller. Generate a **fully working HTML page** for scrollytelling using this CSV data:

CSV File: "${fileName}"
Content:
${csvContent}

Requirements:

1. Complete, self-contained HTML5 file with **inline CSS and JavaScript only**.
2. Use **D3.js v7** via CDN: https://d3js.org/d3.v7.min.js
3. Use **Scrollama** via CDN: https://unpkg.com/scrollama
4. **Two-column responsive layout**:
   - LEFT: Scrollable steps container with multiple step panels
   - RIGHT: Sticky chart container (100vh height, position: sticky)
5. **Multiple charts in sequence**:
   - The scrollytelling section should be divided into multiple chart blocks (e.g., bar chart, line chart, heatmap, etc.).
   - Each block has its own 3–5 scroll steps.
   - For each block, initialize ONE SVG inside the sticky chart container that mutates across its steps.
   - When moving to the next block, replace the chart with a new visualization type.
6. **Scrollama integration**:
   - Initialize scrollama to track step enter/exit events
   - Each step should trigger smooth D3 transitions, highlights, filtering, or chart re-layouts
   - Transitions must be smooth and stateful within each chart type
7. Sections structure:
   - Hero: page title and overview
   - Scrollytelling: multiple chart blocks with left steps + right sticky chart
   - Data Exploration: filterable and sortable table of CSV data
   - Conclusion: key takeaways
8. **Responsive design** that works on desktop and mobile
9. Include **meta tags for SEO and social sharing**
10. The page must run directly in a browser **without console errors**
11. **Return ONLY the complete HTML code** - no markdown, no explanations, no comments outside the HTML

The scrollytelling section must clearly show:  
- Different chart types in sequence (e.g., bar chart block, then line chart block, then another chart type).  
- Each chart block has its own scroll steps that reveal insights before moving to the next chart.`;
};

