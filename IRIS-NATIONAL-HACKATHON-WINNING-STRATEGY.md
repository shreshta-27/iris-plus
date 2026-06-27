# IRIS — National Hackathon Winning Strategy: The Educational "FinOps & Security" Gateway

> **The Goal**: Win the Ignite Room × Mozilla.ai National Hackathon (Build With Otari Track).
> **The Strategy**: Move beyond a basic "wrapper" app. Position IRIS as a **mission-critical Educational AI Gateway** that implements advanced AI FinOps (Financial Operations) and enterprise-grade security using Mozilla Otari.

---

## 1. THE CORE PROBLEM (The "Why")

### The AI Cost Crisis in Developing Education
While premium AI models (like Claude Sonnet 4.6 or GPT-4o) offer incredible reasoning capabilities, they are financially inaccessible for mass deployment in schools, universities, and EdTech platforms in developing nations. 

When a school gives students unfiltered access to premium AI:
1. **Financial Hemorrhage**: Students use expensive flagship models for trivial tasks like *"Define HTTP"* or *"What is 2+2?"*, burning through institutional API budgets in hours.
2. **Security Vulnerabilities**: Students actively attempt "jailbreaks" and prompt injections to bypass academic guardrails, hijack the AI for non-academic uses, or extract system prompts.

### The Purpose of IRIS
**IRIS (Intelligent Routing & Injection-Safe System)** is designed specifically to solve this crisis. It acts as an intelligent, cost-aware middleware proxy between the student and the LLMs. 

IRIS democratizes AI access by stretching an institution's limited budget (e.g., $2/day) to its absolute maximum mathematical limit. It does this through **Dynamic FinOps Routing** and **Zero-Cost Semantic Caching**, ensuring that premium dollars are only spent on premium problems (like complex coding or deep reasoning), while trivial queries cost fractions of a cent—or exactly $0.00.

---

## 2. HACKATHON PS TRACK ALIGNMENT (Nailing the Rubric)

We will win by directly targeting the Mozilla.ai Otari capabilities that the judges built the platform to showcase.

### Criterion 1: Dynamic Model Routing (AI FinOps)
- **The Market Standard**: Users manually select a model from a dropdown, leading to massive overspending.
- **The IRIS 10/10 Solution**: A deterministic, NLP-based complexity classifier (scoring 0-100). It analyzes prompt length, syntax, mathematical presence, and reasoning indicators.
  - **Tier 1 (Factual / Simple)** → Kimi K2.6 ($0.0001/call)
  - **Tier 2 (Explanatory)** → Claude Haiku 4.5 ($0.0005/call)
  - **Tier 3 (Analytical / Coding)** → Claude Sonnet 4.6 ($0.006/call)

### Criterion 2: Budget Awareness & Graceful Degradation
- **The Market Standard**: The API returns a 429 Insufficient Quota error and the app crashes.
- **The IRIS 10/10 Solution**: 
  - Tracks individual per-user consumption via Otari's `client_id` tracking.
  - Implements a **4-Stage Graceful Degradation Engine**:
    - *Normal*: Full 3-tier routing.
    - *Caution (80% budget)*: Tier 3 downgraded to Tier 2.
    - *Critical (95% budget)*: All queries downgraded to Tier 1.
    - *Exceeded (100%)*: Premium API locked; falls back entirely to the $0 local Knowledge Base.

### Criterion 3: Prompt Injection Protection (PIGuard)
- **The Market Standard**: Flimsy, hardcoded client-side regex lists (`if prompt.includes("ignore")`).
- **The IRIS 10/10 Solution**: Fully integrates with **Mozilla.ai's PIGuard** at the gateway level. By properly formatting requests through `api.otari.ai`, malicious payloads are intercepted at the edge infrastructure. This means prompt injection attempts cost the school **$0** because the LLM is never invoked. We visualize this security layer in the UI with an active "Shield Status" badge.

### Criterion 4: Usage Transparency
- **The Market Standard**: Hidden costs; users have no idea what a query costs.
- **The IRIS 10/10 Solution**: Extreme transparency. Every chat bubble displays a **Routing Chip** showing the model used, the complexity score, and the exact micro-cent cost. A global **Live Routing Feed** (via WebSockets) shows real-time platform metrics.

---

## 3. "BEYOND THE BASICS" (The "Wow" Factors for 1st Place)

To guarantee a win against elite teams, we must build advanced features that show deep technical architecture.

