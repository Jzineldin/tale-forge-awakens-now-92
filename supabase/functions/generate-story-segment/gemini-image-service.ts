
// New dedicated service for Google Gemini image generation
export async function generateImageWithGemini(prompt: string): Promise<Blob | null> {
  console.log("Generating image with Google Gemini for prompt:", prompt);
  const googleApiKey = Deno.env.get('GOOGLE_API_KEY');

  if (!googleApiKey) {
    console.error("Google API key is not set. Cannot generate image with Gemini.");
    return null;
  }

  try {
    console.log("Calling Google Gemini generateContent API for image generation...");
    
    // Create a comprehensive prompt that requests image generation
    const imageGenerationPrompt = `Generate a high-quality, detailed image based on this description: ${prompt}. 
    
Please create a visual representation that captures the essence, mood, and key elements described. 
The image should be artistic, well-composed, and visually engaging.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${googleApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: imageGenerationPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_LOW_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_LOW_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_LOW_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_LOW_AND_ABOVE"
          }
        ]
      }),
    });

    console.log(`Google Gemini API response status: ${response.status}`);

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Google Gemini API error:", errorBody);
        throw new Error(`Google Gemini API returned status ${response.status}: ${errorBody}`);
    }

    const data = await response.json();
    console.log("Google Gemini API response received:", JSON.stringify(data, null, 2));
    
    // Check if the response contains image data
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        console.error("Invalid response structure from Google Gemini. Full response:", data);
        throw new Error("Invalid response from Google Gemini API - no content found.");
    }

    const content = data.candidates[0].content;
    
    // Look for image data in the response - this is speculative based on API documentation
    // We might need to adjust this based on the actual response format
    let imageData = null;
    
    if (content.parts) {
      for (const part of content.parts) {
        if (part.inlineData && part.inlineData.data) {
          imageData = part.inlineData.data;
          break;
        }
      }
    }

    if (!imageData) {
      console.error("No image data found in Gemini response. Response structure:", JSON.stringify(content, null, 2));
      throw new Error("No image data found in Google Gemini response");
    }

    // Convert base64 to blob
    const base64Data = imageData.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const imageBlob = new Blob([byteArray], { type: 'image/png' });

    if (!imageBlob || imageBlob.size === 0) {
      console.error("Google Gemini returned an empty image blob.");
      return null;
    }

    console.log(`Successfully generated image from Google Gemini. Type: ${imageBlob.type}, Size: ${imageBlob.size}`);
    return imageBlob;

  } catch (error) {
    console.error("Error calling Google Gemini API:", JSON.stringify(error, null, 2));
    if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
    }
    return null;
  }
}
