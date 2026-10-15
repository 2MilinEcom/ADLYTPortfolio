import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const data = await req.formData()

    const userId     = data.get("userId")       as string
    const niche      = data.get("niche")        as string
    const product    = data.get("product")      as string
    const adOutput   = data.get("adOutput")     as string
    const searchTags = data.get("searchTags")   as string
    const file       = data.get("video")        as File | null

    if (!file || file.type !== "video/mp4") {
      return new Response(JSON.stringify({ error: "MP4 file required" }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 1. Upload to a **private, short-lived** bucket
    const path = `videos/${userId}/${crypto.randomUUID()}_${file.name}`
    const up   = await supabase.storage.from("temp-videos").upload(path, file.stream())
    if (up.error) {
      console.error('Storage upload error:', up.error)
      return new Response(JSON.stringify({ error: up.error.message }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 2. Create the job row in **videos**
    const { data: vid, error } = await supabase
      .from("videos")
      .insert({
        id:        crypto.randomUUID(), // let PG default if you prefer
        user_id:   userId,
        path,              // storage path
        status:    "queued",
        object_id: null    // you can store up.uploadedResponse.Id if needed
      })
      .select("id")
      .single()

    if (error) {
      console.error('Database insert error:', error)
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 3. (optional) keep questionnaire in its own table
    const { error: questionnaireError } = await supabase.from("questionnaire_responses").insert({
      id:          crypto.randomUUID(),
      user_id:     userId,
      niche,
      product,
      ad_output_range: adOutput,
      search_tags: searchTags
    })

    if (questionnaireError) {
      console.error('Questionnaire insert error:', questionnaireError)
      // Don't fail the whole request for questionnaire error, just log it
    }

    return new Response(JSON.stringify({ videoId: vid.id }), { 
      status: 202,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
