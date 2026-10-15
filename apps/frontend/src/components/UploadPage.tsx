import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/supabase_client";
import { free_form_schema } from "@/zod/free_form_schema";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const EDGE_FUNCTION_URL =
  import.meta.env.VITE_EDGE_PROCESS_URL ||               // .env for prod
  "https://rodrzdilfppwtjtufrfa.supabase.co/functions/v1/enqueue_video";   // dev emulator

const NICHES = [
  "Fitness", "Beauty", "Tech", "Fashion", "Food", "Travel", "Finance", "Education", "Gaming", "Pets",
  "Health", "Home Decor", "Parenting", "Automotive", "Sports", "Music", "Photography", "Outdoors", "Books", "Art"
];
const AD_OUTPUT_RANGES = [
  "0", "1-5", "6-10", "11-20", "21-50", "51-100"
];

// Color tokens consistent with LoginPage
const COLORS = {
  background:      "#424341",
  surface:         "#AAAFaf",
  surfaceHover:    "#AFA9B4",
  primary:         "#D1D7D7",
  primaryHover:    "#AFA9B4",
  border:          "#D1D7D7",
  text:            "#D1D7D7",
  textMuted:       "#AFA9B4",
  overlayHero:     "rgba(66,67,65,0.18)",
};

const UploadPage = () => {
  const [formData, setFormData] = useState({
    niche: '',
    product: '',
    adOutput: '',
    searchTags: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Remove alreadySubmitted logic

  const handleInputChange = (key: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    // 1) validate text fields
    const result = free_form_schema.safeParse(formData);
    if (!result.success) { setError(result.error.issues[0].message); setSubmitting(false); return; }

    // 2) get the logged-in user & token
    const { data: { user }, error: authErr } = await supabase.auth.getUser();
    if (authErr || !user) { setError("You must be logged in."); setSubmitting(false); return; }
    if (!selectedFile)   { setError("Please choose a video."); setSubmitting(false); return; }

    // 3) build FormData
    const fd = new FormData();
    fd.append("niche",       formData.niche);
    fd.append("product",     formData.product);
    fd.append("adOutput",    formData.adOutput);
    fd.append("searchTags",  formData.searchTags);
    fd.append("userId",      user.id);                    // keep it simple for now
    fd.append("video",       selectedFile, selectedFile.name);

    // (optional) send the JWT so the function can verify identity
    const { data: { session } } = await supabase.auth.getSession();
    const jwt = session?.access_token ?? "";

    try {
      const resp = await fetch(EDGE_FUNCTION_URL, {
        method: "POST",
        headers: {
          ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        body: fd,
      });

      if (resp.status !== 202) {
        const err = await resp.json(); throw new Error(err.error || "Failed to enqueue");
      }

      const { videoId } = await resp.json();
      setSuccess(`✅ Video queued! Job ID: ${videoId}`);
      setFormData({ niche:"", product:"", adOutput:"", searchTags:"" });
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'video/mp4') {
        setFileError('Only MP4 files are allowed.');
        setSelectedFile(null);
      } else {
        setFileError(null);
        setSelectedFile(file);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full font-inter text-[color:var(--text)] bg-[#18181b] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="relative z-20 min-h-screen flex items-center justify-center p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-[color:var(--surface)]/20 backdrop-blur-md rounded-2xl shadow-2xl ring-1 ring-[color:var(--border)]/30 max-w-[500px] w-full flex flex-col items-center p-8"
          style={{ backgroundColor: `${COLORS.surface}33`, boxShadow: '0 8px 32px 0 rgba(66,67,65,0.18)', borderRadius: '1rem' }}
          aria-label="Upload form"
        >
          <img
            src="/clear_logo.png"
            alt="Adlyt logo"
            className="mx-auto mb-6"
            style={{ width: 120, height: 120, objectFit: 'contain' }}
            draggable={false}
          />
          <h1 className="text-2xl font-bold mb-2 text-center" style={{ color: COLORS.text }}>
            Upload Information
          </h1>
          <p className="text-sm text-center mb-8" style={{ color: COLORS.textMuted }}>
            Share your business details to get personalized ad recommendations
          </p>
          <div className="w-full space-y-6">
            {/* Niche Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: COLORS.text }}>
                What niche are you in?
              </label>
              <Select
                value={formData.niche}
                onValueChange={(value) => handleInputChange('niche', value)}
              >
                <SelectTrigger 
                  className="w-full bg-[color:var(--surface)]/30 border border-[color:var(--border)]/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-[color:var(--primary)] focus:outline-none transition transform-gpu hover:scale-[1.02] ease-out duration-150"
                  style={{
                    backgroundColor: `${COLORS.surface}4D`,
                    borderColor: `${COLORS.border}66`,
                    color: COLORS.text,
                  }}
                >
                  <SelectValue placeholder="Select a niche..." />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto bg-gray-800 text-white border-gray-700">
                  {NICHES.map((niche) => (
                    <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Product Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: COLORS.text }}>
                What is your product?
              </label>
              <Input
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
                placeholder="Describe your product..."
                className="w-full bg-[color:var(--surface)]/30 border border-[color:var(--border)]/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-[color:var(--primary)] focus:outline-none transition transform-gpu hover:scale-[1.02] ease-out duration-150"
                style={{
                  backgroundColor: `${COLORS.surface}4D`,
                  borderColor: `${COLORS.border}66`,
                  color: COLORS.text,
                }}
              />
            </div>
            {/* Weekly Ad Output */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: COLORS.text }}>
                What is your weekly ad output?
              </label>
              <Select
                value={formData.adOutput}
                onValueChange={(value) => handleInputChange('adOutput', value)}
              >
                <SelectTrigger 
                  className="w-full bg-[color:var(--surface)]/30 border border-[color:var(--border)]/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-[color:var(--primary)] focus:outline-none transition transform-gpu hover:scale-[1.02] ease-out duration-150"
                  style={{
                    backgroundColor: `${COLORS.surface}4D`,
                    borderColor: `${COLORS.border}66`,
                    color: COLORS.text,
                  }}
                >
                  <SelectValue placeholder="Select weekly ad output..." />
                </SelectTrigger>
                <SelectContent className="max-h-48 overflow-y-auto bg-gray-800 text-white border-gray-700">
                  {AD_OUTPUT_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* Search Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: COLORS.text }}>
                What are some helpful search tags?
              </label>
              <Input
                value={formData.searchTags}
                onChange={(e) => handleInputChange('searchTags', e.target.value)}
                placeholder="Enter relevant tags..."
                className="w-full bg-[color:var(--surface)]/30 border border-[color:var(--border)]/40 text-white placeholder-gray-400 focus:ring-2 focus:ring-[color:var(--primary)] focus:outline-none transition transform-gpu hover:scale-[1.02] ease-out duration-150"
                style={{
                  backgroundColor: `${COLORS.surface}4D`,
                  borderColor: `${COLORS.border}66`,
                  color: COLORS.text,
                }}
              />
            </div>
            {/* MP4 Upload Button */}
            <div className="flex flex-col items-center w-full my-4">
              <button
                type="button"
                className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-md font-medium text-white transition-colors duration-200 focus:outline-none ${fileError ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'}`}
                onClick={() => fileInputRef.current?.click()}
                style={{ minWidth: 160 }}
              >
                {/* SVG upload icon */}
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 9l5-5m0 0l5 5m-5-5v12" />
                </svg>
                Upload Video
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4"
                className="hidden"
                onChange={handleFileChange}
              />
              {selectedFile && !fileError && (
                <span className="mt-2 text-sm text-gray-700">Selected: {selectedFile.name}</span>
              )}
              {fileError && (
                <span className="mt-2 text-sm text-red-500">{fileError}</span>
              )}
            </div>
          </div>
          {error && (
            <div
              className="text-red-500 text-sm mt-4 w-full text-center"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              className="text-green-500 text-sm mt-4 w-full text-center"
              role="alert"
              aria-live="assertive"
            >
              {success}
            </div>
          )}
          <button
            type="submit"
            disabled={!formData.niche || !formData.product || !formData.adOutput || !formData.searchTags || submitting || !!fileError}
            className="mt-8 w-full py-3 rounded-lg bg-[color:var(--primary)] text-[color:var(--background)] font-bold text-lg shadow-md hover:bg-[color:var(--primaryHover)] disabled:bg-gray-600 disabled:text-gray-400 transition-colors duration-150"
            style={{
              backgroundColor: COLORS.primary,
              color: COLORS.background,
              fontWeight: 700,
              fontSize: '1.125rem',
              borderRadius: '0.5rem',
              boxShadow: '0 2px 8px 0 rgba(66,67,65,0.12)',
            }}
          >
            {submitting ? 'Uploading...' : 'Upload Information'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadPage; 