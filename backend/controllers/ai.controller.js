import { classifyPrompt } from '../services/classifier.service.js';
import {
  getBudgetState, getDegradedModel, getBudgetMode,
  recordSpend, recordBlockedCall, getAllBudgetStats
} from '../services/budget.service.js';
import { searchKnowledgeBase, getCachedResponse, setCachedResponse } from '../services/rag.service.js';
import { callOtari } from '../services/otari.service.js';
import { emitRoutingEvent } from '../services/socket.service.js';
import { MODELS } from '../config/otari.js';
import { detectInjection, validateResponse } from '../services/injection.service.js';
import { SecurityLog } from '../models/SecurityLog.model.js';
import { Session } from '../models/Session.model.js';

const MODEL_DISPLAY_NAMES = {
  'mzai:moonshotai/Kimi-K2.6': 'Kimi K2.6',
  'anthropic:claude-haiku-4-5': 'Claude Haiku 4.5',
  'anthropic:claude-sonnet-4-6': 'Claude Sonnet 4.6',
};

export async function handleAIChat(req, res, next) {
  try {
    const { message, sessionId, chatHistory = [], socraticMode = false } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!message?.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const startTime = Date.now();
    
    // Moving Train Step 1: Query Received
    emitRoutingEvent(sessionId, {
      type: 'routing_step',
      step: 1,
      status: 'analyzing',
      message: 'Query Received. Analyzing intent...',
      timestamp: new Date().toISOString()
    });

    const trackingId = userId ? userId.toString() : (sessionId || 'demo-session-id');
    const budgetStatsBefore = await getAllBudgetStats(trackingId);

    // 1. Zero-Cost Semantic Caching / RAG
    const ragResult = searchKnowledgeBase(message);
    if (ragResult && ragResult.score > 0.5) {
      const responsePayload = {
        answer: ragResult.answer,
        source: 'knowledge-base',
        routing: {
          model: 'Local KB',
          tier: 'cached',
          reason: `Answered from local knowledge base (Score: ${Math.round(ragResult.score * 100)}%)`,
          score: Math.round(ragResult.score * 100),
          modelDisplayName: 'Local KB',
          degraded: false,
          budgetMode: budgetStatsBefore.mode,
        },
        cost: {
          thisCall: 0,
          thisCallFormatted: '$0.000000',
          spent: budgetStatsBefore.spent,
          remaining: budgetStatsBefore.remaining,
          percentUsed: budgetStatsBefore.percentUsed,
          mode: budgetStatsBefore.mode,
        },
        costSavings: {
          actualCost: 0,
          worstCaseCost: 0.006,
          saved: 0.006,
          savedPercent: 100,
        },
        injectionStatus: 'clean',
      };

      // Save to Chat Session History in MongoDB
      if (userId && sessionId) {
        await Session.findOneAndUpdate(
          { sessionId, userId },
          {
            $push: {
              messages: [
                { role: 'user', content: message },
                {
                  role: 'assistant',
                  content: ragResult.answer,
                  routing: responsePayload.routing,
                  cost: 0,
                  injectionStatus: 'clean',
                }
              ]
            }
          },
          { upsert: true }
        );
      }

      emitRoutingEvent(sessionId, {
        type: 'routing_decision',
        ...responsePayload.routing,
        cost: responsePayload.cost,
        timestamp: new Date().toISOString(),
      });

      return res.json(responsePayload);
    }

    // 2. Query Cache
    const cachedResponse = getCachedResponse(message);
    if (cachedResponse) {
      const responsePayload = {
        ...cachedResponse,
        source: 'cache',
        cost: {
          thisCall: 0,
          thisCallFormatted: '$0.000000',
          spent: budgetStatsBefore.spent,
          remaining: budgetStatsBefore.remaining,
          percentUsed: budgetStatsBefore.percentUsed,
          mode: budgetStatsBefore.mode,
        },
      };

      emitRoutingEvent(sessionId, {
        type: 'routing_decision',
        ...responsePayload.routing,
        cost: responsePayload.cost,
        timestamp: new Date().toISOString(),
      });

      return res.json(responsePayload);
    }

    // Moving Train Step 2: Context Window & Security Check
    emitRoutingEvent(sessionId, {
      type: 'routing_step',
      step: 2,
      status: 'analyzing',
      message: `Estimating Context Window: ~${Math.round(message.length / 4)} tokens. Running PIGuard...`,
      timestamp: new Date().toISOString()
    });

    // 3. Local Injection Detection (Layer 1)
    const localInjectionResult = detectInjection(message);
    if (localInjectionResult.isInjection) {
      await recordBlockedCall(trackingId);
      
      await SecurityLog.create({
        sessionId,
        userId,
        promptSnippet: message.substring(0, 200),
        threatLevel: 'blocked',
        detectionLayer: 'local',
        matchedPatterns: localInjectionResult.matchedPatterns,
        heuristicFlags: localInjectionResult.heuristicFlags,
        confidence: localInjectionResult.confidence,
        action: 'blocked',
        cost: 0,
      });

      emitRoutingEvent(sessionId, {
        type: 'injection_blocked',
        message: message.substring(0, 50) + '...',
        timestamp: new Date().toISOString(),
      });

      return res.status(400).json({
        error: 'prompt_injection_detected',
        message: 'Your message was flagged as a potential prompt injection attempt and blocked by the local security guardrail.',
        injectionStatus: 'blocked',
        cost: { thisCall: 0, ...budgetStatsBefore },
      });
    }

    // Moving Train Step 3: Routing Logic
    emitRoutingEvent(sessionId, {
      type: 'routing_step',
      step: 3,
      status: 'routing',
      message: `Security passed. Evaluating query complexity for optimal routing...`,
      timestamp: new Date().toISOString()
    });

    // 4. Dynamic Prompt Classification
    const classification = classifyPrompt(message);
    const baseModel = MODELS[classification.tier.toUpperCase()];

    // 5. Budget Status & Graceful Degradation
    const budgetMode = await getBudgetMode(trackingId);
    if (budgetMode === 'exceeded') {
      return res.status(429).json({
        error: 'budget_exceeded',
        message: `Daily AI budget of $${budgetStatsBefore.total.toFixed(2)} has been reached. Please try again in a new session.`,
        budgetStats: budgetStatsBefore,
      });
    }

    const selectedModel = await getDegradedModel(trackingId, baseModel);
    const degraded = selectedModel !== baseModel;
    
    let degradeReason;
    if (degraded) {
      degradeReason = `[BUDGET FALLBACK] ⚠️ ${budgetMode.toUpperCase()} mode! Downgraded from ${MODEL_DISPLAY_NAMES[baseModel]} to Budget ${MODEL_DISPLAY_NAMES[selectedModel]}. Intent: ${classification.reason}`;
    } else {
      const tierName = classification.tier === 'simple' ? 'Budget' : 'Premium';
      degradeReason = `[BUDGET HEALTHY] ✅ Sufficient funds ($${budgetStatsBefore.remaining.toFixed(2)} left). Safely routed to ${tierName} ${MODEL_DISPLAY_NAMES[selectedModel]}. Intent: ${classification.reason}`;
    }

    let injectionStatus = localInjectionResult.threatLevel === 'suspicious' ? 'monitor' : 'clean';
    let otariResult;

    // Moving Train Step 4: Model Selected
    emitRoutingEvent(sessionId, {
      type: 'routing_step',
      step: 4,
      status: 'routing',
      message: `Routed to ${MODEL_DISPLAY_NAMES[selectedModel]}. ${degradeReason}`,
      timestamp: new Date().toISOString()
    });

    emitRoutingEvent(sessionId, {
      type: 'routing_step',
      step: 5,
      status: 'generating',
      message: `Streaming response from ${MODEL_DISPLAY_NAMES[selectedModel]}...`,
      timestamp: new Date().toISOString()
    });

    // 6. Otari API Call with edge guardrail (Layer 2)
    try {
      otariResult = await callOtari({
        model: selectedModel,
        messages: [
          ...chatHistory.slice(-6),
          { role: 'user', content: message },
        ],
        systemPrompt: socraticMode 
          ? `You are IRIS, an intelligent AI Socratic Tutor for students. 
             Your core directives:
             1. NEVER just give the final answer to a homework, math, or coding problem. Instead, ask guiding questions and guide the student to figure it out themselves.
             2. Protect privacy: Never ask for or reveal Personal Identifiable Information (PII).
             3. Be helpful, concise, and educational.
             Current budget mode: ${budgetMode}. 
             Today's date: ${new Date().toLocaleDateString()}.`
          : `You are IRIS, an intelligent AI assistant for students. 
             Be helpful, concise, and educational. 
             Current budget mode: ${budgetMode}. 
             Today's date: ${new Date().toLocaleDateString()}.`,
        guardrailMode: 'block', // Enforce blocking at the gateway
        useWebSearch: classification.signals.needsWebSearch,
        sessionId,
      });
    } catch (err) {
      // If Otari blocks the request due to injection
      if (err?.status === 400 || err?.status === 403 || err?.message?.toLowerCase().includes('injection') || err?.message?.toLowerCase().includes('guardrail')) {
        injectionStatus = 'blocked';
        await recordBlockedCall(sessionId);

        await SecurityLog.create({
          sessionId,
          userId,
          promptSnippet: message.substring(0, 200),
          threatLevel: 'blocked',
          detectionLayer: 'piguard',
          matchedPatterns: [{ category: 'gateway_block', label: 'Otari PIGuard Gateway Block', severity: 1.0 }],
          confidence: 1.0,
          action: 'blocked',
          cost: 0,
        });

        emitRoutingEvent(sessionId, {
          type: 'injection_blocked',
          message: message.substring(0, 50) + '...',
          timestamp: new Date().toISOString(),
        });

        return res.status(400).json({
          error: 'prompt_injection_detected',
          message: 'Your message was flagged as a potential prompt injection attempt and blocked by Mozilla Otari PIGuard.',
          injectionStatus: 'blocked',
          cost: { thisCall: 0, ...await getAllBudgetStats(sessionId) },
        });
      }
      
      // Pass other errors up
      throw err;
    }

    // 7. Response Validation (Layer 3)
    const systemPromptSnippets = ['You are IRIS', 'intelligent AI assistant', 'budget mode'];
    const responseValidation = validateResponse(otariResult.answer, systemPromptSnippets);
    if (!responseValidation.safe) {
      injectionStatus = 'blocked';
      await recordBlockedCall(sessionId);

      await SecurityLog.create({
        sessionId,
        userId,
        promptSnippet: message.substring(0, 200),
        threatLevel: 'blocked',
        detectionLayer: 'response',
        matchedPatterns: [{ category: 'response_leak', label: 'System Prompt Leak Detected', severity: 0.9 }],
        confidence: 0.9,
        action: 'blocked',
        cost: 0,
      });

      return res.status(400).json({
        error: 'prompt_injection_detected',
        message: 'The AI response was intercepted due to a potential security/instruction leak.',
        injectionStatus: 'blocked',
        cost: { thisCall: 0, ...await getAllBudgetStats(sessionId) },
      });
    }

    // 8. Log suspicious events that were monitored but passed
    if (injectionStatus === 'monitor') {
      await SecurityLog.create({
        sessionId,
        userId,
        promptSnippet: message.substring(0, 200),
        threatLevel: 'suspicious',
        detectionLayer: 'local',
        matchedPatterns: localInjectionResult.matchedPatterns,
        heuristicFlags: localInjectionResult.heuristicFlags,
        confidence: localInjectionResult.confidence,
        action: 'passed',
        cost: otariResult.cost,
      });
    }

    // 9. Update Budget State
    const budgetState = await recordSpend(trackingId, selectedModel, otariResult.cost, {
      tier: classification.tier,
      score: classification.score,
      reason: degradeReason || classification.reason,
    });

    // 10. Calculate actual savings vs worst case (Sonnet)
    const worstCaseModel = MODELS.COMPLEX;
    const worstCaseRates = { input: 3.00, output: 15.00 };
    const worstCaseCost = (otariResult.inputTokens / 1_000_000 * worstCaseRates.input) + 
                          (otariResult.outputTokens / 1_000_000 * worstCaseRates.output);
    const saved = Math.max(0, worstCaseCost - otariResult.cost);
    const savedPercent = worstCaseCost > 0 ? (saved / worstCaseCost) * 100 : 0;

    const responsePayload = {
      answer: otariResult.answer,
      source: 'otari',
      routing: {
        tier: classification.tier,
        score: classification.score,
        reason: degradeReason || classification.reason,
        model: selectedModel,
        modelDisplayName: MODEL_DISPLAY_NAMES[selectedModel],
        degraded,
        budgetMode,
        analysisBreakdown: classification.analysis,
      },
      cost: {
        thisCall: otariResult.cost,
        thisCallFormatted: `$${otariResult.cost.toFixed(6)}`,
        spent: budgetState.spent,
        remaining: Math.max(0, budgetState.total - budgetState.spent),
        percentUsed: (budgetState.spent / budgetState.total) * 100,
        mode: budgetState.mode,
      },
      costSavings: {
        actualCost: otariResult.cost,
        worstCaseCost,
        saved,
        savedPercent: parseFloat(savedPercent.toFixed(1)),
      },
      tokens: {
        input: otariResult.inputTokens,
        output: otariResult.outputTokens,
      },
      injectionStatus,
    };

    // Cache the response
    setCachedResponse(message, {
      answer: otariResult.answer,
      routing: responsePayload.routing,
      injectionStatus,
    });

    const latencyMs = Date.now() - startTime;

    // Save to Chat Session History in MongoDB
    if (userId && sessionId) {
      // Find session or create one, add message
      await Session.findOneAndUpdate(
        { sessionId, userId },
        {
          $push: {
            messages: [
              { role: 'user', content: message },
              {
                role: 'assistant',
                content: otariResult.answer,
                routing: responsePayload.routing,
                cost: otariResult.cost,
                costSavings: responsePayload.costSavings,
                tokens: responsePayload.tokens,
                latencyMs,
                injectionStatus,
              }
            ]
          }
        },
        { upsert: true }
      );
    }

    // Moving Train Step 6: Done
    emitRoutingEvent(sessionId, {
      type: 'routing_step',
      step: 6,
      status: 'done',
      message: `Response generated in ${latencyMs}ms.`,
      timestamp: new Date().toISOString()
    });

    emitRoutingEvent(sessionId, {
      type: 'routing_decision',
      ...responsePayload.routing,
      cost: responsePayload.cost,
      costSavings: responsePayload.costSavings,
      tokens: responsePayload.tokens,
      timestamp: new Date().toISOString(),
    });

    return res.json(responsePayload);

  } catch (err) {
    next(err);
  }
}
