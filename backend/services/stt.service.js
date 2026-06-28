import fetch, { FormData, Blob } from 'node-fetch';

const SMALLEST_STT_API_URL = 'https://api.smallest.ai/waves/v1/pulse/get_text';

/**
 * Transcribe speech from audio buffer using Smallest.ai Pulse API.
 * Returns a String containing the transcript.
 *
 * @param {Buffer} audioBuffer - The audio file buffer
 * @param {string} filename - The original filename
 * @returns {Promise<string>} Transcript text
 */
export async function transcribeSpeech(audioBuffer, filename = 'audio.wav') {
  const apiKey = process.env.SMALLEST_API_KEY;
  if (!apiKey || apiKey === 'your_smallest_api_key_here') {
    throw new Error('SMALLEST_API_KEY is not configured');
  }

  const startMs = Date.now();
  
  // Use node-fetch FormData if available or native FormData
  const formData = new FormData();
  
  // node-fetch v3 doesn't typically need Blob for buffers if we pass it directly with filename
  // but we can try just passing the buffer. Wait, fetch needs a Blob or we can just pass an object to formData.append
  // node-fetch FormData format: formData.append('file', buffer, filename);
  formData.append('file', audioBuffer, filename);

  const response = await fetch(SMALLEST_STT_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => '');
    throw new Error(`Smallest.ai STT failed (${response.status}): ${errBody}`);
  }

  const data = await response.json();
  const latencyMs = Date.now() - startMs;

  console.log(`[STT] Smallest.ai transcribed in ${latencyMs}ms. Transcript: "${data.text || data.transcription}"`);

  return data.text || data.transcription || '';
}
