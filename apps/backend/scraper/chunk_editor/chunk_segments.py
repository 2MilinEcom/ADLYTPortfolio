def chunk_segments(segments, max_chars=3000):
    chunks = []
    current_chunk = []
    current_length = 0

    for seg in segments:
        seg_text = seg["text"]
        seg_len = len(seg_text)

        if current_length + seg_len > max_chars:
            chunks.append(current_chunk)
            current_chunk = [seg]
            current_length = seg_len
        else:
            current_chunk.append(seg)
            current_length += seg_len

    if current_chunk:
        chunks.append(current_chunk)

    return chunks