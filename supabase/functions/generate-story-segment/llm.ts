
import { generateStoryWithOpenAI } from "./openai-text-service.ts";
import { generateMockResponse } from "./mock-service.ts";
import { getGenerationSettings } from "./settings.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export async function generateStoryContent(
  initialPrompt?: string, 
  choiceText?: string, 
  visualContext?: any, 
  narrativeContext?: any, 
  storyMode?: string,
  supabaseClient?: SupabaseClient
) {
  console.log('🚀 Starting story generation with OpenAI GPT-4o-mini');
  console.log('Generation params:', { 
    hasPrompt: !!initialPrompt, 
    hasChoiceText: !!choiceText, 
    storyMode,
    hasVisualContext: !!visualContext,
    hasNarrativeContext: !!narrativeContext
  });

  // Load admin settings for configuration
  const settings = supabaseClient ? await getGenerationSettings(supabaseClient) : null;
  const textSettings = settings?.textProviders || {
    wordCount: { min: 120, max: 200 },
    temperature: 0.7
  };

  console.log('Using generation settings:', textSettings);

  // Check for OpenAI API key
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error('❌ OpenAI API key not found');
    throw new Error('OpenAI API key not configured. Please add your OpenAI API key to continue.');
  }

  // Generate story with OpenAI
  console.log('🎯 Using OpenAI GPT-4o-mini as primary provider');
  return await generateStoryWithOpenAI(
    initialPrompt, 
    choiceText, 
    visualContext, 
    narrativeContext, 
    storyMode,
    textSettings.wordCount,
    textSettings.temperature
  );
}
