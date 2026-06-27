'use client';
import { motion } from 'framer-motion';
import { RiRobot2Line, RiBookOpenLine, RiRocketLine } from 'react-icons/ri';

const features = [
  {
    icon: RiRobot2Line,
    title: 'AI Assistant',
    subtitle: 'Core Feature',
    description: 'Ask anything from simple facts to complex coding problems. IRIS routes each query to the optimal model, showing exactly what model answered and why.',
    tags: ['Dynamic Routing', 'Budget Aware', 'Injection Safe'],
    gradient: 'from-iris-600 to-iris-400',
  },
  {
    icon: RiBookOpenLine,
    title: 'Smart Quiz Forge',
    subtitle: 'Study Tool',
    description: 'Upload your notes or enter a topic — IRIS generates adaptive multiple-choice quizzes and provides personalized feedback on wrong answers.',
    tags: ['AI Grading', 'Personalized Tips', 'Any Subject'],
    gradient: 'from-amber-500 to-orange-400',
  },
  {
    icon: RiRocketLine,
    title: 'Career Simulator',
    subtitle: 'Future Planning',
    description: 'Enter your skills or upload your resume. Get 3 data-backed career paths with real salary ranges, skill gaps, and actionable steps.',
    tags: ['Web Search', 'Live Salaries', '3 Paths'],
    gradient: 'from-emerald-500 to-teal-400',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6 bg-brutal-card">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Three <span className="gradient-text">Powerful</span> Tools
          </h2>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Every feature is powered by the same intelligent routing infrastructure
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="neo-card p-8 flex flex-col"
            >
              <div className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br ${feat.gradient} mb-6`}>
                <feat.icon className="w-6 h-6 text-white" />
              </div>

              <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">
                {feat.subtitle}
              </p>
              <h3 className="text-2xl font-black text-white mb-3">{feat.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                {feat.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {feat.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-xs font-mono font-bold bg-brutal-black border border-brutal-border text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
