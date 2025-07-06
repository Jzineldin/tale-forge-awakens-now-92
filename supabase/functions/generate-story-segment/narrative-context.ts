
// Advanced narrative context management for story coherence

export interface NarrativeContext {
  storyArc: {
    stage: 'setup' | 'rising_action' | 'climax' | 'falling_action' | 'resolution';
    progressPercentage: number;
  };
  characters: {
    protagonist: {
      name?: string;
      traits: string[];
      development: string[];
      currentGoal: string;
    };
    supporting: Array<{
      name: string;
      role: string;
      relationship: string;
    }>;
  };
  plotThreads: Array<{
    id: string;
    description: string;
    status: 'introduced' | 'developing' | 'resolved';
    importance: 'main' | 'subplot' | 'minor';
  }>;
  worldBuilding: {
    setting: string;
    rules: string[];
    atmosphere: string;
    conflicts: string[];
  };
  themes: string[];
  previousChoices: Array<{
    choice: string;
    consequences: string[];
    impactLevel: 'low' | 'medium' | 'high';
  }>;
}

export function buildNarrativeContext(previousSegments: any[], genre: string): NarrativeContext {
  const segmentCount = previousSegments.length;
  
  return {
    storyArc: determineStoryArc(segmentCount),
    characters: extractCharacters(previousSegments),
    plotThreads: identifyPlotThreads(previousSegments),
    worldBuilding: buildWorldContext(previousSegments, genre),
    themes: extractThemes(previousSegments, genre),
    previousChoices: analyzePreviousChoices(previousSegments)
  };
}

function determineStoryArc(segmentCount: number): NarrativeContext['storyArc'] {
  // Determine story stage based on segment count and typical story length (8-12 segments)
  const estimatedLength = 10; // segments
  const progress = Math.min(segmentCount / estimatedLength, 1);
  
  let stage: NarrativeContext['storyArc']['stage'];
  
  if (progress < 0.2) {
    stage = 'setup';
  } else if (progress < 0.6) {
    stage = 'rising_action';
  } else if (progress < 0.8) {
    stage = 'climax';
  } else if (progress < 0.95) {
    stage = 'falling_action';
  } else {
    stage = 'resolution';
  }
  
  return {
    stage,
    progressPercentage: Math.round(progress * 100)
  };
}

function extractCharacters(segments: any[]): NarrativeContext['characters'] {
  const protagonist = {
    name: undefined,
    traits: extractProtagonistTraits(segments),
    development: extractCharacterDevelopment(segments),
    currentGoal: extractCurrentGoal(segments)
  };
  
  const supporting = extractSupportingCharacters(segments);
  
  return { protagonist, supporting };
}

function extractProtagonistTraits(segments: any[]): string[] {
  const traits: string[] = [];
  
  for (const segment of segments) {
    const text = segment.segment_text?.toLowerCase() || '';
    
    // Look for character trait indicators
    if (text.includes('brave') || text.includes('courage')) traits.push('brave');
    if (text.includes('curious') || text.includes('investigate')) traits.push('curious');
    if (text.includes('careful') || text.includes('cautious')) traits.push('cautious');
    if (text.includes('clever') || text.includes('smart')) traits.push('intelligent');
    if (text.includes('kind') || text.includes('helpful')) traits.push('compassionate');
  }
  
  return [...new Set(traits)]; // Remove duplicates
}

function extractCharacterDevelopment(segments: any[]): string[] {
  const development: string[] = [];
  
  // Analyze how character has grown through choices and events
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (segment.triggering_choice_text) {
      const choice = segment.triggering_choice_text.toLowerCase();
      
      if (choice.includes('help') || choice.includes('assist')) {
        development.push('becoming more helpful');
      }
      if (choice.includes('fight') || choice.includes('confront')) {
        development.push('growing more confident');
      }
      if (choice.includes('explore') || choice.includes('investigate')) {
        development.push('becoming more adventurous');
      }
    }
  }
  
  return [...new Set(development)];
}

function extractCurrentGoal(segments: any[]): string {
  // Analyze recent segments to understand current objective
  const recentSegments = segments.slice(-3); // Last 3 segments
  
  for (const segment of recentSegments.reverse()) {
    const text = segment.segment_text?.toLowerCase() || '';
    
    if (text.includes('find') || text.includes('search')) {
      return 'searching for something important';
    }
    if (text.includes('escape') || text.includes('flee')) {
      return 'trying to escape danger';
    }
    if (text.includes('solve') || text.includes('mystery')) {
      return 'solving a mystery';
    }
    if (text.includes('help') || text.includes('save')) {
      return 'helping someone in need';
    }
  }
  
  return 'continuing the adventure';
}

