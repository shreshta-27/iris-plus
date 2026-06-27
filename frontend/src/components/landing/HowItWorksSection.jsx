'use client';
import { motion } from 'framer-motion';
import { RiSearchEyeLine, RiRouteLine, RiShieldLine, RiEyeLine } from 'react-icons/ri';

const steps = [
  {
    icon: RiSearchEyeLine,
    title: 'Classify',
    description: 'Your message is scored 0–100 for complexity using NLP signals',
    detail: 'Code detection, word count, multi-part analysis, debate signals',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500',
  },
  {
    icon: RiRouteLine,
    title: 'Route',
    description: 'Sent to Kimi, Haiku, or Sonnet based on complexity score',
    detail: '0–33 → Kimi K2.6 | 34–66 → Haiku 4.5 | 67–100 → Sonnet 4.6',
    color: 'text-amber-400',
    borderColor: 'border-amber-500',
  },
  {
    icon: RiShieldLine,
    title: 'Guard',
    description: 'PIGuard blocks prompt injections before AI sees anything',
    detail: 'Blocked calls cost $0 — model never reached',
    color: 'text-rose-400',
    borderColor: 'border-rose-500',
  },
  {
    icon: RiEyeLine,
    title: 'Reveal',
    description: 'Every response shows model, cost, and routing reasoning',
    detail: 'Full transparency on every single AI interaction',
    color: 'text-iris-400',
    borderColor: 'border-iris-500',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-brutal-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            How <span className="gradient-text">IRIS</span> Works
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Four steps between your question and the perfect response
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`neo-card p-6 border-t-4 ${step.borderColor}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`text-2xl font-black font-mono ${step.color}`}>
                  {String(i + 1).padStart(2, '0')}
                </div>
                <step.icon className={`w-6 h-6 ${step.color}`} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{step.description}</p>
              <p className="text-xs font-mono text-gray-600">{step.detail}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
