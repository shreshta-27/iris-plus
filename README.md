<div align="center">
  <img src="https://img.shields.io/badge/Track-Build_With_Otari-red?style=for-the-badge" alt="Build With Otari Track" />
  <img src="https://img.shields.io/badge/Focus-AI_FinOps_%26_Security-blue?style=for-the-badge" alt="Focus" />
  <h1>IRIS</h1>
  <h3>Intelligent Routing & Injection-Safe System</h3>
  <p>The Ultimate Cost-Aware Educational AI Gateway powered by Mozilla Otari.</p>
</div>

---

## 🛑 The Problem Statement (PS)

**Hackathon Challenge:** Build an AI assistant that makes intelligent runtime decisions while optimizing cost, security, and performance. 
**Core Requirements:** Dynamic Model Routing, Budget Awareness, Prompt Injection Protection, Usage Transparency.

**The Real-World Crisis:** In developing nations, educational institutions cannot afford unlimited premium AI access. A single student asking GPT-4 "What is photosynthesis?" drains the budget. If institutions provide unfiltered access, they face **Financial Hemorrhage** (burning a $2 API budget in hours) and **Security Vulnerabilities** (prompt injections bypassing academic guardrails).

## 💡 Our Solution: IRIS

**IRIS** is a mission-critical AI FinOps (Financial Operations) middleware proxy. It democratizes AI access by stretching an institution's limited budget to its absolute mathematical maximum. 

By leveraging **Dynamic Model Routing**, **Zero-Cost Semantic Caching**, and **Otari PIGuard**, IRIS ensures premium dollars are *only* spent on premium problems (like complex coding), while trivial queries cost fractions of a cent—or exactly **$0.00**.

---

## 🎯 How We Solved the Core PS Requirements

### 1. Dynamic Model Routing (AI FinOps)
* **The Challenge:** Route simple & complex prompts to the right model.
* **Our Solution:** A deterministic NLP-based complexity classifier (scoring 0-100) analyzes prompt length, syntax, mathematical presence, and reasoning indicators.
  * **Tier 1 (Factual/Simple):** Routes to Kimi K2.6 ($0.0001/call)
  * **Tier 2 (Explanatory):** Routes to Claude Haiku 4.5 ($0.0005/call)
  * **Tier 3 (Analytical/Coding):** Routes to Claude Sonnet 4.6 ($0.006/call)

### 2. Budget Awareness & Graceful Degradation
* **The Challenge:** Operate within the $2 budget and handle budget limits gracefully.
* **Our Solution:** Per-user consumption tracking via Otari's `client_id` with a **4-Stage Graceful Degradation Engine**:
  * *Normal:* Full 3-tier routing available.
  * *Caution (80% used):* Complex queries are downgraded to Tier 2 (Haiku).
  * *Critical (95% used):* All queries are downgraded to Tier 1 (Kimi).
  * *Exceeded (100%):* API locked; falls back to the **$0 Local Knowledge Base**.

### 3. Prompt Injection Protection (PIGuard)
* **The Challenge:** Detect and block malicious prompts before reaching the model.
* **Our Solution:** Seamless integration with **Mozilla Otari PIGuard** at the gateway level. Malicious payloads are intercepted at the edge infrastructure. When an injection is attempted, it costs the school **$0** (since the LLM is never invoked), and the UI displays an active "Shield Status" blocked badge. 

### 4. Usage Transparency
* **The Challenge:** Display the selected model, routing reason, and request cost.
* **Our Solution:** Extreme transparency. Every chat bubble features a **Routing Chip** showing the selected model, the complexity score, and the exact micro-cent cost. A global **Live Routing Feed** (via WebSockets) streams real-time routing metrics, giving full cost literacy to the user.

---

## 🔥 "WOW" Features (Beyond the Basics)

1. **"Zero-Cost" Semantic Caching (Advanced RAG):** 
   Before any API call, IRIS queries a local RAG Knowledge Base. A cache hit results in an instant response costing **$0.00**.
