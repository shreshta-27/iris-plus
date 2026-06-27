import express from 'express';

const app = express();
app.use(express.json());

app.post('/v1/chat/completions', (req, res) => {
  const { messages, model, guardrails } = req.body;
  
  // Simulate prompt injection detection
  if (guardrails && guardrails.length > 0) {
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';
    if (lastMessage.includes('ignore all') || lastMessage.includes('jailbreak')) {
      return res.status(400).json({
        error: { message: "prompt_injection_detected", type: "security" }
      });
    }
  }

  // Simulate an AI response based on the prompt
  const lastMessage = messages[messages.length - 1]?.content || '';
  let mockAnswer = `This is a live mock response from the local Otari proxy! You said: "${lastMessage}". The routing engine selected model: ${model}.`;

  if (lastMessage.includes('career')) {
    mockAnswer = JSON.stringify({
      paths: [
        { title: "Software Engineer", timeframe: "12-24 months", salaryRange: "₹8–15 LPA", skills: ["JavaScript", "React"], steps: ["Build projects"], difficulty: "intermediate" },
        { title: "AI Developer", timeframe: "24-36 months", salaryRange: "₹12–25 LPA", skills: ["Python", "Machine Learning"], steps: ["Learn PyTorch"], difficulty: "advanced" },
        { title: "Product Manager", timeframe: "36-48 months", salaryRange: "₹15–30 LPA", skills: ["Agile", "Strategy"], steps: ["Get MBA"], difficulty: "advanced" }
      ]
    });
  } else if (lastMessage.includes('quiz') || lastMessage.includes('questions')) {
    mockAnswer = JSON.stringify({
      questions: [
        { id: 1, question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Text Machine Language", "Hyperlink Text Markup Language", "Home Tool Markup Language"], correct: 0, explanation: "HTML is the standard markup language for creating Web pages." },
        { id: 2, question: "What is 2 + 2?", options: ["3", "4", "5", "6"], correct: 1, explanation: "Basic math." }
      ]
    });
  }

  res.json({
    id: "mock-chat-123",
    object: "chat.completion",
    created: Date.now(),
    model: model,
    choices: [{
      index: 0,
      message: { role: "assistant", content: mockAnswer },
      finish_reason: "stop"
    }],
    usage: {
      prompt_tokens: 25,
      completion_tokens: 50,
      total_tokens: 75
    }
  });
});

app.listen(5001, () => {
  console.log('Otari MOCK API running on port 5001');
});
