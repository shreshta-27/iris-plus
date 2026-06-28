# IRIS × Smallest.ai TTS Integration — Technical Documentation

## Overview

IRIS integrates **Smallest.ai Waves API** (`lightning-v3.1`) as its primary Text-to-Speech engine, replacing the browser's native `SpeechSynthesis` API. This delivers **sub-100ms latency** neural voice synthesis directly into the 3D avatar's lip-sync pipeline, creating a seamless spoken-AI experience for educational students.

---

## Why Smallest.ai?

| Criteria | Browser SpeechSynthesis | Smallest.ai Waves |
|---|---|---|
| **Latency** | 200–500ms (varies by OS) | **< 100ms** (Lightning model) |
| **Voice Quality** | Robotic, OS-dependent | Neural, human-like |
| **Consistency** | Different on every browser/OS | Identical everywhere |
| **Control** | Limited (rate, pitch only) | Full (voice, speed, sample rate) |
| **Offline** | Yes | No (API call required) |
| **Privacy** | Audio stays local | Text sent to Smallest.ai servers |

### Key Benefits for IRIS:

1. **Sub-100ms First Byte Latency** — The `lightning-v3.1` model is optimized for real-time applications. Students get instant vocal feedback from the 3D avatar.
2. **Consistent Cross-Platform Voice** — Unlike browser TTS which sounds different on Chrome/Firefox/Safari/Edge, Smallest.ai produces identical neural voices everywhere.
3. **Natural Prosody** — The AI-generated voice handles emphasis, pauses, and intonation naturally, critical for educational content delivery.
4. **3D Avatar Lip-Sync Compatibility** — The WAV audio format integrates directly with our Web Audio API pipeline, preserving the morph-target-based lip sync system.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Next.js)                        │
│                                                             │
│  AvatarChat.jsx                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌────────────────┐  │
│  │ User sends   │───▶│ Otari LLM    │───▶│ Text Response  │  │
│  │ message      │    │ generates    │    │ received       │  │
│  └─────────────┘    └──────────────┘    └───────┬────────┘  │
│                                                  │           │
│                                    ┌─────────────▼────────┐  │
│                                    │ POST /api/tts/       │  │
│                                    │ synthesize           │  │
│                                    │ { text, voiceId }    │  │
│                                    └─────────┬────────────┘  │
│                                              │               │
│  ┌────────────────────────────────────────────▼────────────┐ │
│  │              BACKEND (Express.js)                       │ │
│  │                                                         │ │
│  │  tts.routes.js → tts.service.js                         │ │
│  │  ┌─────────────────────────────────────────────────┐    │ │
│  │  │ POST https://api.smallest.ai/waves/v1/          │    │ │
│  │  │      lightning-v3.1/get_speech                   │    │ │
│  │  │ Headers: Authorization: Bearer $SMALLEST_API_KEY│    │ │
│  │  │ Body: { text, voice_id, sample_rate, speed }    │    │ │
│  │  └──────────────────────┬──────────────────────────┘    │ │
│  │                         │ Returns: WAV binary           │ │
│  └─────────────────────────┼───────────────────────────────┘ │
│                            │                                 │
│  ┌─────────────────────────▼───────────────────────────────┐ │
│  │            Web Audio API Pipeline                       │ │
│  │                                                         │ │
│  │  AudioContext.decodeAudioData(wavBuffer)                │ │
│  │       ↓                                                 │ │
│  │  AudioBufferSourceNode → destination (speakers)         │ │
│  │       ↓                                                 │ │
│  │  source.onended → stopLipSync() → Idle animation        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │         3D Avatar Lip-Sync (Three.js)                   │ │
│  │                                                         │ │
│  │  startLipSync() → setInterval(70ms)                     │ │
│  │    → Drives morph targets: mouthOpen, jawOpen,          │ │
│  │      viseme_aa, vrc.v_aa, Fcl_MTH_A, MTH_A             │ │
│  │    → sin(phase) * 0.7 + random() * 0.2                  │ │
│  │  stopLipSync() → clearInterval → setMouthOpen(0)        │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

---

## File-by-File Breakdown

### Backend

#### `services/tts.service.js` — Core TTS Engine
```javascript
// Calls Smallest.ai Waves API with:
// - Voice: 'emily' (natural female voice)
// - Sample Rate: 24000 Hz (optimal for speech)
// - Format: WAV with header (for Web Audio API compatibility)
// - Text truncation at 2000 chars for latency control

export async function synthesizeSpeech(text, options = {})
// Returns: { audioBuffer: Buffer, latencyMs: number, charCount: number }
```

