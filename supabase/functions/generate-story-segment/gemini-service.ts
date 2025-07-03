
export async function generateWithGemini(
  initialPrompt?: string, 
  choiceText?: string, 
  visualContext?: any, 
  narrativeContext?: any, 
  storyMode?: string,
  wordCount?: { min: number; max: number },
  temperature?: number,
  model?: string
) {
  const googleApiKey = Deno.env.get('GOOGLE_API_KEY');
  if (!googleApiKey) {
    throw new Error('Google API key not available');
  }

  console.log('Generating with Google Gemini...');

  const { min: minWords, max: maxWords } = wordCount || { min: 120, max: 200 };
  const selectedModel = model || 'gemini-1.5-flash-latest';
  const temp = temperature || 0.7;

  let systemPrompt = `You are an interactive storytelling assistant with advanced character consistency capabilities. Your goal is to generate a cohesive and coherent story segment by segment while maintaining perfect character consistency across all segments.

**CRITICAL CHARACTER CONSISTENCY REQUIREMENTS:**
- If characters already exist in visualContext, you MUST maintain their exact physical descriptions
- Never change established character features (hair color, eye color, clothing, species traits, etc.)
- Always reference existing characters with phrases like "the same [character] as before" in image prompts
- Build detailed character profiles that include physical features, clothing, and distinctive traits

**IMPORTANT WORD COUNT**: Generate story segments between ${minWords} and ${maxWords} words to create rich, immersive storytelling experiences.`;
  
  if (storyMode) {
    systemPrompt += `\n\n**STORY MODE**: The user has selected "${storyMode}" mode. All content must strictly adhere to this theme:
- **Child-Adapted Story**: Simple, friendly language. Whimsical, colorful art. No violence or scary content.
- **Horror Story**: Dark, suspenseful language. Eerie, atmospheric art.
- **Epic Fantasy**: Grand, mythical language. High-fantasy art style.
- **Sci-Fi Thriller**: Futuristic, tech-focused language. Sleek, advanced visuals.
- **Mystery Detective**: Noir-style language. Moody, cinematic art.
- **Romantic Drama**: Emotional, relationship-focused language. Soft, warm visuals.
- **Adventure Quest**: Action-packed, exploratory language. Dynamic, vibrant art.
- **Comedy Adventure**: Light-hearted, humorous language. Bright, playful visuals.
- **Historical Journey**: Period-accurate language. Authentic historical art.
- **Educational Adventure**: Informative yet entertaining language. Educational visuals.`;
  }

  systemPrompt += `

**CHARACTER CONSISTENCY PROTOCOL:**
1. **Existing Characters**: If visualContext contains character descriptions, preserve ALL details exactly
2. **New Characters**: Create comprehensive physical descriptions including:
   - Species/race and distinctive features
   - Hair/fur/scale color and style
   - Eye color and expression
   - Clothing and accessories
   - Size, build, and posture
   - Unique identifying marks or traits
3. **Image Prompt Requirements**: 
   - Always include "maintaining consistent character design from previous scenes"
   - Reference specific character features established in visualContext
   - Use phrases like "the same green dragon with two horns and green eyes as before"

**NARRATIVE COHERENCE:**
- Follow narrativeContext strictly if provided
- Update story summary with key events from new segment
- Progress toward current objective
- Update arcStage appropriately

**VISUAL CONSISTENCY:**
- Maintain established art style from visualContext
- Ensure character appearances match previous descriptions exactly
- Include environmental consistency when relevant

Respond ONLY with valid JSON:
{
  "segmentText": "Rich ${minWords}-${maxWords} word story segment with character consistency",
  "choices": ["Choice 1", "Choice 2", "Choice 3"],
  "isEnd": false,
  "imagePrompt": "Detailed prompt maintaining character consistency: [specific character descriptions] - maintaining consistent character design from previous scenes",
  "visualContext": {
    "style": "Consistent art style description",
    "characters": {
      "CharacterName": "Comprehensive physical description including all distinguishing features, clothing, and traits"
    }
  },
  "narrativeContext": {
    "summary": "Updated cumulative story summary",
    "currentObjective": "Current story goal",
    "arcStage": "Current story arc stage"
  }
}`;
  
  let userPromptContent = initialPrompt 
    ? `Start a new story: "${initialPrompt}"`
    : `Continue story. User chose: "${choiceText}"`;

  if (storyMode) {
    userPromptContent += `\n\nStory Mode: "${storyMode}"`;
  }

  // Enhanced visual context handling for character consistency
  if (visualContext && visualContext.characters) {
    const characterList = Object.entries(visualContext.characters)
      .map(([name, desc]) => `${name}: ${desc}`)
      .join('\n');
    
    userPromptContent += `\n\nEXISTING CHARACTERS (maintain exact consistency):
${characterList}

Visual Style: ${visualContext.style || 'Established art style'}

CRITICAL: All existing characters must maintain their exact physical appearance. Include specific references to their established features in both the story text and image prompt.`;
  } else {
    userPromptContent += `\n\nThis is a new story - establish detailed character descriptions for visual consistency.`;
  }

  if (narrativeContext) {
    userPromptContent += `\n\nNarrative Context: ${JSON.stringify(narrativeContext)}`;
  }

  const requestBody = {
    contents: [{ parts: [{ text: systemPrompt }, { text: userPromptContent }] }],
    generationConfig: { 
      response_mime_type: "application/json",
      temperature: temp,
      maxOutputTokens: 2048
    }
  };

  console.log(`Sending request to Google Gemini API (${selectedModel}) with character consistency...`);
  
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${googleApiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody)
  });

  console.log(`Google Gemini API response status: ${res.status}`);

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Google Gemini API error:', errorText);
    throw new Error(`Gemini API failed with status ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  console.log('Google Gemini API response received, parsing...');
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
    console.error('Invalid Gemini response structure:', data);
    throw new Error('Invalid response structure from Gemini API');
  }

  const responseText = data.candidates[0].content.parts[0].text;
  console.log('Raw Gemini response:', responseText);

  let parsedResponse;
  try {
    parsedResponse = JSON.parse(responseText);
    console.log('Successfully parsed Gemini JSON response with character consistency');
  } catch (parseError) {
    console.error('Failed to parse Gemini JSON response:', parseError);
    console.error('Raw response that failed to parse:', responseText);
    throw new Error(`Failed to parse JSON from Gemini: ${parseError.message}`);
  }

  // Validate the response has character consistency elements
  if (!parsedResponse.segmentText || !Array.isArray(parsedResponse.choices)) {
    console.error('Invalid parsed response structure:', parsedResponse);
    throw new Error('Invalid story content structure from Gemini');
  }

  // Log character consistency for debugging
  if (parsedResponse.visualContext && parsedResponse.visualContext.characters) {
    console.log('Character consistency maintained:', Object.keys(parsedResponse.visualContext.characters));
  }

  return parsedResponse;
}