### Innovation 1: "Zero-Cost" Semantic Caching (Advanced RAG)
Currently, IRIS uses a basic string-matching knowledge base. We will upgrade this to a highly optimized local RAG pipeline.
- **How it works**: Before making an Otari API call, we check a robust local Knowledge Base containing 50+ common educational concepts (CS, Math, Science). We will implement a hybrid-search algorithm (BM25-style keyword matching + synonym normalization). 
- **The Impact**: When a cache hit occurs, the response is instant and the cost is exactly **$0.00**. This demonstrates elite API cost optimization.

### Innovation 2: "Counterfactual Cost" Analytics (The ROI Dashboard)
Judges love hard numbers. We will build an Analytics Dashboard that proves our worth.
- **The Feature**: Every time IRIS routes to a cheaper model, we calculate what it *would* have cost if the student had forced the flagship model (Sonnet). 
- **The Impact**: The dashboard will display a massive metric: *"Intelligent Routing has saved this institution $X.XX today (94% reduction in API overhead)."*

### Innovation 3: Server-Side Web Search (Otari Tools Integration)
The current Career Simulator fails to use Otari's native web search because of a formatting error in the code.
- **The Fix**: We will implement the correct `{ "type": "otari_web_search" }` tool payload. 
- **The Impact**: When a student asks for "2026 tech salary trends in India", the Otari gateway will execute a live web search before passing context to the LLM, preventing hallucinations and providing real-time data.

### Innovation 4: Multi-Modal Quiz Forge (PDF Parsing)
- **The Feature**: We will activate the dormant `pdf-parse` and `multer` libraries in the codebase.
- **The Impact**: Instead of just pasting text, students can upload entire PDF lecture slides. IRIS will parse the text, route to the heavy Sonnet model, and generate an adaptive JSON-based multiple-choice quiz.

---

## 4. THE STEP-BY-STEP ENGINEERING PLAN

This is the exact sequence of technical execution to upgrade the codebase from a 5/10 to a 10/10.

### Phase 1: Gateway & Core Backend Repairs (P0)
1. **PIGuard Enforcement**: Remove the bypassable hardcoded keyword filter in `ai.controller.js`. Rely entirely on the Otari gateway 400/403 error responses to flag injection attempts.
2. **Otari Payload Fix**: Correct the Otari service to use proper `role: "system"` messages (currently injected insecurely into the user prompt) and implement the correct `otari_web_search` tool syntax.
3. **Per-Tenant Budgeting**: Map the in-memory budget system to MongoDB (`BudgetTracker.model.js`) and pass `client_id` to Otari for true multi-tenant tracking.

### Phase 2: UI & Analytics Overhaul (P1)
1. **Markdown Rendering**: Install `react-markdown` so the AI's output (code blocks, bold text, lists) renders beautifully instead of as a giant block of raw text.
2. **Security & FinOps Dashboard**: Build `/dashboard/analytics` using Recharts to visualize the budget burn rate, model distribution (Pie Chart), and the Counterfactual Savings metric.
3. **Mobile Responsiveness**: Add a hamburger slide-out menu to the dashboard layout. A critical oversight for hackathon demos.

### Phase 3: Advanced Capabilities (P2)
1. **Expand RAG Pipeline**: Re-write `rag.service.js` to use a lower threshold and synonym mapping, and populate `knowledge-base.json` with massive amounts of academic data.
2. **PDF Integration**: Build the Multer upload route for the Quiz component.
3. **Persistent Memory**: Hook up the existing `Session.model.js` to save chat histories to MongoDB, allowing users to reload previous conversations.

---

## 5. THE WINNING PITCH SCRIPT

> *"Ladies and gentlemen, the biggest barrier to AI in education isn't capability; it's cost and safety.* 
> 
> *Schools cannot afford to pay GPT-4 prices when a student asks 'What is an atom?', and they cannot risk students bypassing safety protocols to generate harmful content. We built IRIS to be the ultimate Educational FinOps Gateway.* 
>
> *Powered by Mozilla Otari, IRIS intercepts every student query. Our custom NLP engine analyzes the complexity of the question and routes it to the most cost-efficient model available—reserving premium models for premium problems, and routing trivial queries to models that cost fractions of a cent, or even $0 through our local semantic cache.*
> 
> *Simultaneously, we leverage Otari's PIGuard at the infrastructure edge to automatically intercept prompt injection attacks before they ever reach the LLM.* 
> 
> *The result? IRIS allows educational institutions to stretch a standard $2 API budget to serve over 20,000 queries securely, saving over 90% in API overhead while maintaining enterprise-grade safety. We aren't just an AI assistant; we are the infrastructure that makes AI scalable for the developing world."*
