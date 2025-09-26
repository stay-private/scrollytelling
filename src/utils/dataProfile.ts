import profile from 'data-profile';

export const createDataProfile = (csvContent: string) => {
  try {
    // Parse CSV content into array format for data-profile
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header and one data row');
    }

    // Parse CSV into array of arrays
    const data: string[][] = [];
    
    for (const line of lines) {
      const row: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          row.push(current.trim().replace(/^"|"$/g, ''));
          current = '';
        } else {
          current += char;
        }
      }
      
      row.push(current.trim().replace(/^"|"$/g, ''));
      data.push(row);
    }

    // Use data-profile's summary function with array data
    const summary = profile(data);
    
    return summary;

  } catch (error) {
    console.error('Error creating data profile:', error);
    throw new Error('Failed to analyze CSV data structure');
  }
};