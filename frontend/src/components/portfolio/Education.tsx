import { motion } from "framer-motion";

export function Education() {
  return (
    <section className="py-12 px-4 border-t border-zinc-800/50 bg-gradient-to-br from-[#1a093b] via-[#2a145c] to-[#0f0c29]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-purple-300 mb-6">
          Education
        </h2>
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl bg-purple-900/30 border border-purple-700 hover:border-purple-400 transition-all shadow-lg shadow-purple-900/20 backdrop-blur-lg"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-purple-200">
                Bachelor of Engineering in Computer Science
              </h3>
              <span className="text-sm text-purple-400 font-mono">
                2019–2023
              </span>
            </div>
            <p className="text-purple-300">
              Moodlakatte Institute of Technology
            </p>
            <p className="text-sm text-purple-200 mt-4 leading-relaxed italic">
              Built foundational knowledge in programming (Java, Python),
              databases (SQL), and computer science fundamentals.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
