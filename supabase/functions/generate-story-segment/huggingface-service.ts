
export async function generateImageWithHuggingFace(prompt: string): Promise<Blob | null> {
  console.log("Generating image with Hugging Face FLUX.1-schnell for prompt:", prompt);
  const huggingFaceToken = Deno.env.get('HUGGING_FACE_API_KEY');

  if (!huggingFaceToken) {
    console.error("Hugging Face API key is not set. Cannot generate image.");
    return null;
  }

  try {
    console.log("Calling Hugging Face API...");
    const response = await fetch('https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${huggingFaceToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          guidance_scale: 0.0,
          num_inference_steps: 4,
          max_sequence_length: 256,
          width: 1024,
          height: 1024
        }
      }),
    });

    console.log(`Hugging Face API response status: ${response.status}`);

    if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", errorText);
        
        // Check if it's a model loading error
        if (response.status === 503 && errorText.includes('loading')) {
          console.log("Model is loading, this is normal for the first request");
          return null; // Will fallback to next provider
        }
        
        throw new Error(`Hugging Face API returned status ${response.status}: ${errorText}`);
    }

    const imageBlob = await response.blob();

    if (!imageBlob || imageBlob.size === 0) {
      console.error("Hugging Face returned an empty image blob.");
      return null;
    }

    console.log(`Successfully generated image from Hugging Face. Type: ${imageBlob.type}, Size: ${imageBlob.size}`);
    return imageBlob;

  } catch (error) {
    console.error("Error calling Hugging Face API:", JSON.stringify(error, null, 2));
    if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
    }
    return null;
  }
}
