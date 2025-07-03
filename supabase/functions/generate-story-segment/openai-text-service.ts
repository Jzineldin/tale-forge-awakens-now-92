
export async function generateStoryWithOpenAI(
  initialPrompt?: string,
  choiceText?: string,
  visualContext?: any,
  narrativeContext?: any,
  storyMode?: string,
  wordCount?: { min: number; max: number },
  temperature?: number
) {
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    throw new Error('OpenAI API key not available');
  }

  console.log('🤖 Generating story with OpenAI GPT-4.1-2025-04-14...');
  console.log('Generation params:', {
    hasPrompt: !!initialPrompt,
    hasChoice: !!choiceText,
    storyMode,
    wordCount
  });

  const { min: minWords, max: maxWords } = wordCount || { min: 120, max: 200 };
  const temp = temperature || 0.7;

  // Build context-aware system prompt
  let systemPrompt = `You are a master storyteller AI. Generate immersive story segments in JSON format.

CRITICAL REQUIREMENTS:
- Generate ${minWords}-${maxWords} words for rich, detailed storytelling
- Create exactly 3 meaningful choices that advance the plot
- Include detailed image descriptions for visual consistency
- Maintain narrative flow and character development

Response format (EXACT JSON):
{
  "segmentText": "A ${minWords}-${maxWords} word story segment with vivid descriptions",
  "choices": ["Choice 1", "Choice 2", "Choice 3"],
  "isEnd": false,
  "imagePrompt": "Detailed scene description for image generation",
  "visualContext": {"style": "consistent art style", "characters": {"name": "description"}},
  "narrativeContext": {"summary": "story summary", "currentObjective": "current goal", "arcStage": "story phase"}
}`;

  // Add context-aware instructions
  if (visualContext?.characters) {
    systemPrompt += `\n\nCharacter consistency: ${JSON.stringify(visualContext.characters)}`;
  }
  
  if (narrativeContext?.summary) {
    systemPrompt += `\n\nStory context: ${narrativeContext.summary}`;
  }

  const userPrompt = initialPrompt 
    ? `Start a new ${storyMode || 'fantasy'} story: "${initialPrompt}"`
    : `Continue the story. User chose: "${choiceText}"
    
Previous context: ${JSON.stringify(narrativeContext || {})}`;

  try {
    console.log('📡 Calling OpenAI API with GPT-4.1-2025-04-14...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: temp,
        max_tokens: 2048,
        store: true // Track usage in OpenAI dashboard
      }),
    });

    console.log(`OpenAI API Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      throw new Error(`OpenAI API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI API Success - Usage:', data.usage);
    
    const responseText = data.choices[0].message.content;
    const parsedResponse = JSON.parse(responseText);
    
    console.log('📝 Generated story segment:', {
      textLength: parsedResponse.segmentText?.length,
      choicesCount: parsedResponse.choices?.length,
      hasImagePrompt: !!parsedResponse.imagePrompt
    });
    
    return parsedResponse;
    
  } catch (error) {
    console.error('OpenAI text generation failed:', error);
    throw new Error(`Story generation failed: ${error.message}`);
  }
}
