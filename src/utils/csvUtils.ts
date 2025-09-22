export const parseCSV = (csvContent: string): string[][] => {
  const lines = csvContent.split('\n');
  const result: string[][] = [];
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    const row: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    row.push(current.trim());
    result.push(row);
  }
  
  return result;
};

export const getCSVPreview = (csvContent: string, maxRows: number = 5): string => {
  const lines = csvContent.split('\n').slice(0, maxRows);
  return lines.join('\n');
};