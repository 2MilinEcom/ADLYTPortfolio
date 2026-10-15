import { serve } from "https://deno.land/x/sift@0.5.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SB_URL")!,
  Deno.env.get("SB_SERVICE_KEY")!
);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve({
  async POST(req) {
    const data = await req.formData();

    const userId     = data.get("userId")       as string;
    const niche      = data.get("niche")        as string;
    const product    = data.get("product")      as string;
    const adOutput   = data.get("adOutput")     as string;
    const searchTags = data.get("searchTags")   as string;
    const file       = data.get("video")        as File | null;

    if (!file || file.type !== "video/mp4") {
      return new Response(JSON.stringify({ error: "MP4 file required" }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // 1. Upload to a **private, short-lived** bucket
    const path = `videos/${userId}/${crypto.randomUUID()}_${file.name}`;
    const up   = await supabase.storage.from("temp-videos").upload(path, file.stream());
    if (up.error) return new Response(up.error.message, { 
      status: 500,
      headers: corsHeaders
    });

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
      .single();

    if (error) return new Response(error.message, { 
      status: 500,
      headers: corsHeaders
    });

    // 3. (optional) keep questionnaire in its own table
    await supabase.from("questionnaire_responses").insert({
      id:          crypto.randomUUID(),
      user_id:     userId,
      niche,
      product,
      ad_output_range: adOutput,
      search_tags: searchTags
    });

    return new Response(JSON.stringify({ videoId: vid.id }), { 
      status: 202,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  },

  async OPTIONS(req) {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  },
});
