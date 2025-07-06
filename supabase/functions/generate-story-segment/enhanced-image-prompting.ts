
// Enhanced image prompting system for visual consistency

export interface VisualContext {
  characters: Record<string, string>;
  setting: string;
  atmosphere: string;
  style: string;
  previousScenes: string[];
}

export function createEnhancedImagePrompt(
  storyText: string,
  previousSegments: any[] = [],
  context: {
    genre?: string;
    mainCharacters?: string[];
    setting?: string;
    artStyle?: string;
  } = {}
): string {
  // Extract key visual elements from story text
  const visualElements = extractVisualElements(storyText);
  
  // Build character consistency from previous segments
  const characterDescriptions = buildCharacterConsistency(previousSegments);
  
  // Determine setting and atmosphere
  const setting = context.setting || extractSetting(storyText, previousSegments);
  const atmosphere = extractAtmosphere(storyText, context.genre);
  
  // Create comprehensive prompt
  let prompt = `${visualElements.mainScene}`;
  
  // Add character consistency
  if (characterDescriptions.length > 0) {
    prompt += `. Characters: ${characterDescriptions.join(', ')}`;
  }
  
  // Add setting continuity
  if (setting) {
    prompt += `. Setting: ${setting}`;
  }
  
  // Add atmosphere and mood
  if (atmosphere) {
    prompt += `. Atmosphere: ${atmosphere}`;
  }
  
  // Add style consistency
  const artStyle = context.artStyle || 'digital storybook illustration, detailed and vibrant';
  prompt += `. Art style: ${artStyle}`;
  
  // Add quality and consistency directives
  prompt += '. Maintain visual continuity with previous scenes, consistent character appearances, professional book illustration quality';
  
  return prompt;
}

function extractVisualElements(text: string): { mainScene: string; characters: string[]; objects: string[] } {
  // Simple extraction - could be enhanced with NLP
  const sentences = text.split('.').filter(s => s.trim().length > 0);
  const mainScene = sentences[0]?.trim() || text.substring(0, 100);
  
  // Extract character mentions (simple approach)
  const characters = extractCharacterMentions(text);
  
  // Extract important objects/props
  const objects = extractObjects(text);
  
  return { mainScene, characters, objects };
}

function extractCharacterMentions(text: string): string[] {
  const pronouns = ['you', 'he', 'she', 'they'];
  const possessives = ['your', 'his', 'her', 'their'];
  const mentions: string[] = [];
  
  // Look for character-related words
  const words = text.toLowerCase().split(/\s+/);
  
  if (words.some(w => pronouns.includes(w) || possessives.includes(w))) {
    mentions.push('protagonist');
  }
  
  return mentions;
}

function extractObjects(text: string): string[] {
  // Simple object extraction - look for nouns that might be visually important
  const importantNouns = [
    'book', 'library', 'door', 'window', 'table', 'chair', 'lamp', 'candle',
    'sword', 'shield', 'treasure', 'chest', 'key', 'map', 'scroll', 'crystal'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  return importantNouns.filter(noun => words.includes(noun));
}

function buildCharacterConsistency(previousSegments: any[]): string[] {
  const descriptions: string[] = [];
  
  // Extract character descriptions from previous segments
  for (const segment of previousSegments) {
    if (segment.segment_text) {
      // Look for character descriptions in previous text
      // This is a simplified approach - could be enhanced
      const text = segment.segment_text.toLowerCase();
      
      if (text.includes('protagonist') || text.includes('you')) {
        descriptions.push('same protagonist as previous scenes');
      }
    }
  }
  
  return descriptions;
}

function extractSetting(text: string, previousSegments: any[]): string {
  const locations = [
    'library', 'forest', 'castle', 'village', 'cave', 'mountain', 'ocean',
    'desert', 'city', 'house', 'room', 'garden', 'tower', 'dungeon'
  ];
  
  const words = text.toLowerCase().split(/\s+/);
  const foundLocation = locations.find(loc => words.includes(loc));
  
  if (foundLocation) {
    return foundLocation;
  }
  
  // Check previous segments for setting continuity
  for (const segment of previousSegments.slice(-2)) { // Last 2 segments
    if (segment.segment_text) {
      const prevWords = segment.segment_text.toLowerCase().split(/\s+/);
      const prevLocation = locations.find(loc => prevWords.includes(loc));
      if (prevLocation) {
        return `continuing in ${prevLocation}`;
      }
    }
  }
  
  return '';
}

function extractAtmosphere(text: string, genre?: string): string {
  const moodWords = {
    mystery: ['mysterious', 'shadowy', 'dimly lit', 'atmospheric'],
    fantasy: ['magical', 'enchanted', 'mystical', 'otherworldly'],
    adventure: ['exciting', 'dynamic', 'action-packed', 'thrilling'],
    horror: ['dark', 'ominous', 'creepy', 'foreboding'],
    romance: ['warm', 'intimate', 'soft lighting', 'romantic'],
    scifi: ['futuristic', 'high-tech', 'sleek', 'advanced']
  };
  
  if (genre && moodWords[genre as keyof typeof moodWords]) {
    return moodWords[genre as keyof typeof moodWords][0];
  }
  
  // Analyze text for mood indicators
  const words = text.toLowerCase();
  if (words.includes('dark') || words.includes('shadow')) return 'dark and atmospheric';
  if (words.includes('bright') || words.includes('light')) return 'bright and welcoming';
  if (words.includes('magic') || words.includes('spell')) return 'magical and mystical';
  
  return 'cinematic and engaging';
}
