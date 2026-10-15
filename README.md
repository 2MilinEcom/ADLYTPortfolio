# ADLYT

I started ADLYT as a workspace for researching ads and putting together product videos. I built a React interface for browsing products and ads, alongside Python tools for downloading clips, extracting audio, comparing frames, and planning edits.

I also explored Supabase storage, an upload function, and database tables for video jobs. The worker under `apps/backend/python_worker/` is an unfinished reference, so I do not present it as a complete processing service.

## Built with

I used React, TypeScript, Vite, and Tailwind CSS for the interface. My processing experiments use Python, Selenium, FFmpeg, and optional model services. I used Supabase for storage and database work.

## Inside the project

* `apps/frontend/`: the React interface.
* `apps/backend/scraper/`: the video processing experiments.
* `supabase/`: database migrations and the upload function.
* `competition_research/`: ad research scripts.
* `scraper/`: an earlier version of the processing tools.

## Running it

I start the interface from `apps/frontend/` with `npm ci` and `npm run dev`. I copy its `.env.example` to a local `.env` file and configure my own Supabase project first.

I configure the Python tools separately using their local environment examples. The root `requirements.txt` covers the early storage utilities, rather than every dependency used by the later experiments. I check the imports in a script before running it.

I supply fresh signed video URLs through `VIDEO_SIGNED_URLS_JSON`, using a JSON array of HTTPS URLs in my local environment. I keep browser profiles, account credentials, and generated files out of version control.

## Project notes

I kept earlier processing scripts and example edit plans for reference. I left sample videos and generated results out of this public copy. This is an experimental project, and some scripts still need local path and dependency setup.

I keep more detail in the [processing guide](apps/backend/scraper/README_ORCHESTRATOR.md) and [path configuration notes](apps/backend/scraper/README_CONFIG.md).

I keep this repository as a source copy with a new history. I configure my own accounts and local files when running it.