function extractSupportingCharacters(segments: any[]): Array<{ name: string; role: string; relationship: string }> {
  const characters: Array<{ name: string; role: string; relationship: string }> = [];
  
  // Simple character extraction - could be enhanced with NLP
  for (const segment of segments) {
    const text = segment.segment_text || '';
    
    // Look for character mentions
    if (text.includes('librarian')) {
      characters.push({ name: 'Librarian', role: 'guide', relationship: 'helpful' });
    }
    if (text.includes('stranger') || text.includes('figure')) {
      characters.push({ name: 'Mysterious Figure', role: 'unknown', relationship: 'uncertain' });
    }
  }
  
  // Remove duplicates based on name
  return characters.filter((char, index, arr) => 
    arr.findIndex(c => c.name === char.name) === index
  );
}

function identifyPlotThreads(segments: any[]): NarrativeContext['plotThreads'] {
  const threads: NarrativeContext['plotThreads'] = [];
  
  // Analyze segments for ongoing plot elements
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    const text = segment.segment_text?.toLowerCase() || '';
    
    if (text.includes('message') || text.includes('hidden')) {
      threads.push({
        id: 'hidden_messages',
        description: 'mysterious hidden messages',
        status: i < segments.length - 2 ? 'developing' : 'introduced',
        importance: 'main'
      });
    }
    
    if (text.includes('danger') || text.includes('threat')) {
      threads.push({
        id: 'danger_element',
        description: 'looming threat or danger',
        status: 'developing',
        importance: 'main'
      });
    }
  }
  
  // Remove duplicates
  return threads.filter((thread, index, arr) => 
    arr.findIndex(t => t.id === thread.id) === index
  );
}

function buildWorldContext(segments: any[], genre: string): NarrativeContext['worldBuilding'] {
  const setting = extractSetting(segments);
  const rules = extractWorldRules(segments, genre);
  const atmosphere = extractAtmosphere(segments, genre);
  const conflicts = extractConflicts(segments);
  
  return { setting, rules, atmosphere, conflicts };
}

function extractSetting(segments: any[]): string {
  // Determine primary setting from segments
  const locations = ['library', 'forest', 'castle', 'city', 'village', 'cave'];
  
  for (const segment of segments) {
    const text = segment.segment_text?.toLowerCase() || '';
    const foundLocation = locations.find(loc => text.includes(loc));
    if (foundLocation) {
      return foundLocation;
    }
  }
  
  return 'mysterious location';
}

function extractWorldRules(segments: any[], genre: string): string[] {
  const rules: string[] = [];
  
  // Genre-specific world rules
  if (genre === 'fantasy') {
    rules.push('magic exists');
  } else if (genre === 'mystery') {
    rules.push('clues lead to answers');
  } else if (genre === 'horror') {
    rules.push('danger lurks in shadows');
  }
  
  // Extract rules from story events
  for (const segment of segments) {
    const text = segment.segment_text?.toLowerCase() || '';
    
    if (text.includes('magic') || text.includes('spell')) {
      rules.push('magical forces are active');
    }
    if (text.includes('curse') || text.includes('cursed')) {
      rules.push('supernatural curses exist');
    }
  }
  
  return [...new Set(rules)];
}

function extractAtmosphere(segments: any[], genre: string): string {
  // Analyze recent segments for current mood
  const recentText = segments.slice(-2).map(s => s.segment_text || '').join(' ').toLowerCase();
  
  if (recentText.includes('dark') || recentText.includes('shadow')) {
    return 'dark and mysterious';
  }
  if (recentText.includes('bright') || recentText.includes('warm')) {
    return 'bright and welcoming';
  }
  if (recentText.includes('tense') || recentText.includes('danger')) {
    return 'tense and suspenseful';
  }
  
  // Default based on genre
  const genreAtmospheres = {
    mystery: 'mysterious and intriguing',
    fantasy: 'magical and wondrous',
    horror: 'dark and foreboding',
    adventure: 'exciting and dynamic',
    romance: 'warm and intimate',
    scifi: 'futuristic and sleek'
  };
  
  return genreAtmospheres[genre as keyof typeof genreAtmospheres] || 'engaging and immersive';
}

function extractConflicts(segments: any[]): string[] {
  const conflicts: string[] = [];
  
  for (const segment of segments) {
    const text = segment.segment_text?.toLowerCase() || '';
    
    if (text.includes('danger') || text.includes('threat')) {
      conflicts.push('external threat');
    }
    if (text.includes('decision') || text.includes('choice')) {
      conflicts.push('moral dilemma');
    }
    if (text.includes('mystery') || text.includes('unknown')) {
      conflicts.push('unsolved mystery');
    }
  }
  
  return [...new Set(conflicts)];
}

