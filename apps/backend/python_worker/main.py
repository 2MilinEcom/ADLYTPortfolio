# import os, time, json, tempfile, uuid
# import requests, ffmpeg, whisper, openai
# from supabase import create_client

# SB  = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"])
# WHISPER = whisper.load_model("base")
# openai.api_key = os.environ["OPENAI_API_KEY"]

# def next_video():
#     res = SB.from_("videos").select("*").eq("status", "queued").limit(1).single().execute()
#     return res.data

# def download(path):
#     signed = SB.storage.from_("temp-videos").create_signed_url(path, 1800)["signedURL"]
#     data   = requests.get(signed, stream=True); data.raise_for_status()
#     tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
#     for chunk in data.iter_content(1 << 20): tmp.write(chunk)
#     tmp.close()
#     return tmp.name

# def extract_audio(mp4):
#     wav = tempfile.NamedTemporaryFile(delete=False, suffix=".wav").name
#     ffmpeg.input(mp4).output(wav, ac=1, ar="16k").overwrite_output().run(quiet=True)
#     return wav

# def screenshots(mp4, every=60):
#     dur = float(ffmpeg.probe(mp4)["format"]["duration"])
#     times, files = [], []
#     for t in range(0, int(dur), every):
#         jpg = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg").name
#         ffmpeg.input(mp4, ss=t).output(jpg, vframes=1).overwrite_output().run(quiet=True)
#         times.append(t*1000)  # ms
#         files.append(jpg)
#     return list(zip(times, files))

# def embed_text(txt):
#     return openai.Embedding.create(model="text-embedding-ada-002", input=txt)["data"][0]["embedding"]

# def up_frame(video_id, timestamp_ms, local_path):
#     store_path = f"frames/{video_id}/{uuid.uuid4()}.jpg"
#     SB.storage.from_("temp-videos").upload(store_path, open(local_path, "rb"))
#     emb = embed_text(f"frame at {timestamp_ms}ms")  # or CLIP on pixels
#     SB.from_("frames").insert({
#         "video_id":     video_id,
#         "timestamp_ms": timestamp_ms,
#         "path":         store_path,
#         "embedding":    emb
#     }).execute()

# def process(job):
#     SB.from_("videos").update({"status": "processing"}).eq("id", job["id"]).execute()

#     vfile = download(job["path"])
#     wav   = extract_audio(vfile)

#     text   = WHISPER.transcribe(wav)["text"]
#     chunks = [text]  # split if > 4k tokens

#     for idx, chunk in enumerate(chunks):
#         SB.from_("transcripts").insert({
#             "video_id":  job["id"],
#             "chunk_idx": idx,
#             "text":      chunk
#         }).execute()

#     for t, f in screenshots(vfile, every=60):
#         up_frame(job["id"], t, f)

#     # clean up storage & temp files
#     SB.storage.from_("temp-videos").remove([job["path"]])
#     SB.from_("videos").update({"status": "processed"}).eq("id", job["id"]).execute()
#     for p in [vfile, wav]: 
#         try: os.unlink(p)
#         except: pass

# while True:
#     j = next_video()
#     if j:
#         try: process(j)
#         except Exception as e:
#             print("❌", e)
#             SB.from_("videos").update({"status": "error"}).eq("id", j["id"]).execute()
#     else:
#         time.sleep(10)
