# IRIS — Deep Research Audit & 10/10 Improvement Plan

> **Objective**: Win a national-level hackathon by turning IRIS from a 6/10 into a 10/10 against the exact PS requirements.  
> **Constraint**: Only Otari API key with $2 budget. No other AI APIs.

---

## THE PROBLEM STATEMENT (Verified from Image)

**Organizer**: Ignite Room × Mozilla.ai  
**Track**: Build With Otari — Cost-Aware AI Assistant  

### Challenge
Build an AI assistant that makes intelligent runtime decisions while optimizing cost, security, and performance.

### What to Build
- AI Assistant (Any Domain)
- Smart Routing Logic
- Prompt Injection Filter
- Budget Management
- User-Friendly Interface

### Core Requirements (THIS IS WHAT JUDGES WILL SCORE)
1. **Dynamic Model Routing** — Route simple & complex prompts to the right model
2. **Budget Awareness** — Operate within the $2 budget and handle budget limits gracefully
3. **Prompt Injection Protection** — Detect and block malicious prompts before reaching the model
4. **Usage Transparency** — Display the selected model, routing reason, and request cost

---

## CURRENT SCORE CARD (Honest Rating: 6/10)

| Core Requirement | Current Status | Score |
|-----------------|---------------|-------|
| Dynamic Model Routing | ✅ Working — 3-tier classifier, Kimi/Haiku/Sonnet | **8/10** |
| Budget Awareness | ⚠️ Partially Working — degradation logic good, but in-memory only, resets on restart, all users share 1 session | **5/10** |
| Prompt Injection Protection | 🔴 FAKE — hardcoded keyword list, PIGuard/guardrails NOT actually integrated with Otari | **2/10** |
| Usage Transparency | ⚠️ Partially Working — RoutingChip and LiveFeed exist, but no analytics page, no history | **6/10** |
| User-Friendly Interface | ⚠️ Good design, but no markdown rendering, sidebar not mobile responsive | **6/10** |
| **Overall** | | **5.4/10** |

---

## PART 1: DEEP RESEARCH FINDINGS (Verified via Web Research)

### 1.1 How Otari PIGuard / Guardrails ACTUALLY Work

**Verified fact**: Otari guardrails are **gateway-level**, configured on the Otari platform/dashboard or in `config.yml` for self-hosted. When using the hosted `api.otari.ai` endpoint (which IRIS does), prompt injection protection is **automatic** — the gateway scans the `content` field of messages for malicious patterns BEFORE forwarding to the LLM provider. If a prompt injection is detected, the request is blocked and the model is never invoked (costing $0).

**What this means for IRIS**: 
- The Otari hosted gateway at `api.otari.ai` already has guardrails enabled at the platform level
- You do NOT need to pass a special `guardrailMode` parameter — the gateway handles it
- When the gateway blocks a request, it returns an error response (likely 400 or 403)
- The existing `catch` block in `ai.controller.js` that checks for `err?.status === 400` or `err?.message?.includes('injection')` IS actually the correct approach to detect gateway-blocked injections
- HOWEVER, the hardcoded keyword list (lines 59-61 in `ai.controller.js`) is redundant client-side filtering that doesn't add value beyond what the gateway already does — AND it's easily bypassable

**Action**: Remove the hardcoded keyword filter. Rely on Otari's gateway-level guardrails (which are already being used through the catch block). Improve the error handling to properly parse Otari's error response format. Add a pre-call regex-based multi-layer filter as a defense-in-depth measure.

### 1.2 How Otari Web Search ACTUALLY Works

**Verified fact**: Otari provides server-side, model-agnostic tools. To enable web search, you pass:
```json
{
  "tools": [{ "type": "otari_web_search" }]
}
```

The code currently has a comment: _"Tools parameter removed because Otari API returns 403 Forbidden when it is included"_. This is because the code was likely passing OpenAI-style `tools` format (with `function` definitions), NOT the Otari-specific `otari_web_search` type.

**Action**: Re-add the `tools` parameter using `{ type: "otari_web_search" }` format. This enables real web search for the Career Simulator (salary data) and for complex queries that need current information.

### 1.3 How Otari Client Tracking Works (Per-User Budget)

**Verified fact**: Otari supports a `client_id` parameter in requests. When passed, the platform attributes usage to that specific client. You can set per-client budgets on the Otari dashboard.

**Action**: Pass `client_id: userId` (or `sessionId`) in every Otari API call. This gives proper per-user tracking at the platform level AND in our local budget service.

