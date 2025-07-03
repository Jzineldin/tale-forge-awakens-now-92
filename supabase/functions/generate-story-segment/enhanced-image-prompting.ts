
// Enhanced image prompting for better story continuity and quality
export function createEnhancedImagePrompt(
  currentSegmentText: string,
  previousSegments: any[] = [],
  storyContext: {
    genre?: string;
    mainCharacters?: Array<{name: string; description: string}>;
    setting?: string;
    artStyle?: string;
  } = {}
): string {
  const { 
    genre = 'fantasy', 
    mainCharacters = [], 
    setting = '', 
    artStyle = 'digital illustration, storybook style' 
  } = storyContext;
  
  // Build character consistency descriptions
  const characterDescriptions = mainCharacters.length > 0
    ? `Characters: ${mainCharacters.map(char => `${char.name} (${char.description})`).join(', ')}`
    : '';
  
  // Build scene context from previous segments for continuity
  const recentContext = previousSegments.slice(-2).map((seg, index) => 
    `Previous scene ${index + 1}: ${seg.segment_text?.substring(0, 100)}...`
  ).join(' ');
  
  // Extract key visual elements from current text
  const visualKeywords = extractVisualKeywords(currentSegmentText);
  
  // Create comprehensive prompt
  const prompt = `
High quality ${artStyle}, ${genre} story illustration.
${setting ? `Setting: ${setting}.` : ''}
${characterDescriptions}
Current scene: ${currentSegmentText.substring(0, 200)}...
${recentContext ? `Story context: ${recentContext}` : ''}
Visual focus: ${visualKeywords.join(', ')}

Style requirements: Consistent character designs, warm cinematic lighting, detailed backgrounds, professional storybook illustration, vibrant colors, engaging composition.
Quality: High detail, masterpiece quality, trending on artstation.
Avoid: Text overlays, logos, watermarks, inconsistent character appearance, low quality.
  `.trim();
  
  return prompt;
}

function extractVisualKeywords(text: string): string[] {
  // Simple keyword extraction for visual elements
  const visualWords = [
    'forest', 'castle', 'dragon', 'knight', 'princess', 'magic', 'sword', 'fire', 'water',
    'mountain', 'village', 'tree', 'flower', 'moon', 'sun', 'star', 'cloud', 'rainbow',
    'house', 'door', 'window', 'bridge', 'river', 'ocean', 'beach', 'cave', 'tower'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  const foundKeywords = words.filter(word => 
    visualWords.some(vw => word.includes(vw) || vw.includes(word))
  );
  
  return foundKeywords.slice(0, 5); // Limit to 5 keywords
}
