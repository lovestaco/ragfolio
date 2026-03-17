import { motion } from "framer-motion";

export function Experience() {
  return (
    <section
      id="experience"
      className="py-12 px-4 border-t border-zinc-800/50 bg-gradient-to-br from-[#1a093b] via-[#2a145c] to-[#0f0c29]"
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-purple-300 mb-6">
          Experience
        </h2>
        <div className="space-y-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative pl-8 border-l border-purple-900"
          >
            <div className="absolute w-3 h-3 bg-purple-500 rounded-full -left-[6.5px] top-1.5 ring-4 ring-purple-900 animate-pulse"></div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-purple-200">
                Software Development Engineer Intern
              </h3>
              <span className="text-sm text-purple-400 font-mono">
                Sep 2021 – Feb 2023
              </span>
            </div>
            <p className="text-purple-300 text-sm mb-3">
              Hexmos, Bengaluru, India
            </p>
            <div className="bg-zinc-900/60 rounded-xl shadow-md shadow-purple-900/10 p-6">
              <p className="text-zinc-200 text-sm leading-relaxed">
                Built production-grade systems across backend, frontend, and
                DevOps. Developed LiveAPI (API documentation automation),
                payment and licensing infrastructure, and private runner setups.
                Implemented REST APIs (Python/Django, Node.js, Go), designed
                PostgreSQL schemas, optimized LLM prompts, and contributed to
                FreeDevTools (static platform, SEO, Meilisearch, 8M+
                impressions). Mentored 4 students into web developers.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