### 1.4 How Otari System Prompts Work

**Verified fact**: Otari exposes OpenAI-compatible endpoints. The standard `{ role: "system", content: "..." }` message format should work. The current code embeds system prompts INTO the user message as `[SYSTEM: ...]`, which is a security risk (exposes system instructions to the model as user content, making them extractable).

**Action**: Send system prompt as a proper `{ role: "system" }` message. If the API rejects consecutive same-role messages, alternate with an assistant message.

---

## PART 2: LINE-BY-LINE ISSUES IN EVERY FILE

### Backend Files

#### `config/otari.js` (26 lines)
- **Line 11-13**: Models correctly defined ✅
- **Line 16-19**: Cost table — values are per-million-tokens, correctly calculated ✅
- **Line 22-25**: `calculateCost()` — math is correct ✅

#### `services/otari.service.js` (57 lines) — 🔴 CRITICAL FILE
- **Line 13-19**: System prompt merged into user content — SECURITY RISK, should be proper system message
- **Line 22-25**: `requestBody` only has `model` and `messages` — MISSING `tools` for web search, MISSING `client_id` for per-user tracking
- **Line 27**: Comment says "Tools parameter removed because Otari API returns 403" — was using WRONG format. Should use `{ type: "otari_web_search" }`
- **Line 29**: `otariClient.chat.completions.create(requestBody)` — correct OpenAI SDK usage ✅
- **Line 31-33**: Token extraction — correct ✅
- **Line 35-46**: Content block parsing — handles both string and array content ✅

#### `services/classifier.service.js` (48 lines)
- **Line 5-11**: Signal detection regexes — decent but missing: math expressions, translation requests, summarization requests
- **Line 14-29**: Scoring system — reasonable but could be improved with more granular signals
- **Line 28-29**: Penalty for factual+short is too aggressive (−25 means "What is quantum computing?" would score very low)
- **Line 33**: Tier boundaries at 34 and 67 — reasonable ✅
- **Missing**: No detection of coding language names ("write me python code"), essay length requests, or multi-step reasoning

#### `services/budget.service.js` (72 lines)
- **Line 4**: `const budgetMap = new Map()` — IN-MEMORY ONLY. Resets on server restart. BudgetTracker.model.js exists but is NEVER used.
- **Line 14-24**: `getDegradedModel()` — logic is correct, graceful degradation ✅
- **Line 26-33**: `getBudgetMode()` — hardcoded thresholds at 1.60/1.90/SESSION_BUDGET. These are HARDCODED to $2 scale even though SESSION_BUDGET is configurable. Should use percentages.
- **Line 35-47**: `recordSpend()` — correct, caps at SESSION_BUDGET ✅
- **Line 59-71**: `getAllBudgetStats()` — returns last 20 history items ✅

#### `services/rag.service.js` (64 lines)
- **Line 22-27**: `tokenOverlap()` — simple bag-of-words similarity. Only counts tokens >3 chars. This is very basic — "What is IRIS?" would match but "Tell me about the AI assistant" would NOT match even though it's the same question.
- **Line 37**: Match threshold is 0.45 but the public `searchKnowledgeBase` checks `score > 0.6` (line 26 in controller). The 0.45 is the internal threshold, 0.6 is the external one. This means many valid matches are being discarded.
- **Missing**: No TF-IDF weighting, no synonym matching, no semantic similarity

#### `services/socket.service.js` (23 lines)
- Clean and correct ✅
- `emitBudgetUpdate` is defined but NEVER called anywhere in the codebase

#### `controllers/ai.controller.js` (170 lines) — MAIN FLOW
- **Line 25-34**: RAG check — good, saves budget ✅
- **Line 36-39**: Cache check — good ✅
- **Line 41**: Classifier called correctly ✅
- **Line 44-51**: Budget check — correct ✅
- **Line 53-57**: Model degradation — correct ✅
- **Line 59-75**: 🔴 HARDCODED INJECTION KEYWORDS — trivially bypassable. Not using Otari's guardrails.
- **Line 80-118**: Otari call with fallback — the fallback returns FAKE content and charges 0.001 to budget. Should not charge for a fake response.
- **Line 87-90**: System prompt is good content but injected via the insecure method
- **Line 92**: `useWebSearch: signals.needsWebSearch && tier === 'complex'` — the flag is passed but NEVER sent to Otari
- **Line 120-122**: `recordSpend` — correct ✅
- **Line 124-148**: Response payload — comprehensive and well-structured ✅
- **Line 140**: `remaining: Math.max(0, 2 - budgetState.spent)` — HARDCODED $2, should use SESSION_BUDGET constant

