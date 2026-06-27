# IRIS Frontend Architecture & UI Analysis

Here is a comprehensive breakdown of the frontend for the IRIS application, including the tech stack, global styling, component architecture, and feature pages. I have also included an explanation of the requested GSD slash commands at the end.

---

## 1. Tech Stack Overview
- **Framework**: Next.js 16 (using the App Router) with React 19.
- **Styling**: Tailwind CSS v4, which utilizes the new inline `@theme` configuration within CSS.
- **Animations & 3D**: `framer-motion` for UI transitions and `@react-three/fiber` & `drei` for 3D elements (like the globe on the landing page).
- **Data Visualization**: `recharts` for charting.
- **Real-time Comms**: `socket.io-client` for real-time updates (used for the live routing feed).

## 2. UI Theme & Design System (Neo-Brutalism)
The application uses a highly customized **"Neo-Brutalist"** design system combined with cyber-glow aesthetics. This is entirely driven by `globals.css` and Tailwind.

### Color Palette
- **Backgrounds**: Deep, solid blacks (`--color-brutal-black: #0a0a0a`, `--color-brutal-card: #111111`).
- **Accents**: A custom "Iris" purple scale (`#7c3aed`, `#a78bfa`, `#6d28d9`).

### Key CSS Features (from `globals.css`)
- **Brutalist Shadows**: Instead of soft, blurry drop shadows, the app uses hard, solid shadows (`.shadow-brutal { box-shadow: 4px 4px 0px #7c3aed; }`). When hovering over buttons or cards, the element shifts up and the shadow expands.
- **Borders & Edges**: Elements use thick 2px borders (`border-2 border-brutal-border`) with sharp corners (`rounded-none`).
- **Glassmorphism & Gradients**: Uses a `.glass` class for blurred overlays (`backdrop-filter: blur(12px)`) and `.gradient-text` for vibrant, purple-to-violet text fills.
- **Custom Scrollbar**: A thin, custom dark scrollbar that turns bright purple when hovered over.
- **Typography**: Uses `var(--font-space-grotesk)` for modern, geometric headers/text, and `var(--font-jetbrains)` for code/monospaced text.

## 3. Page Architecture

### Landing Page (`/app/page.js`)
A promotional showcase built with distinct sections:
- `HeroSection`: The top banner, likely integrating the `ThreeGlobe.jsx` component for a 3D interactive feel.
- `HowItWorksSection` & `FeaturesSection`: Informational blocks detailing the AI routing and budget management.

### Authentication (`/app/(auth)`)
Contains `/login`, `/register`, and `/verify-otp`.
- **Layout**: Centered brutalist cards on a dark background.
- **Inputs**: Custom `.input-brutal` fields that have thick dark borders which snap to a purple glow on focus.
- **Buttons**: Thick, solid purple buttons (`.btn-primary`) that shift upward with a hard shadow when hovered.

### Main Dashboard (`/app/dashboard/page.js`)
The core interface of the app. It features a responsive split layout:
- **Main Chat Area**: Contains the `ChatWindow` and `ChatInput`. If the budget is running low, a `BudgetWarningBanner` appears at the top.
- **Sidebar (Live Routing Feed)**: A socket-connected feed (`LiveRoutingFeed.jsx`) that shows real-time events. It features a blinking green status dot when connected, showing exactly which AI models are being routed to and how much they cost.

## 4. Components Breakdown

### UI Base Components (`src/components/ui/`)
- **`BudgetMeter.jsx` & `BudgetWarningBanner.jsx`**: Visual components that tie into the backend budget system, showing users if their $2.00 session budget is in "normal", "caution", "critical", or "exceeded" states.
- **`RoutingChip.jsx`**: A small pill/badge that displays which AI tier handled a prompt (e.g., Simple/Kimi, Medium/Haiku, Complex/Sonnet).
- **`InjectionBadge.jsx`**: A specialized security badge that renders when Otari's PIGuard detects and blocks a malicious prompt injection attempt.
- **`Skeletons.jsx`**: Loading placeholders with a custom `.skeleton` CSS shimmer animation.

### Feature Components
- **Chat (`/chat`)**: Handles the AI conversation interface, rendering user messages and parsing AI responses.
- **Quiz (`/quiz`)**: The Quiz Forge interface where users can generate adaptive MCQs.
- **Career (`/career`)**: The Career Simulator interface for viewing generated career paths and salary data.

---

# GSD Slash Commands Explained

You asked to understand four specific commands. These are built-in workflow commands for the Gemini Agent (me) to help manage complex projects.

### 1. `/goal`
- **What it does**: This is an instruction for me (the agent) to run autonomously for a long time. 
- **Use Case**: If you want me to do something massive (like "refactor the entire backend to use GraphQL" or "build out 5 new pages"), you use `/goal`. It tells my system not to stop and ask for permission constantly, but rather to keep grinding through the task (even overnight) until it's completely finished.

### 2. `/gsd-add-phase`
- **What it does**: Adds a new "phase" to a structured project roadmap. It automatically calculates the next phase number, creates a directory for it in `.planning/`, and updates the project's roadmap file (`STATE.md`).
- **Use Case**: When you are planning a project in steps (Phase 1, Phase 2, etc.), using this command tells me to properly log and set up the workspace for the *next* step of development.

### 3. `/gsd-code-review`
- **What it does**: Spawns a specialized sub-agent whose sole job is to review the code that was written during a specific phase. It checks for bugs, security vulnerabilities, and code quality issues.
- **Use Case**: You run this after completing a phase (e.g., `/gsd-code-review 2`) to have an AI meticulously audit the new code before you merge it or move on. It outputs a detailed `REVIEW.md` report.

### 4. `/gsd-map-codebase`
- **What it does**: Spawns multiple parallel AI agents to deeply analyze an existing codebase. They read everything and generate 7 highly structured documents in `.planning/codebase/` (such as Architecture, Tech Stack, Testing Conventions).
- **Use Case**: You use this when I am dropped into a massive, already-existing project (a "brownfield" project) that I didn't build. Instead of me guessing how things work, this command forces me to map out the entire app so I understand the rules before I start writing code.