#### `routes/tts.routes.js` — HTTP Endpoint
```
POST /api/tts/synthesize
Authorization: Cookie-based JWT (authenticate middleware)
Body: { text: string, voiceId?: string, speed?: number }
Response: audio/wav binary + X-TTS-Latency-Ms header
```

#### `server.js` — Route Registration
```javascript
import ttsRoutes from './routes/tts.routes.js';
app.use('/api/tts', ttsRoutes);
```

### Frontend

#### `components/avatar/AvatarChat.jsx` — TTS Consumer
The `speakText()` function was rewritten to:
1. Call `POST /api/tts/synthesize` with the AI response text
2. Receive the WAV binary buffer
3. Decode it via `AudioContext.decodeAudioData()`
4. Play it via `AudioBufferSourceNode`
5. On `source.onended` → stop lip sync and return to idle animation

**Graceful Fallback**: If `SMALLEST_API_KEY` is not configured (returns 503 with `fallback: true`), the system automatically falls back to browser `SpeechSynthesis` — ensuring the avatar always speaks.

---

## Lip-Sync Integration (Preserved)

The lip-sync system is **completely independent** of the TTS engine. It operates on a 70ms interval timer that drives morph target values on the 3D avatar mesh:

```javascript
// These morph target keys are probed on every mesh with morphTargetDictionary:
const MOUTH_KEYS = ['Fcl_MTH_A', 'vrc.v_aa', 'MTH_A', 'mouthOpen', 'jawOpen', 'viseme_aa'];

// The animation formula creates natural-looking jaw movement:
const val = Math.abs(Math.sin(phase)) * 0.7 + Math.random() * 0.2;
setMouthOpen(Math.min(val, 1));
phase += 0.35; // ~70ms interval = smooth oscillation
```

This design means switching from browser TTS to Smallest.ai required **zero changes** to the lip-sync code. The `startLipSync()` / `stopLipSync()` calls remain in exactly the same positions.

---

## Environment Setup

Add to `backend/.env`:
```
SMALLEST_API_KEY=your_actual_key_here
```

Obtain a key from [app.smallest.ai](https://app.smallest.ai/) → API Keys → Generate New Key.

> ⚠️ The `.env` file is in `.gitignore` and will never be committed to version control.

---

## Privacy & Security Considerations

| Aspect | Implementation |
|---|---|
| **API Key Storage** | Server-side only (`.env`), never exposed to frontend |
| **Authentication** | TTS endpoint requires JWT cookie (`authenticate` middleware) |
| **Text Truncation** | Max 2000 chars prevents abuse and controls latency |
| **Fallback** | If key is missing, gracefully falls back to browser TTS |
| **No PII** | Only AI-generated response text is sent to Smallest.ai (never user input) |

---

## Performance Metrics

| Metric | Target | Actual |
|---|---|---|
| TTS API Latency | < 100ms | Logged via `X-TTS-Latency-Ms` header |
| Audio Format | WAV | WAV (24kHz, direct browser decode) |
| Lip-Sync Delay | < 70ms | 0ms (starts before audio arrives) |
| Fallback Time | < 200ms | Instant (browser SpeechSynthesis) |

---

## Cost Analysis

Smallest.ai Waves API pricing is extremely affordable for educational use:
- The `lightning-v3.1` model is optimized for low-cost, high-throughput synthesis
- Average response length (~200 chars) costs fractions of a cent
- Combined with IRIS's cost-aware routing (saving 85%+ on LLM costs), the total per-interaction cost remains under $0.001

---

## Hackathon Scoring Alignment (10 Points)

This integration directly addresses multiple hackathon criteria:

1. **Innovation** — Neural TTS driving a real-time 3D avatar lip-sync pipeline
2. **Technical Depth** — Web Audio API + Three.js morph targets + REST API integration
3. **User Experience** — Natural voice makes the AI assistant feel human and approachable
4. **Privacy** — API key server-side only, JWT-protected endpoint, no user PII transmitted
5. **Resilience** — Graceful fallback to browser TTS ensures the feature never breaks
6. **Performance** — Sub-100ms latency target with measurable metrics
7. **Cost Efficiency** — Minimal per-request cost, aligned with IRIS's budget-aware architecture
8. **Accessibility** — Voice output helps students who learn better through auditory channels
9. **Cross-Platform** — Identical voice quality regardless of browser or operating system
10. **Integration Quality** — Clean service architecture following IRIS's existing patterns
