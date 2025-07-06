
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

  console.log('🤖 Generating story with OpenAI GPT-4o-mini...');
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
    console.log('📡 Calling OpenAI API with GPT-4o-mini...');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: temp,
        max_tokens: 2048,
        response_format: { type: "json_object" } // Force JSON response
      }),
    });

    console.log(`📡 OpenAI API Response Status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ OpenAI API Error Details:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
        headers: Object.fromEntries(response.headers.entries())
      });
      throw new Error(`OpenAI API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ OpenAI API Success - Usage:', data.usage);
    console.log('📝 Raw OpenAI Response:', data.choices[0].message.content);
    
    const responseText = data.choices[0].message.content;
    
    // Validate JSON response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
      console.log('✅ JSON parsed successfully:', Object.keys(parsedResponse));
    } catch (jsonError) {
      console.error('❌ JSON Parse Error:', jsonError);
      console.error('❌ Raw response text:', responseText);
      throw new Error(`Invalid JSON response from OpenAI: ${jsonError.message}`);
    }

    // Validate required fields
    if (!parsedResponse.segmentText || !parsedResponse.choices || !Array.isArray(parsedResponse.choices)) {
      console.error('❌ Invalid response structure:', parsedResponse);
      throw new Error('OpenAI response missing required fields (segmentText, choices)');
    }
    
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
