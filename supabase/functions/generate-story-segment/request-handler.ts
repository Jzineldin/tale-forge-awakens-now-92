
import { GenerateStoryRequest, GenerateStoryResponse } from "./types.ts";
import { initializeSupabaseClients, getAuthenticatedUser } from "./supabase-client.ts";
import { generateStoryContent } from "./llm.ts";
import { saveStorySegment } from "./db.ts";
import { getStoryContext } from "./story-updates.ts";
import { startBackgroundTasks } from "./background-task-manager.ts";
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export function createErrorResponse(message: string, code?: string, status = 500): Response {
  const response: GenerateStoryResponse = {
    success: false,
    error: message,
    code
  };
  
  console.error(`Error [${code || 'UNKNOWN'}]: ${message}`);
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  
  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status,
  });
}

export function createSuccessResponse(data: any): Response {
  const response: GenerateStoryResponse = {
    success: true,
    data
  };
  
  console.log('Success response data:', data);
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
  
  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
}

export async function parseAndValidateRequest(req: Request): Promise<GenerateStoryRequest> {
  try {
    const requestBody = await req.json();
    console.log('Raw request body:', JSON.stringify(requestBody, null, 2));
    
    const { prompt, choiceText, choice, storyId, parentSegmentId, storyMode } = requestBody;
    
    // Accept both 'choice' and 'choiceText' parameters for backward compatibility
    const effectiveChoiceText = choiceText || choice;
    
    console.log('Request body parsed:', { 
      hasPrompt: !!prompt, 
      storyId: storyId, 
      parentSegmentId: parentSegmentId,
      hasChoiceText: !!effectiveChoiceText,
      storyMode: storyMode
    });
    
    // Enhanced input validation
    if (!prompt && !effectiveChoiceText) {
      console.error('Validation failed: Missing prompt and choice text');
      throw new Error('Either prompt or choice is required');
    }
    
    if (prompt && prompt.length > 2000) {
      console.error('Validation failed: Prompt too long:', prompt.length);
      throw new Error('Prompt cannot exceed 2000 characters');
    }
    
    if (effectiveChoiceText && effectiveChoiceText.length > 500) {
      console.error('Validation failed: Choice text too long:', effectiveChoiceText.length);
      throw new Error('Choice text cannot exceed 500 characters');
    }
    
    // Basic security validation
    const securityPattern = /<script|javascript:|vbscript:|onload=|onerror=/i;
    if ((prompt && securityPattern.test(prompt)) || 
        (effectiveChoiceText && securityPattern.test(effectiveChoiceText))) {
      console.error('Validation failed: Security violation detected');
      throw new Error('Invalid characters detected in input');
    }
    
    console.log('Request validation passed');
    
    // Return normalized request object
    return {
      ...requestBody,
      choiceText: effectiveChoiceText,
      prompt,
      storyId,
      parentSegmentId,
      storyMode
    };
  } catch (parseError) {
    console.error('Request parsing/validation failed:', parseError);
    console.error('Parse error details:', parseError.message);
    throw new Error(`Request validation failed: ${parseError.message}`);
  }
}

export async function handleStoryGeneration(
  requestBody: any,
  supabaseClient: SupabaseClient,
  supabaseAdmin: SupabaseClient
) {
  console.log('=== Story Generation Request Started ===');
  
  try {
    // Parse and validate request
    const validatedRequest = await parseAndValidateRequest({ json: () => Promise.resolve(requestBody) } as Request);
    
    // Get authenticated user
    const user = await getAuthenticatedUser(supabaseClient);
    console.log('User auth:', user ? `Authenticated: ${user.id}` : 'Anonymous - proceeding anyway');
    
    // Load story context if continuing an existing story
    let visualContext = null;
    let narrativeContext = null;
    let storyMode = validatedRequest.storyMode;
    
    if (validatedRequest.storyId) {
      console.log('Fetching story context for story:', validatedRequest.storyId);
      const context = await getStoryContext(validatedRequest.storyId, supabaseClient);
      visualContext = context.visualContext;
      narrativeContext = context.narrativeContext;
      storyMode = context.storyMode || storyMode;
      console.log('Story context loaded successfully');
    }
    
    // Generate story content using OpenAI
    console.log('Starting AI generation...');
    const aiResult = await generateStoryContent(
      validatedRequest.prompt,
      validatedRequest.choiceText,
      visualContext,
      narrativeContext,
      storyMode,
      supabaseClient
    );
    console.log('AI generation completed successfully');
    
    // Save story segment to database
    console.log('Saving story segment to database...');
    const savedSegment = await saveStorySegment({
      storyId: validatedRequest.storyId,
      parentSegmentId: validatedRequest.parentSegmentId,
      triggeringChoiceText: validatedRequest.choiceText,
      segmentText: aiResult.segmentText,
      imageUrl: '', // Images are generated in background
      choices: aiResult.choices || [],
      isEnd: aiResult.isEnd || false,
      supabaseClient: supabaseAdmin, // Use admin client for saving
      title: validatedRequest.prompt ? 'Generated Story' : undefined,
      visualContext: aiResult.visualContext,
      narrativeContext: aiResult.narrativeContext,
      storyMode: storyMode,
      userId: user?.id || null,
    });
    console.log('Story segment saved successfully:', savedSegment.id);
    
    // Start background tasks for image and audio generation
    console.log('Starting background tasks for segment:', savedSegment.id);
    startBackgroundTasks(
      savedSegment.id,
      savedSegment.story_id,
      aiResult.imagePrompt || 'A scene from the story',
      aiResult.segmentText,
      aiResult.visualContext,
      aiResult.narrativeContext,
      supabaseAdmin,
      supabaseClient
    );
    console.log('Background tasks started successfully');
    
    console.log('=== Story Generation Request Completed Successfully ===');
    
    return {
      id: savedSegment.id,
      story_id: savedSegment.story_id,
      segment_text: savedSegment.segment_text,
      choices: savedSegment.choices,
      is_end: savedSegment.is_end,
      image_url: savedSegment.image_url,
      parent_segment_id: savedSegment.parent_segment_id,
      triggering_choice_text: savedSegment.triggering_choice_text,
      created_at: savedSegment.created_at,
      updated_at: savedSegment.created_at, // Use created_at as updated_at initially
    };
    
  } catch (error) {
    console.error('=== Story Generation Request Failed ===', error);
    throw error;
  }
}
