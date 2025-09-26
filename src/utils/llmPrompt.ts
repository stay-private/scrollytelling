export const createScrollytellingPrompt = (dataProfile: any, fileName: string, storyStyle?: string, userPrompt?: string): string => {
  const systemPrompt = `You are an expert web developer and data storyteller specializing in creating engaging scrollytelling experiences. You have deep expertise in:

- D3.js v7 for data visualization
- Scrollama for scroll-driven animations
- Responsive web design and UX best practices
- Data analysis and narrative construction
- Modern HTML5, CSS3, and JavaScript

Your task is to create compelling, interactive data stories that reveal insights through smooth scroll-driven animations and visualizations.`;

  const mainPromptContent = `Generate a **fully working HTML page** for scrollytelling based on the analyzed CSV data profile below.

Requirements:

1. **Complete, self-contained HTML5 file** with inline CSS and JavaScript only
2. **Libraries via CDN**:
   - D3.js v7: https://d3js.org/d3.v7.min.js
   - Scrollama: https://unpkg.com/scrollama
3. **Layout Structure**:
   - Hero section with title and overview
   - **Scrollytelling section with TWO-COLUMN layout**:
     - LEFT: Scrollable steps container (each step = 100vh height exactly)
     - RIGHT: Sticky chart container (100vh height, position: sticky)
   - Conclusion with key takeaways
4. **Scrollytelling Rules**:
   - **EXACTLY 1 story point per 100vh** - each step must be exactly 100vh in height
   - Create 8-12 total steps across multiple chart types
   - Group steps into 2-3 chart blocks (e.g., 4 steps for bar chart, 4 steps for line chart, 4 steps for scatter plot)
   - Each chart block uses ONE SVG that mutates smoothly across its steps
   - When transitioning between chart blocks, replace with new visualization type
5. **Scrollama Integration**:
   - Initialize scrollama to track step enter/exit events
   - Smooth D3 transitions for each step (duration: 750ms)
   - Progressive data revelation and highlighting
6. **Responsive Design**:
   - Works on desktop and mobile
   - Proper breakpoints and mobile-first approach
7. **Performance**:
   - Efficient D3 data binding and updates
   - Smooth 60fps animations
   - No console errors
8. **SEO & Accessibility**:
   - Proper meta tags for social sharing
   - Alt text for visualizations
   - Semantic HTML structure

${storyStyle ? `**Story Style**: ${storyStyle}` : ''}
${userPrompt ? `**Additional Instructions**: ${userPrompt}` : ''}

**Return ONLY the complete HTML code** - no markdown, no explanations, no comments outside the HTML.`;

  const dataSection = `**CSV Data Profile for "${fileName}":**

\`\`\`json
${JSON.stringify(dataProfile, null, 2)}
\`\`\``;

  return `${systemPrompt}\n\n${mainPromptContent}\n\n${dataSection}`;
};
export const createRefactorPrompt = (refactorInstructions: string, existingHtml: string, dataProfile: any, fileName: string): string => {
  const systemPrompt = `You are an expert web developer and data storyteller specializing in refactoring and improving scrollytelling experiences. You have deep expertise in:

- D3.js v7 for data visualization
- Scrollama for scroll-driven animations
- Responsive web design and UX best practices
- Code refactoring and optimization
- Modern HTML5, CSS3, and JavaScript

Your task is to refactor existing scrollytelling code based on specific user instructions while maintaining the core functionality and improving the overall experience.`;

  const userPrompt = `**REFACTOR TASK**: Modify the existing scrollytelling HTML code based on the user's instructions below.

**User's Refactor Instructions:**
${refactorInstructions}

**Requirements for Refactoring:**

1. **Maintain Core Structure**: Keep the existing layout and scrollytelling functionality intact
2. **Apply User Changes**: Implement exactly what the user requested
3. **Preserve Working Code**: Don't break existing functionality unless specifically asked to change it
4. **Complete HTML Output**: Return the full, working HTML file with all changes applied
5. **Libraries**: Continue using the same CDN libraries (D3.js v7, Scrollama)
6. **Performance**: Ensure changes don't negatively impact performance
7. **Responsive Design**: Maintain or improve responsive behavior

**Data Context for Reference:**
CSV File: "${fileName}"

\`\`\`json
${JSON.stringify(dataProfile, null, 2)}
\`\`\`

**Current HTML Code to Refactor:**

\`\`\`html
${existingHtml}
\`\`\`

**Return ONLY the complete refactored HTML code** - no markdown, no explanations, no comments outside the HTML.`;

  return `${systemPrompt}\n\n${userPrompt}`;
};