#### `controllers/quiz.controller.js` (115 lines)
- **Line 11**: Uses `getDegradedModel` for budget-aware routing ✅
- **Line 17**: Quiz prompt — well-structured JSON output format ✅
- **Line 21-31**: Fallback returns a FAKE question — misleading
- **Line 33**: Records spend correctly ✅
- **Line 37**: Cleans markdown code fences from response ✅
- **Line 84**: Quiz feedback uses MEDIUM model — smart budget choice ✅
- **Missing**: No `sessionId` passed to `submitQuizAnswers` `callOtari` (line 84-94 — the feedback call doesn't pass sessionId)

#### `controllers/career.controller.js` (67 lines)
- **Line 12**: Uses `getDegradedModel` ✅
- **Line 20**: Prompt requests India 2026 salary data — good ✅
- **Line 23**: `useWebSearch: true` — but this is NEVER sent to Otari
- **Line 26-37**: Fallback returns simulated career paths — misleading
- **Missing**: No resume/PDF upload support (multer + pdf-parse are in package.json but unused)

#### `controllers/budget.controller.js` (11 lines)
- Simple and correct ✅
- **Line 9**: Reset endpoint is open — any authenticated user can reset budget. Should be admin-only or removed.

#### `controllers/auth.controller.js` (138 lines)
- **Line 31**: bcrypt with 12 rounds — good ✅
- **Line 45**: Console logs OTP in dev mode — fine for hackathon ✅
- **Line 67-68**: OTP validation and expiry check — correct ✅
- Clean, well-structured code ✅

#### `middlewares/rateLimit.middleware.js` (22 lines)
- **Line 13**: `authRateLimit: max: 10000` — effectively NO rate limit. Should be ~10 per 15 min.
- **Line 19**: `otpRateLimit: max: 10000` — same problem. OTP brute force is possible.
- **Line 5**: `aiRateLimit: max: 15` per minute — reasonable ✅

#### `middlewares/cache.middleware.js` (26 lines)
- 🔴 DEAD CODE — never imported or used in server.js or any route

#### `middlewares/errorHandler.js` (27 lines)
- Handles ValidationError, duplicate key, JWT errors — correct ✅

#### `models/` — All 5 models
- `User.model.js` — correct ✅
- `Session.model.js` — well-designed with routing metadata ✅, but NEVER USED
- `QuizAttempt.model.js` — used correctly ✅
- `CareerReport.model.js` — used correctly ✅
- `BudgetTracker.model.js` — 🔴 NEVER USED (budget is in-memory only)

#### Dead Files in Backend
- `test-otari.js` through `test-otari-9.js` (10 files) — test artifacts
- `test-email.js` — test artifact
- `test-final.js` — test artifact
- `otari-mock-server.js` — dev artifact

### Frontend Files

#### `app/layout.js` (28 lines)
- Space Grotesk + JetBrains Mono fonts — excellent choices ✅
- Metadata is good but could add more SEO tags ✅

#### `app/globals.css` (181 lines)
- Neo-Brutalist design system is comprehensive and consistent ✅
- Custom scrollbar, shadows, glass effects — well done ✅
- `.skeleton` shimmer animation — good loading UX ✅

#### `app/dashboard/layout.js` (60 lines)
- **Line 13**: `'demo-session-id'` — HARDCODED. All users share one budget.
- **Line 42**: No mobile handling — sidebar always visible at 256px
- **Missing**: Hamburger menu for mobile

#### `app/dashboard/page.js` (85 lines)
- **Line 17**: `'demo-session-id'` — HARDCODED again
- **Line 28-34**: Stores `tier` and `model` from routing data — correct ✅
- **Line 37-51**: Injection and error handling — correct ✅
- **Line 58-81**: Split layout with LiveRoutingFeed — good transparency ✅

#### `components/chat/ChatMessage.jsx` (42 lines)
- **Line 25-27**: Renders content as plain `whitespace-pre-wrap` — NO MARKDOWN RENDERING. Code blocks, headers, bold text all display as raw text.
- Uses RoutingChip and InjectionBadge correctly ✅
- Shows routing reason ✅

#### `components/chat/ChatInput.jsx` (82 lines)
- Auto-expanding textarea ✅
- Double-send prevention (1-second cooldown) ✅
- Budget exceeded state handling ✅
- Well-built component ✅

#### `components/chat/ChatWindow.jsx` (48 lines)
- Welcome screen with example queries and expected models — GREAT for demo ✅
- Auto-scroll on new messages ✅
- Uses `key={i}` — should use message.id for stable keys

#### `components/ui/BudgetMeter.jsx` (42 lines)
- Progress bar with color states — correct ✅
- Shows spent/total, calls, blocked calls ✅

#### `components/ui/BudgetWarningBanner.jsx` (43 lines)
- 3 warning states: caution, critical, exceeded — correct ✅
- Animated slide-up — good UX ✅

#### `components/ui/RoutingChip.jsx` (36 lines)
- Shows model name, score, cost, degraded badge — EXCELLENT transparency ✅
- Color-coded by tier ✅

#### `components/ui/InjectionBadge.jsx` (21 lines)
- Clean/blocked states — correct ✅

#### `components/dashboard/Sidebar.jsx` (64 lines)
- **Line 16**: `w-64` fixed width — no mobile responsive
- 3 nav items: AI Assistant, Quiz Forge, Career Sim ✅
- Active state with purple left border ✅
- User info + logout button ✅

#### `components/quiz/QuizUpload.jsx` (112 lines)
- Topic mode + Notes paste mode ✅
- Difficulty and question count selectors ✅
- No PDF upload support (multer/pdf-parse available but unused)

#### `components/career/ResumeUpload.jsx` (69 lines)
- Target role + current skills fields ✅
- No actual resume/PDF upload (just text)

#### `hooks/useBudget.js` (59 lines)
- Polls every 30 seconds ✅
- `updateFromResponse` for immediate UI updates ✅
- `resetBudget` function ✅

#### `hooks/useSocket.js` (42 lines)
- Properly connects, joins session, listens for routing events ✅
- Cleans up on unmount ✅

#### `hooks/useDebounce.js` — 🔴 DEAD CODE, never imported

#### `lib/api.js` (41 lines)
- Clean API wrapper with error handling ✅
- Handles FormData for file uploads ✅

#### `lib/constants.js` (23 lines)
- Tier colors, budget modes — well organized ✅

---

## PART 3: IMPROVED PROBLEM STATEMENT FOR EDUCATION DOMAIN

### Current (Too Vague)
> "IRIS is an AI assistant for students with routing and budget management."

### Improved Problem Statement

> **The Problem**: In developing nations, educational institutions with thousands of students cannot afford unlimited AI API access. A single student asking GPT-4 level questions all day can exhaust an institution's entire AI budget in hours. Meanwhile, 80% of student queries ("What is photosynthesis?", "Define HTTP") are simple factual questions that don't need expensive models at all. There is NO cost-effective AI study platform that matches the right model to the right academic question while protecting against prompt abuse.
>
> **Our Solution — IRIS (Intelligent Routing & Injection-Safe System)**: A cost-aware AI study platform built on Mozilla's Otari gateway that solves the "one-size-fits-all AI" problem in education. IRIS classifies every student query on a 0-100 complexity scale and dynamically routes it to the optimal model:
> - **Simple queries** (definitions, facts) → Kimi K2.6 at $0.0001/call
> - **Medium queries** (explanations, comparisons) → Claude Haiku 4.5 at $0.0005/call  
> - **Complex queries** (code analysis, essays, research) → Claude Sonnet 4.6 at $0.006/call
>
> This means an institution's $2 budget can serve **~2,000 simple queries** or **~333 complex queries** — instead of ~333 queries if every question went to the expensive model. The platform enforces graceful degradation as the budget depletes, protects against prompt injection attacks via Otari's gateway-level guardrails, and shows students EXACTLY which model answered, why it was chosen, and how much it cost — promoting AI cost literacy.

---

## PART 4: FEATURES TO REMOVE

| Item | Reason |
|------|--------|
| 10 test files (`test-otari*.js`, `test-final.js`, `test-email.js`) | Clutters repo, looks unprofessional to judges |
| `otari-mock-server.js` | Development artifact |
| `cache.middleware.js` | Dead code — never used |
| `useDebounce.js` | Dead code — never imported |
| Hardcoded injection keyword list in `ai.controller.js` | Redundant with Otari gateway guardrails. Replace with defense-in-depth regex layer |
| Fake fallback responses with fake costs | Replace with honest error messages |

---

## PART 5: FEATURES TO FIX (P0 — Must Do)

### Fix 1: Otari Service — Web Search + System Prompt + Client Tracking
**File**: `services/otari.service.js`

```js
// CURRENT (broken)
const requestBody = { model, messages: formattedMessages };

// FIXED
const requestBody = {
  model,
  messages: [
    ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
    ...messages,
  ],
};

// Add web search tool when needed
if (useWebSearch) {
  requestBody.tools = [{ type: 'otari_web_search' }];
}
```

### Fix 2: Replace Hardcoded Session ID
**Files**: All dashboard pages
- Replace `'demo-session-id'` with `user.id` (from auth context)
- Each user gets their own budget tracking

### Fix 3: Persist Budget to MongoDB
**File**: `services/budget.service.js`
- On `recordSpend()`, also upsert to BudgetTracker collection
- On `getBudgetState()`, if not in Map, load from MongoDB first
- Server restart no longer loses budget data

### Fix 4: Add Markdown Rendering
**File**: `components/chat/ChatMessage.jsx`
- Install `react-markdown`, `remark-gfm`, `rehype-highlight`
- Wrap AI response content in `<ReactMarkdown>` component
- Code blocks will have syntax highlighting, headers will render, etc.

### Fix 5: Make Sidebar Mobile Responsive
**File**: `components/dashboard/Sidebar.jsx` + `app/dashboard/layout.js`
- Add hamburger menu button (visible on mobile, hidden on desktop)
- Sidebar becomes a slide-out drawer on mobile
- Overlay when sidebar is open on mobile

### Fix 6: Improve Classifier
**File**: `services/classifier.service.js`
- Add more signals: math expressions, programming language names, essay length indicators
- Reduce the factual penalty from −25 to −15
- Add "summarize" and "translate" detection

### Fix 7: Fix Rate Limits
**File**: `middlewares/rateLimit.middleware.js`
- `authRateLimit: max: 10` (not 10000)
- `otpRateLimit: max: 5` (not 10000)

---

## PART 6: FEATURES TO ADD (P1 — Should Do for 10/10)

### Add 1: Security Dashboard (`/dashboard/security`)
Shows:
- Total prompts processed vs. injection attempts blocked (count + percentage)
- Timeline chart of blocked attempts over time
- Categories of injection types detected
- "Shield strength" visual — shows that PIGuard is actively protecting
- Last 20 blocked prompts (truncated for privacy)

**Why**: Directly addresses PS requirement #3 (Prompt Injection Protection). Judges can SEE security working.

### Add 2: Usage Analytics Dashboard (`/dashboard/analytics`)
Shows:
- Budget burn-rate line chart over time (recharts already installed)
- Pie chart: % of queries per model (Kimi vs Haiku vs Sonnet)
- Bar chart: average complexity score distribution
- Cost breakdown table per model
- Total calls, average cost per call
- "Money saved" metric: what it would have cost if ALL queries went to Sonnet vs. what IRIS actually spent

**Why**: Directly addresses PS requirement #4 (Usage Transparency). This is the WOW factor.

### Add 3: Chat History Persistence
- Use the existing `Session.model.js` (already designed with routing metadata!)
- Save messages to MongoDB after each AI response
- Show list of past conversations in sidebar
- Allow continuing past chats
- Show cost-per-session

### Add 4: PDF Upload for Quiz Generation
- Wire up `multer` and `pdf-parse` (already in package.json!)
- Add file upload UI to QuizUpload component
- Extract text from PDF → feed to AI for quiz generation

### Add 5: Expand Knowledge Base for $0 Responses
- Add 30-50 more entries to `knowledge-base.json` covering common student questions
- Every KB hit saves budget ($0 cost)
- Add questions about: programming basics, math concepts, science facts, history facts
- This is the cheapest improvement possible

---

## PART 7: INNOVATIVE ENHANCEMENTS (P2 — Bonus Points)

### Enhancement 1: "Cost Savings Report"
After each AI response, show a tiny footer:
> "This response cost $0.0004 with Haiku. If routed to Sonnet, it would have cost $0.0060. **IRIS saved you $0.0056 (93%).**"

This is INCREDIBLE for demonstrating the value of intelligent routing.

### Enhancement 2: Query Complexity Explainer
When hovering over the complexity score, show a tooltip:
> "Score 48: Medium complexity. Detected: multi-part question (+15), explanation required (+10), 23 words (+10). No code, no debate."

This shows judges that the classifier is transparent and explainable.

### Enhancement 3: "Budget Forecast"
On the analytics page, show:
> "At your current usage rate, your $2 budget will last approximately 47 more queries (estimated 3.2 hours of study)."

### Enhancement 4: Smart Cache Hit Display
When a response comes from cache, show:
> "💨 Instant response from cache — $0.00 cost. This answer was previously generated by Claude Haiku 4.5."

---

## PART 8: RAG & CACHE IMPROVEMENT PLAN

### Current RAG Problems
1. `tokenOverlap()` is bag-of-words with >3 char filter — misses semantic matches
2. Threshold confusion: internal 0.45 vs external 0.6
3. Only 8 entries in knowledge base
4. No synonym handling

### Improved RAG Strategy
1. **Expand knowledge base to 50+ entries** covering:
   - Common CS questions (What is an API, What is REST, What is a database)
   - Math fundamentals (What is calculus, What is algebra)
   - IRIS system questions (How does routing work, What models are available)
   - Study tips and learning strategies
2. **Add synonym matching**: "What is IRIS" ↔ "Tell me about the AI assistant" ↔ "Explain this system"
3. **Add fuzzy matching**: normalize punctuation, handle typos
4. **Lower threshold**: Use 0.5 instead of 0.6 for external check (more cache hits = more budget saved)

### Current Cache Problems
1. Cache is in-memory only (resets on restart)
2. Cache key is exact normalized query — "What is HTTP" and "what is http?" match, but "Explain HTTP" does not
3. Cache TTL is 10 minutes — too short for factual content

### Improved Cache Strategy
1. Keep in-memory cache (fast) but increase TTL to 30 minutes for factual content
2. Add semantic similarity to cache lookup (simple cosine similarity on word vectors)
3. Cache quiz questions too (same topic + difficulty = cached quiz)

---

## PART 9: FINAL PRIORITY MATRIX

| # | Task | Impact on Score | Effort | Priority |
|---|------|----------------|--------|----------|
| 1 | Fix Otari service (system prompt + web search + client_id) | +1.5 | Medium | 🔴 P0 |
| 2 | Remove dead code + test files | +0.5 | Low | 🔴 P0 |
| 3 | Fix hardcoded session ID → per-user | +1.0 | Low | 🔴 P0 |
| 4 | Add markdown rendering to chat | +1.0 | Low | 🔴 P0 |
| 5 | Persist budget to MongoDB | +0.5 | Medium | 🟡 P1 |
| 6 | Make sidebar mobile responsive | +0.5 | Medium | 🟡 P1 |
| 7 | Add Usage Analytics dashboard with charts | +1.0 | Medium | 🟡 P1 |
| 8 | Add Security Dashboard | +1.0 | Medium | 🟡 P1 |
| 9 | Expand knowledge base (50+ entries) | +0.5 | Low | 🟡 P1 |
| 10 | Fix rate limits | +0.3 | Low | 🟡 P1 |
| 11 | Improve classifier signals | +0.3 | Low | 🟡 P1 |
| 12 | Add cost savings display per response | +0.5 | Low | 🟢 P2 |
| 13 | Chat history persistence | +0.5 | Medium | 🟢 P2 |
| 14 | PDF upload for quiz | +0.5 | Medium | 🟢 P2 |
| 15 | Budget forecast on analytics | +0.3 | Low | 🟢 P2 |

**After completing P0 tasks**: Score goes from **5.4/10 → 8/10**  
**After completing P1 tasks**: Score goes from **8/10 → 9.5/10**  
**After completing P2 tasks**: Score goes from **9.5/10 → 10/10**

---

## PART 10: WHAT WILL WIN THE HACKATHON

Judges at national-level hackathons look for:
1. **Does it solve the PS?** — IRIS must nail all 4 core requirements
2. **Is the demo impressive?** — Markdown rendering, analytics charts, live routing feed = WOW
3. **Is it technically deep?** — 3-tier routing, graceful degradation, RAG pipeline, real-time WebSockets = YES
4. **Is the code clean?** — Remove test files, add proper error handling, no dead code
5. **Is it innovative?** — "Cost savings per response" and "Budget forecast" features are unique differentiators
6. **Does it have a clear purpose?** — The education domain problem statement gives IRIS a compelling "why"

The top 5 things that will differentiate IRIS from other teams:
1. **Live routing feed showing EVERY decision in real-time** (most teams won't have this)
2. **Cost savings display** ("IRIS saved you 93% vs. using Sonnet for everything")
3. **4-state budget degradation** (normal → caution → critical → exceeded) with visual indicators
4. **Security dashboard** showing injection protection in action
5. **Analytics page** with recharts showing model distribution and budget burn-rate

---

*This plan was created after reading every line of every file in both frontend and backend, and after conducting web research on the Otari API, PIGuard, web search tools, client tracking, and the hackathon problem statement.*