function extractThemes(segments: any[], genre: string): string[] {
  const themes: string[] = [];
  
  // Genre-specific themes
  const genreThemes = {
    mystery: ['truth vs deception', 'justice'],
    fantasy: ['good vs evil', 'power and responsibility'],
    horror: ['fear of unknown', 'survival'],
    adventure: ['courage', 'discovery'],
    romance: ['love', 'relationships'],
    scifi: ['technology vs humanity', 'progress']
  };
  
  if (genreThemes[genre as keyof typeof genreThemes]) {
    themes.push(...genreThemes[genre as keyof typeof genreThemes]);
  }
  
  // Extract themes from story content
  for (const segment of segments) {
    const text = segment.segment_text?.toLowerCase() || '';
    
    if (text.includes('help') || text.includes('rescue')) {
      themes.push('helping others');
    }
    if (text.includes('truth') || text.includes('reveal')) {
      themes.push('seeking truth');
    }
  }
  
  return [...new Set(themes)];
}

function analyzePreviousChoices(segments: any[]): NarrativeContext['previousChoices'] {
  const choices: NarrativeContext['previousChoices'] = [];
  
  for (const segment of segments) {
    if (segment.triggering_choice_text) {
      const choice = segment.triggering_choice_text;
      const consequences = analyzeChoiceConsequences(segment.segment_text);
      const impactLevel = determineChoiceImpact(choice, consequences);
      
      choices.push({
        choice,
        consequences,
        impactLevel
      });
    }
  }
  
  return choices;
}

function analyzeChoiceConsequences(segmentText: string): string[] {
  const consequences: string[] = [];
  const text = segmentText.toLowerCase();
  
  if (text.includes('discover') || text.includes('find')) {
    consequences.push('new discovery made');
  }
  if (text.includes('danger') || text.includes('threat')) {
    consequences.push('encountered danger');
  }
  if (text.includes('help') || text.includes('aid')) {
    consequences.push('received help');
  }
  if (text.includes('progress') || text.includes('forward')) {
    consequences.push('story progressed');
  }
  
  return consequences;
}

function determineChoiceImpact(choice: string, consequences: string[]): 'low' | 'medium' | 'high' {
  const choiceText = choice.toLowerCase();
  
  // High impact choices
  if (choiceText.includes('confront') || choiceText.includes('fight') || 
      choiceText.includes('reveal') || choiceText.includes('major')) {
    return 'high';
  }
  
  // Medium impact choices
  if (choiceText.includes('explore') || choiceText.includes('investigate') ||
      choiceText.includes('help') || consequences.length > 1) {
    return 'medium';
  }
  
  return 'low';
}

export function generateContextAwarePrompt(
  userPrompt: string,
  choiceText: string | null,
  context: NarrativeContext,
  genre: string
): string {
  const { storyArc, characters, plotThreads, worldBuilding, themes } = context;
  
  let systemPrompt = `You are an expert storyteller creating a ${genre} story. `;
  
  // Add story arc context
  systemPrompt += `STORY STAGE: Currently in ${storyArc.stage} phase (${storyArc.progressPercentage}% complete). `;
  
  // Add character context
  if (characters.protagonist.traits.length > 0) {
    systemPrompt += `PROTAGONIST: ${characters.protagonist.traits.join(', ')} character with goal: ${characters.protagonist.currentGoal}. `;
  }
  
  // Add plot thread context
  if (plotThreads.length > 0) {
    const activeThreads = plotThreads.filter(t => t.status === 'developing').map(t => t.description);
    systemPrompt += `ACTIVE PLOTS: ${activeThreads.join(', ')}. `;
  }
  
  // Add world context
  systemPrompt += `SETTING: ${worldBuilding.setting} with ${worldBuilding.atmosphere} atmosphere. `;
  
  // Add thematic context
  if (themes.length > 0) {
    systemPrompt += `THEMES: Explore ${themes.slice(0, 2).join(' and ')}. `;
  }
  
  // Add story stage specific instructions
  systemPrompt += getStageSpecificInstructions(storyArc.stage);
  
  return systemPrompt;
}

function getStageSpecificInstructions(stage: NarrativeContext['storyArc']['stage']): string {
  switch (stage) {
    case 'setup':
      return 'Focus on world-building, character introduction, and establishing the central conflict. Create engaging choices that explore the world.';
    
    case 'rising_action':
      return 'Escalate tension, develop characters, and advance plot threads. Create choices that increase stakes and complexity.';
    
    case 'climax':
      return 'Build to the story\'s peak moment. Create high-stakes choices that determine the story\'s outcome. Make this the most intense segment.';
    
    case 'falling_action':
      return 'Begin resolving conflicts and plot threads. Create choices that deal with consequences and character growth.';
    
    case 'resolution':
      return 'Wrap up remaining plot threads and provide satisfying closure. Create choices that reflect on the journey and its meaning.';
    
    default:
      return 'Continue the story with engaging narrative and meaningful choices.';
  }
}
