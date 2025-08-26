import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateAudioRequest {
  text: string
  voice_style: string
  temperature?: number
  content_template_id: string
  property_id: string
}

interface ReplicateResponse {
  id: string
  status: string
  output?: any
  error?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get request body
    const { text, voice_style, temperature = 0.3, content_template_id, property_id }: GenerateAudioRequest = await req.json()

    if (!text || !voice_style || !content_template_id || !property_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Call Replicate API
    const replicateApiToken = Deno.env.get('REPLICATE_API_TOKEN')
    if (!replicateApiToken) {
      throw new Error('REPLICATE_API_TOKEN not found')
    }

    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${replicateApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: "sosoroy/higgs-audio-guide:latest",
        input: {
          text: text,
          voice_style: voice_style,
          temperature: temperature
        }
      })
    })

    if (!replicateResponse.ok) {
      const errorText = await replicateResponse.text()
      throw new Error(`Replicate API error: ${errorText}`)
    }

    const prediction: ReplicateResponse = await replicateResponse.json()
    
    // Poll for completion
    let result
    while (prediction.status !== 'succeeded' && prediction.status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second
      
      const statusResponse = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
        headers: {
          'Authorization': `Token ${replicateApiToken}`,
        }
      })
      
      if (!statusResponse.ok) {
        throw new Error('Failed to check prediction status')
      }
      
      result = await statusResponse.json()
      prediction.status = result.status
      prediction.output = result.output
      prediction.error = result.error
    }

    if (prediction.status === 'failed') {
      throw new Error(`Prediction failed: ${prediction.error}`)
    }

    // Download audio file from Replicate
    const audioData = prediction.output
    if (!audioData || !audioData.audio) {
      throw new Error('No audio data received from Replicate')
    }

    // Convert audio data to buffer
    const audioBuffer = new Uint8Array(audioData.audio)
    
    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `audio/${property_id}/${content_template_id}_${timestamp}.wav`
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('audio-files')
      .upload(filename, audioBuffer, {
        contentType: 'audio/wav',
        upsert: false
      })

    if (uploadError) {
      throw new Error(`Storage upload error: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('audio-files')
      .getPublicUrl(filename)

    // Save audio file record to database
    const { data: audioFile, error: dbError } = await supabase
      .from('audio_files')
      .insert({
        content_template_id: content_template_id,
        property_id: property_id,
        file_url: urlData.publicUrl,
        file_path: filename,
        duration: audioData.duration || null,
        sampling_rate: audioData.sampling_rate || null,
        voice_style: voice_style,
        temperature: temperature,
        replicate_prediction_id: prediction.id
      })
      .select()
      .single()

    if (dbError) {
      throw new Error(`Database error: ${dbError.message}`)
    }

    return new Response(
      JSON.stringify({
        success: true,
        audio_file: audioFile,
        prediction_id: prediction.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