2. **Counterfactual Cost Analytics (ROI Dashboard):** 
   Calculates the money saved. (e.g., *"This response cost $0.0004. With Sonnet, it would cost $0.0060. IRIS saved you 93%."*)
3. **Smallest.ai Neural TTS Integration:** 
   Replaces robotic browser speech with **Lightning-v3.1** models for sub-100ms latency, driving a real-time **3D Avatar Lip-Sync Pipeline** (Three.js/Web Audio API).
4. **Server-Side Web Search:** 
   Uses Otari's `{ "type": "otari_web_search" }` tool to fetch real-time internet data (e.g., 2026 Salary Trends in the Career Simulator) preventing hallucinations.

---

## 🏗️ Technical Architecture & Stack Deep-Dive

### Frontend (Next.js 16)
The frontend uses a highly customized **Neo-Brutalist** design system combined with cyber-glow aesthetics (Tailwind CSS v4).
* **Framework:** Next.js 16 (App Router), React 19
* **3D & Animations:** `@react-three/fiber` for interactive elements (3D Globe on Landing Page, 3D Avatar Lip-sync), Framer Motion for UI transitions.
* **Data Viz & Real-time:** Recharts for FinOps analytics, `socket.io-client` for the real-time Live Routing Feed.
* **UI Structure:** Split-layout Dashboard. Main area for Chat/Quiz/Career generation, and a persistent right-hand sidebar for live socket routing events. Includes `BudgetMeter` and `RoutingChip` components.

### Backend (Node.js & Express)
The backend acts as the central middleware proxy between the users and the LLM/TTS providers.
* **Framework & DB:** Express.js, MongoDB (persistent Sessions, Budget Tracking, Auth).
* **Core Services:**
  - `otari.service.js`: Manages LLM payload mapping, system prompts formatting, and web search tools logic.
  - `budget.service.js`: Implements the 4-stage graceful degradation based on percentage budget consumed.
  - `classifier.service.js`: Deterministic NLP complexity scorer that classifies text as simple, medium, or complex for routing.
  - `rag.service.js`: Semantic cache interceptor for $0 responses.
* **APIs:** Mozilla Otari Gateway (LLMs + PIGuard), Smallest.ai Waves API (TTS - Lightning-v3.1).

### Mobile App (Flutter)
* **Framework:** Flutter (Dart) for Android and iOS.
* **Integration:** Re-uses the backend FinOps logic. By pointing to the IRIS API, the mobile app natively inherits the Dynamic Routing, Budget Management, and Prompt Injection detection.

---

## 🔄 System Flow & Logic (Lifecycle of a Prompt)

1. **Input:** User sends a query via Web or Mobile Chat Interface.
2. **Gateway Interception:** Node.js backend intercepts the request and validates the JWT and current Budget State.
3. **Cache / RAG Check:** `rag.service.js` checks the local semantic cache. If a hit occurs -> return instantly ($0).
4. **Complexity Classification:** `classifier.service.js` analyzes the prompt string using NLP logic to score it (0-100), placing it in Tier 1, 2, or 3.
5. **Budget Degradation:** `budget.service.js` verifies the user's limits. If approaching limits, it enforces a downgrade (e.g., Tier 3 -> Tier 2).
6. **Otari Execution (Security + LLM):** The payload is sent to Mozilla Otari. Otari's Edge PIGuard scans for malicious injections. If safe, it routes the query to Kimi, Haiku, or Sonnet. Web-search is appended if necessary.
7. **Cost Logging:** Backend intercepts the token usage, updates the MongoDB budget document, and broadcasts the micro-cent cost via WebSockets.
8. **TTS Generation:** Output text is forwarded to Smallest.ai to synthesize speech as a WAV buffer.
9. **Delivery:** The UI receives the payload, renders Markdown, updates the Live Routing Feed, and drives the 3D Avatar's morph targets using the Web Audio API for lip-sync.
