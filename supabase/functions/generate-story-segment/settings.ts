
import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2";

export interface GenerationSettings {
  textProviders: {
    primary: string;
    fallback: string;
    wordCount: { min: number; max: number };
    geminiSettings: {
      model: string;
      temperature: number;
    };
    openaiSettings: {
      model: string;
      temperature: number;
    };
  };
  imageProviders: {
    primary: string;
    fallback: string;
    huggingFaceSettings: {
      model: string;
      steps: number;
      guidance_scale: number;
      width: number;
      height: number;
    };
    stableDiffusionSettings: {
      steps: number;
      dimensions: string;
    };
    dalleSettings: {
      model: string;
      quality: string;
      size: string;
    };
    replicateSettings: {
      model: string;
      steps: number;
      aspect_ratio: string;
      output_format: string;
    };
  };
  ttsProviders: {
    primary: string;
    voice: string;
    speed: number;
  };
}

const defaultSettings: GenerationSettings = {
  textProviders: {
    primary: 'gemini',
    fallback: 'openai',
    wordCount: { min: 120, max: 200 },
    geminiSettings: {
      model: 'gemini-1.5-flash-latest',
      temperature: 0.7,
    },
    openaiSettings: {
      model: 'gpt-4o-mini',
      temperature: 0.7,
    },
  },
  imageProviders: {
    primary: 'openai',
    fallback: 'replicate',
    huggingFaceSettings: {
      model: 'black-forest-labs/FLUX.1-schnell',
      steps: 4,
      guidance_scale: 0.0,
      width: 1024,
      height: 1024,
    },
    stableDiffusionSettings: {
      steps: 20,
      dimensions: '1024x1024',
    },
    dalleSettings: {
      model: 'dall-e-3',
      quality: 'standard',
      size: '1024x1024',
    },
    replicateSettings: {
      model: 'flux-schnell',
      steps: 4,
      aspect_ratio: '1:1',
      output_format: 'webp',
    },
  },
  ttsProviders: {
    primary: 'openai',
    voice: 'fable',
    speed: 1.0,
  },
};

export async function getGenerationSettings(supabaseClient: SupabaseClient): Promise<GenerationSettings> {
  try {
    const { data } = await supabaseClient
      .from('admin_settings')
      .select('setting_key, setting_value')
      .in('setting_key', ['text_providers', 'image_providers', 'tts_providers']);

    if (!data || data.length === 0) {
      console.log('No admin settings found, using defaults');
      return defaultSettings;
    }

    const settings = { ...defaultSettings };
    
    data.forEach(setting => {
      if (setting.setting_key === 'text_providers') {
        settings.textProviders = { ...settings.textProviders, ...setting.setting_value };
      } else if (setting.setting_key === 'image_providers') {
        settings.imageProviders = { ...settings.imageProviders, ...setting.setting_value };
      } else if (setting.setting_key === 'tts_providers') {
        settings.ttsProviders = { ...settings.ttsProviders, ...setting.setting_value };
      }
    });

    console.log('Loaded admin settings:', settings);
    return settings;
  } catch (error) {
    console.error('Error loading admin settings:', error);
    return defaultSettings;
  }
}
