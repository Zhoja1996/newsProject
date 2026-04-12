export const generateSummary = (title: string, description: string) => {
    const cleanTitle = title.trim();
    const cleanDescription = description.trim();
  
    const sentences = cleanDescription
      .split(/(?<=[.!?])\s+/)
      .map(sentence => sentence.trim())
      .filter(Boolean);
  
    const shortSummary = [cleanTitle, ...sentences.slice(0, 2)].join(". ");
  
    const keyPoints = [
      cleanTitle,
      ...sentences.slice(0, 2),
    ]
      .map(point => point.trim())
      .filter(Boolean);
  
    return {
      shortSummary,
      keyPoints,
    };
  };